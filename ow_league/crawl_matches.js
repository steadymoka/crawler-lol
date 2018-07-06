const axios = require("axios")
const fetch = require('node-fetch')
const {
    JSDOM
} = require("jsdom")
const fs = require("fs")

async function getLol() {
    const res = await fetch(`https://api.overwatchleague.com/schedule?expand=team.content&locale=en_GB`, {
        method: 'GET'
    })
    const league_datas = await res.json()
    const stage_playoffs = league_datas.data.stages[5]
    const slug = stage_playoffs.slug

    const matches = [];
    for (const item of stage_playoffs.matches) {

        /* 경기 날짜 */
        const matchStartTime = item.startDateTS / 1000;
        const matchEndTime = item.endDateTS / 1000;

        /* 홈 팀 */
        const homeTeamName = item.competitors[0] ? item.competitors[0].name : "TBD"

        /* 어웨이 */
        const awayTeamName = item.competitors[1] ? item.competitors[1].name : "TBD"

        /* 이긴팀 */
        const homeScore = item.scores[0].value;
        const awayScore = item.scores[1].value;

        var winner;
        winner =
            homeScore == awayScore ? undefined :
            homeScore > awayScore ? "home" :
            "away"


        const match = {
            matchStartTime: matchStartTime,
            matchEndTime: matchEndTime,

            home: {
                teamName: homeTeamName.trim()
            },
            away: {
                teamName: awayTeamName.trim()
            },
            homeScore: homeScore,
            awayScore: awayScore,
            winner: winner,
            matchInfo: slug
        }
        matches.push(match)
    }

    /* */
    return {
        matches: matches,
    }
}

async function main() {
    const lols = await getLol()
    fs.writeFileSync("./data/ow_league_data.json", JSON.stringify(lols, null, "  "))
    console.log("done crawling match up!")
}

module.exports = {
    excute: async function () {
        await main()
    }
}