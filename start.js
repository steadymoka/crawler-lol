const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://overwatchleague.com/ko-kr/schedule');
    await page.waitFor(3000);

    /* Crawler start */

    console.log("click 1");
    await page.click('#schedule > div > div.Tabs.Tabs--rectangular > div > div > div > div > nav > a:nth-child(5)');
    console.log("click 2");
    await page.click('#schedule > div > div.Tabs.Tabs--darkBackground > div > div > div > div > nav > a:nth-child(2)');

    await page.waitFor(1000);

    /**/
    const result1 = await page.evaluate(() => {
        let data = [];
        let teams = document.querySelectorAll('.TeamLabel-name');

        for (var element of teams) {
            data.push(element.innerText)
        }

        return data;
    });

    /**/
    console.log("click 3");
    await page.click('#schedule > div > div.Tabs.Tabs--darkBackground > div > div > div > div > nav > a:nth-child(3)');

    const result2 = await page.evaluate(() => {
        let data = [];
        let teams = document.querySelectorAll('.TeamLabel-name');

        for (var element of teams) {
            data.push(element.innerText)
        }

        return data;
    });

    /* End */

    await browser.close();
    return { "1": result1, "2": result2 };
})().then((value) => {
    console.log("log start ");
    console.log(value);
});