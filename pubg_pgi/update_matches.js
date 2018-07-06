const fetch = require('node-fetch')
const moment = require('moment')
const fs = require("fs")

const LEAGUE_ID = 8 /* PUBG PGI 2018 */

const HOST_PRODUCT = 'http://epodule.moka-a.io:3000'
const HOST_DEV = 'http://172.16.101.226:3000'

const HOST_URL = HOST_PRODUCT;

function makeBody(match) {
    return {
        matchStartAt: moment(`${match.matchDate} ${match.matchTime}`, 'YYYY.MM.DD HH:mm').format('YYYY-MM-DDTHH:mm:ssZ'),
        matchEndAt: moment(`${match.matchDate} ${match.matchTime}`, 'YYYY.MM.DD HH:mm').format('YYYY-MM-DDTHH:mm:ssZ'),
        matchTimestamp: moment(`${match.matchDate} ${match.matchTime}`, 'YYYY.MM.DD HH:mm').unix(),
        leagueId: LEAGUE_ID,
        gameName: "배틀그라운드",
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
    /* Load matches data from disk */
    const buffer = fs.readFileSync("./data/pubg_pgi_data.json", "utf8");
    const data = JSON.parse(buffer.toString());

    for (element of data.matchs) {
        await postMatch(element)
        console.log("tick.. ")
        await sleep(77)
    }
}

module.exports = {
    excute: async function () {
        await main()
    }
}