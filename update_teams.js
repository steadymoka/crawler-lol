const fetch = require('node-fetch');

const HOST_PRODUCT = 'http://epodule.moka-a.io:3000'
const HOST_DEV = 'http://172.16.101.226:3000'
const HOST_URL = HOST_PRODUCT;

function makeBody() {
    /* league_id 1 : 롤챔스 2018 스프링 */
    /* league_id 6 : 롤챔스 2018 서머 */
    /* league_id 9 : 2018 리프트 라이벌즈  */

    return {
        leagueId: 9,
        gameName: "롤",
        teamName: ""
    }
}

async function postTeam(team_name) {
    const postBody = makeBody();
    postBody.teamName = team_name;

    console.log(postBody);
    const res = await fetch(`${HOST_URL}/api/team`, {
        method: 'POST',
        body: JSON.stringify(postBody),
        headers: {
            'API-Key': 'mokaisthebest1004',
            'Content-Type': 'application/json'
        }
    })

    console.log(await res.json())
}

function main() {
    [
        "King-Zone Dragon X",
        "Afreeca Freecs",
        "SKT T1",
        "KT Rolster",

        "Invictus Gaming",
        "Edward Gaming",
        "Royal Never Give Up",
        "Rogue Warriors",

        "Flash Wolves",
        "MAD Team",
        "Machi Esports",
        "G-Rex"
    ]
    .forEach(async element => {
        await postTeam(element);
    });
}

main();