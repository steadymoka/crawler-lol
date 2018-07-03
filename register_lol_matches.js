const axios = require("axios")
const fs = require("fs")

async function makeBody() {
    const buffer = fs.readFileSync("./data.json", "utf8");
    const data = JSON.parse(buffer.toString());

    if (!$.trim(this.newMatch.gameName)) {
        this.errorMatchMessage = "모두 입력해주세요"
        return
    }
    this.newMatch.matchStartAt = moment(this.newMatch.matchStartAt, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DDTHH:mm:ssZ')
    if (this.newMatch.matchEndAt)
        this.newMatch.matchEndAt = moment(this.newMatch.matchEndAt, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DDTHH:mm:ssZ')
    else
        this.newMatch.matchEndAt = this.newMatch.matchStartAt
    this.newMatch.homeTeamId = parseInt(this.newMatch.homeTeamId)
    this.newMatch.awayTeamId = parseInt(this.newMatch.awayTeamId)
    this.newMatch.leagueId = parseInt(this.newMatch.leagueId)
    this.$http.post('/api/match', this.newMatch).success(function (response) {
        console.log(response)
        this.newMatch = response.result
        this.matches.push(this.newMatch)
        this.newMatch = {}
        this.newMatch.gameName = "오버워치"
        this.newMatch.matchInfo = "2스테이지"
        this.newMatch.leagueId = 2
        this.newMatch.matchStartAt = "2018-03-04 06:00"
    }).error(function (error) {
        console.log(error)
    });
}

async function main() {
    const body = await makeBody();
}

main();