const fetch = require('node-fetch')
const fs = require("fs")

const LEAGUE_ID = 2

const HOST_PRODUCT = 'http://epodule.moka-a.io:3000'
const HOST_DEV = 'http://172.16.101.226:3000'

const HOST_URL = HOST_PRODUCT;

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
                if (sameTeam(match.home.teamName.trim(), team.teamName.trim())) {
                    homeTeam = team
                }
                if (sameTeam(match.away.teamName.trim(), team.teamName.trim())) {
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

async function updateRankToServer() {
    console.log(current_teams)
    var rank = 1

    for (team of current_teams) {
        const postBody = {
            win: team.win || 0,
            lose: team.lose || 0,
            diffScore: team.diffScore || 0,
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
    const buffer = fs.readFileSync("./data/ow_league_data.json", "utf8")
    const data = JSON.parse(buffer.toString())

    await loadTeams()
    calculateRank(data.matches)
    await updateRankToServer()
}

module.exports = {
    excute: async function () {
        await main()
    }
}