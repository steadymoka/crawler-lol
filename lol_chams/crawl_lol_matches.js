const axios = require("axios")
const {
    JSDOM
} = require("jsdom")
const fs = require("fs")

async function getLol() {
    const response = await axios.get("http://www.leagueoflegends.co.kr/?m=esports&mod=chams_schedule&cate=1")

    const $dom = new JSDOM(response.data)
    const $article = $dom.window.document.querySelector("div.esports-table.team-table")

    const $table = $article.querySelector("table")

    const matchs = [];

    if ($table) {
        const $tableTR = $table.querySelectorAll("tbody tr");

        for (const index of Object.keys($tableTR)) {
            var item = $tableTR[index];

            /* 경기 날짜 */
            var matchDate;
            var matchDateElement = item.querySelector("th");
            if (matchDateElement)
                matchDate = matchDateElement.innerHTML;

            /* 경기 시간 */
            var matchTime;
            matchTime = item.getElementsByClassName("table-data__time")[0].innerHTML;

            var score;
            var scoreElement = item.getElementsByClassName("match match_count")[0];
            if (scoreElement)
                score = scoreElement.innerHTML.trim();
            else
                score = undefined;

            /* 홈 팀 / 스코어 */
            var homeTeam;
            homeTeam = item
                .getElementsByClassName("table-data__position-left")[0]
                .getElementsByClassName("table-data__team-name")[0]
                .innerHTML;

            /* 어웨이 팀 / 스코어 */
            var awayTeam;
            awayTeam = item
                .getElementsByClassName("table-data__position-right")[0]
                .getElementsByClassName("table-data__team-name")[0]
                .innerHTML;

            /* 이긴팀 */
            var winner;
            var homeScore;
            var awayScore;
            if (score) {
                homeScore = parseInt(score.split(":")[0]);
                awayScore = parseInt(score.split(":")[1]);

                winner = homeScore > awayScore ? "home" : "away";

            } else {
                homeScore = 0;
                awayScore = 0

                winner = undefined;
            }

            const match = {
                matchDate: matchDate,
                matchTime: matchTime,
                home: {
                    teamName: homeTeam.trim()
                },
                away: {
                    teamName: awayTeam.trim()
                },
                homeScore: homeScore,
                awayScore: awayScore,
                winner: winner,
                matchInfo: "1R"
            }
            matchs.push(match)
        }
    }

    /* */
    return {
        matchs: matchs,
    }
}

async function main() {
    const lols = await getLol()
    fs.writeFileSync("./lol_chams_data.json", JSON.stringify(lols, null, "  "))
    console.log("done crawling match up!")
}

module.exports = {
    excute: async function () {
        await main()
    }
}