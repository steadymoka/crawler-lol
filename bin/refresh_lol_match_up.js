const crawler_match_up = require('../lol_chams/crawl_lol_matches')
const update_to_server_match_up = require('../lol_chams/update_matches')
const update_lol_rank = require('../lol_chams/update_rank')

async function main() {
    console.log("== start ==")
    console.log("_")
    console.log("_")
    console.log("start crawling match up")
    await crawler_match_up.excute()

    console.log("_")
    console.log("_")
    console.log("start update match up to server")
    await update_to_server_match_up.excute()

    console.log("_")
    console.log("_")
    console.log("make teams rank & post to server")
    await update_lol_rank.excute()
    
    console.log("_")
    console.log("_")
    console.log("== end ==")
}

main()