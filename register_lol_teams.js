var request = require('request-promise-native');

function makeBody() {
    /* league_id 1 : 롤챔스 2018 스프링 */
    /* league_id 6 : 롤챔스 2018 서머 */

    return {
        leagueId: 6,
        gameName: "롤",
        teamName: ""
    }
}

async function postTeam(team_name) {
    const postBody = makeBody();
    postBody.teamName = team_name;

    console.log(postBody);
    const res = await request.post({
        url: 'http://172.16.101.132:3000/api/team',
        form: postBody,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'API-Key': 'mokaisthebest1004'
        },
    })

    console.log(res)
}

function main() {
    const body = makeBody();

    [
        "bbq OLIVERS",
        "MVP",
        "Griffin",
        "Hanhwa Life Esports",
        "King-Zone Dragon X",
        "Gen.G ESPORTS",
        "Afreeca Freecs",
        "SKT T1",
        "KT Rolster",
        "JIN AIR Greenwings"
    ]
    .forEach(async element => {
        await postTeam(element);
    });
}

main();