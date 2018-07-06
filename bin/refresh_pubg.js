const update_to_server_match_up = require('../pubg_pgi/update_matches')

async function main() {
    console.log("== start ==")
    console.log("_")
    console.log("_")
    console.log("start update match up to server")
    await update_to_server_match_up.excute()

    console.log("_")
    console.log("_")
    console.log("== end ==")
}

main()