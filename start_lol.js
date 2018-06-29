const axios = require("axios")
const {
    JSDOM
} = require("jsdom")
const fs = require("fs")

const URL_API_PREFIX = "https://api.github.com/repos/we-are-dodo/works/contents"
const URL_GITHUB_PREFIX = "https://github.com/we-are-dodo/works/blob/master"

async function getMarkdown(slug) {
    const response = await axios.get(`${URL_GITHUB_PREFIX}/${slug}`)
    const $dom = new JSDOM(response.data)
    const $article = $dom.window.document.querySelector("article.markdown-body.entry-content")

    const header = {}

    const $table = $article.querySelector("table[data-table-type=yaml-metadata]")
    console.log($table)
    if ($table) {
        const $tableHeaders = $table.querySelectorAll("thead th")
        const $tableBodies = $table.querySelectorAll("tbody td")
        for (const index of Object.keys($tableHeaders)) {
            const $tableHeader = $tableHeaders[index]
            const $tableBody = $tableBodies[index]
            const $tableBodyCells = $tableBody.querySelectorAll("td")
            if ($tableBodyCells.length) {
                header[$tableHeader.textContent] = [...$tableBodyCells].map($cell => $cell.textContent)
            } else {
                header[$tableHeader.textContent] = $tableBody.textContent
            }
        }
        $article.removeChild($table)
    }
    return {
        header,
        $body: $article,
    }
}

async function getUser(date, username) {

    const doc = await getMarkdown(`${date}/${username}.md`)
    const user = {
        id: username,
        name: doc.header.name || null,
        works: doc.header.works || [],
        body: null,
    }

    if (doc.$body.innerHTML.trim()) {
        const $headlines = doc.$body.querySelectorAll("h2")
        user.works = [...$headlines].map($headline => $headline.textContent)
        user.body = doc.$body.innerHTML.trim()
    }
    return user
}

async function getMeet(date) {
    const doc = await getMarkdown(`${date}/readme.md`)
    const response = await axios.get(`${URL_API_PREFIX}/${date}`)
    const usernames = response.data
        .filter(item => item.type === "file" && item.name !== "readme.md" && /\.md$/.test(item.name))
        .map(item => item.name.replace(/\.md$/, ""))

    return {
        date,
        contents: doc.$body.innerHTML.trim(),
        users: await Promise.all(usernames.map(username => getUser(date, username))),
    }
}

async function getMeets() {
    const response = await axios.get(URL_API_PREFIX)
    const dates = response.data
        .filter(item => item.type === "dir" && /^20\d{2}-\d{2}-\d{2}/.test(item.name))
        .map(item => item.name)

    return {
        meets: await Promise.all(dates.map(date => getMeet(date)))
    }
}

/**
 * 
 */

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
            console.log(item);

            const match = {
                matchStartAt: 0,
                home: {
                    teamName: ""
                },
                away: {
                    teamName: ""
                },
                home_score: 0,
                away_score: 0
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
    fs.writeFileSync("./data.json", JSON.stringify(lols, null, "  "))
    console.log("done!")
}

main()