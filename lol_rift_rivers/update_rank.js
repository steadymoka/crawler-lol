const fetch = require('node-fetch')
const fs = require("fs")

const HOST_PRODUCT = 'http://epodule.moka-a.io:3000'
const HOST_DEV = 'http://172.16.101.226:3000'
const HOST_URL = HOST_PRODUCT;

const LEAGUE_ID = 9 /* 2018 롤챔스 서머 */

var current_teams = {}

/**
 * 
 */

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
    current_teams.map((team) => {
        team.win = 0
        team.lose = 0
        team.diffScore = 0
    })
}

function calculateRank(matches) {
    matches.forEach(match => {
        /**
         * winner 가 있으면,  ----> 없으면 continue
         * 
         *  home 이면, homeTeam.teamName 의 win =+1
         *            awayTeam.teamName 의 lose =+1
         * 
         *  away 이면, awayTeam.teamName 의 win =+1
         *            homeTeam.teamName 의 lose =+1
         * 
         *  homeTeam.Score += homeScore 
         *  awayTeam.Score -= homeScore
         * 
         *  homeTeam.Score -= awayScore 
         *  awayTeam.Score += awayScore
         */
        if (match.winner) {
            var homeTeam = {}
            var awayTeam = {}

            current_teams.forEach(team => {
                if (team.teamName.trim() === match.home.teamName.trim()) {
                    homeTeam = team
                }
                if (team.teamName.trim() === match.away.teamName.trim()) {
                    awayTeam = team
                }
            })

            if (match.winner == "home") {
                homeTeam.win += 1
                awayTeam.lose += 1
            }

            if (match.winner == "away") {
                awayTeam.win += 1
                homeTeam.lose += 1
            }

            homeTeam.diffScore += match.homeScore
            awayTeam.diffScore -= match.homeScore

            homeTeam.diffScore -= match.awayScore
            awayTeam.diffScore += match.awayScore
        }
    });

    current_teams.sort((a, b) => {
        if (a.diffScore - b.diffScore > 0)
            return -1

        if (a.diffScore - b.diffScore < 0)
            return 1

        if (a.diffScore - b.diffScore == 0)
            return 0

    })
}

async function updateRankToServer() {
    var rank = 1

    for (team of current_teams) {
        const postBody = {
            win: team.win,
            lose: team.lose,
            diffScore: team.diffScore,
            rank: rank
        };
        rank++

        console.log(postBody);
        const res = await fetch(`${HOST_URL}/api/team/${team.id}`, {
            method: 'PUT',
            body: JSON.stringify(postBody),
            headers: {
                'API-Key': 'mokaisthebest1004',
                'Content-Type': 'application/json'
            }
        })
    }
}

/**
 * Excute
 */

async function main() {
    /* Load matches data from disk */
    const buffer = fs.readFileSync("./data/lol_rift_rivers_data.json", "utf8")
    const data = JSON.parse(buffer.toString())

    await loadTeams()
    calculateRank(data.matchs)
    await updateRankToServer()
}

module.exports = {
    excute: async function () {
        await main()
    }
}