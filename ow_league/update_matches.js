const fetch = require('node-fetch')
const moment = require('moment')
const fs = require("fs")

const LEAGUE_ID = 2

var current_teams = {}

const HOST_PRODUCT = 'http://epodule.moka-a.io:3000'
const HOST_DEV = 'http://172.16.101.226:3000'

const HOST_URL = HOST_PRODUCT;

function makeBody(match) {
    const homeTeam = current_teams.filter((team) => sameTeam(team.teamName.trim(), match.home.teamName.trim()))[0]
    const homeTeamId = homeTeam ? homeTeam.id : -1
    
    const awayTeam = current_teams.filter((team) => sameTeam(team.teamName.trim(), match.away.teamName.trim()))[0]
    const awayTeamId = awayTeam ? awayTeam.id : -1

    return {
        matchStartAt: moment.unix(match.matchStartTime).format('YYYY-MM-DDTHH:mm:ssZ'),
        matchEndAt: moment.unix(match.matchEndTime).format('YYYY-MM-DDTHH:mm:ssZ'),
        matchTimestamp: match.matchStartTime,
        homeTeamId: homeTeamId,
        awayTeamId: awayTeamId,
        homeScore: match.homeScore,
        awayScore: match.awayScore,
        leagueId: LEAGUE_ID,
        gameName: "오버워치",
        matchInfo: match.matchInfo
    }
}

function sameTeam(epodule, official) {
    var isSame = false
    isSame = isSame || (official == "Philadelphia Fusion" && epodule == "필라델피아 퓨전" ? true : false)
    isSame = isSame || (official == "Boston Uprising" && epodule == "보스턴 업라이징" ? true : false)
    isSame = isSame || (official == "London Spitfire" && epodule == "런던 스핏파이어" ? true : false)
    isSame = isSame || (official == "Los Angeles Gladiators" && epodule == "LA 글래디에이터즈" ? true : false)
    isSame = isSame || (official == "Los Angeles Valiant" && epodule == "LA 발리언트" ? true : false)
    isSame = isSame || (official == "New York Excelsior" && epodule == "뉴욕 엑셀시어" ? true : false)
    isSame = isSame || (official == "San Francisco Shock" && epodule == "샌프란시스코 쇼크" ? true : false)
    isSame = isSame || (official == "Seoul Dynasty" && epodule == "서울 다이너스티" ? true : false)
    isSame = isSame || (official == "Dallas Fuel" && epodule == "댈러스 퓨얼" ? true : false)
    isSame = isSame || (official == "Shanghai Dragons" && epodule == "상하이 드래곤즈" ? true : false)
    isSame = isSame || (official == "Florida Mayhem" && epodule == "플로리다 메이헴" ? true : false)
    isSame = isSame || (official == "Houston Outlaws" && epodule == "휴스턴 아웃로즈" ? true : false)
    return isSame
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
    const buffer = fs.readFileSync("./data/ow_league_data.json", "utf8");
    const data = JSON.parse(buffer.toString());

    for (element of data.matches) {
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