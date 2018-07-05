const fetch = require('node-fetch')
const moment = require('moment')
const fs = require("fs")

const LEAGUE_ID = 9

var current_teams = {}

const HOST_PRODUCT = 'http://epodule.moka-a.io:3000'
const HOST_DEV = 'http://172.16.101.226:3000'

const HOST_URL = HOST_PRODUCT;

function makeBody(match) {
    /* league_id 6 : 롤챔스 2018 서머 */

    const homeTeam = current_teams.filter((team) => team.teamName.trim() === match.home.teamName.trim())[0]
    const homeTeamId = homeTeam ? homeTeam.id : -1

    const awayTeam = current_teams.filter((team) => team.teamName.trim() === match.away.teamName.trim())[0]
    const awayTeamId = awayTeam ? awayTeam.id : -1

    return {
        matchStartAt: moment(`${match.matchDate} ${match.matchTime}`, 'YYYY.MM.DD HH:mm').format('YYYY-MM-DDTHH:mm:ssZ'),
        matchEndAt: moment(`${match.matchDate} ${match.matchTime}`, 'YYYY.MM.DD HH:mm').format('YYYY-MM-DDTHH:mm:ssZ'),
        matchTimestamp: moment(`${match.matchDate} ${match.matchTime}`, 'YYYY.MM.DD HH:mm').unix(),
        homeTeamId: homeTeamId,
        awayTeamId: awayTeamId,
        homeScore: match.homeScore,
        awayScore: match.awayScore,
        leagueId: LEAGUE_ID,
        gameName: "롤",
        matchInfo: match.matchInfo
    }
}

async function postMatch(match) {
    const postBody = makeBody(match);

    // console.log(postBody)

    const res = await fetch(`${HOST_URL}/api/match/ifno`, {
        method: 'POST',
        body: JSON.stringify(postBody),
        headers: {
            'API-Key': 'mokaisthebest1004',
            'Content-Type': 'application/json'
        }
    })
    const json = await res.json()

    // console.log(json)
}

/**
 * Excute
 */

async function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

async function main() {
    /* Load teams from server */
    await loadTeams()

    /* Load matches data from disk */
    const buffer = fs.readFileSync("./lol_rift_rivers_data.json", "utf8");
    const data = JSON.parse(buffer.toString());

    for (element of data.matchs) {
        await postMatch(element)
        console.log("tick.. ")
        await sleep(77)
    }
}

async function loadTeams() {
    const res = await fetch(`${HOST_URL}/api/team?maxResultCount=300`, {
        method: 'GET',
        headers: {
            'API-Key': 'mokaisthebest1004',
            'Content-Type': 'application/json'
        }
    })
    const leaguesJson = await res.json()
    const teams = leaguesJson.result.items.filter((item) => parseInt(item.leagueId) == LEAGUE_ID)

    current_teams = teams
}

module.exports = {
    excute: async function () {
        await main()
    }
}