var yahooFinance = require('yahoo-finance');

export default async (req, res) => {
    let all_crypto = req.body.allSymbols.trim().split(',')
    let data = {}
    let out = []
    let today = new Date();
    let today_minus2 = new Date(today);
    today_minus2.setDate(today_minus2.getDate() - 2);
    await yahooFinance.historical({
        symbols: all_crypto,
        from: today_minus2.toISOString().slice(0, 10), // Date string format YYYY-MM-DD
        to: today.toISOString().slice(0, 10), // Date string format YYYY-MM-DD

    }, function (err, quotes) {
        console.log(quotes)
        data = quotes
    });
    for(let coin in data) {
        let all_PA = {}
        // find all priceAction and add to all_PA
        // engulfing
        all_PA['engulfing'] = engulfing(data[coin]);
        // harami
        all_PA['harami'] = harami(data[coin]);
        // morning or evening star
        all_PA['star'] = star(data[coin]);
        out.push({ 'name': coin, 'value': all_PA })
    }
    Promise.all(out)
        .then(() => {
            console.log('All actions run without any issues!');
            res.statusCode = 200
            res.json({ 'data': out })
        }).catch((error) => {
            console.log('An error occured!');
            console.error(error);
        });
}



// define priceAction func here

function engulfing(quotes) {
    // Check bullish
    if (quotes[1].open >= quotes[1].close && quotes[0].open < quotes[0].close && quotes[0].open < quotes[1].close && quotes[0].close > quotes[1].open) {
        return 'bull';
    }
    //Check bearish
    else if (quotes[1].open <= quotes[1].close && quotes[0].open > quotes[0].close && quotes[0].open > quotes[1].close && quotes[0].close < quotes[1].open) {
        return 'bear';
    }
    else return '-';
}

function harami(quotes) {
    // Check bullish
    if (quotes[1].open > quotes[1].close && quotes[0].open < quotes[0].close && quotes[0].open > quotes[1].close && quotes[0].close < quotes[1].open) {
        return 'bull';
    }
    //Check bearish
    else if (quotes[1].open < quotes[1].close && quotes[0].open > quotes[0].close && quotes[0].open < quotes[1].close && quotes[0].close > quotes[1].open) {
        return 'bear';
    }
    else return '-';
}

function doji(tick) {
    if (Math.abs(tick.open - tick.close) / tick.open <= 0.015) {
        return true
    }
    else return false
}

function star(quotes) {
    // Check bullish
    if (quotes[2].open > quotes[2].close && doji(quotes[1]) && (quotes[1].open <= quotes[2].close || Math.abs(quotes[1].open - quotes[2].close) / quotes[2].close <= 0.05) && quotes[0].open < quotes[0].close && (quotes[0].open >= quotes[1].close || Math.abs(quotes[1].close - quotes[0].open) / quotes[0].open <= 0.05) && (quotes[0].close - (quotes[2].close + (Math.abs(quotes[2].open - quotes[2].close) / 2))) / (quotes[2].close + (Math.abs(quotes[2].open - quotes[2].close) / 2)) >= -0.01) {
        return 'morning';
    }
    //Check bearish
    else if (quotes[2].open < quotes[2].close && doji(quotes[1]) && (quotes[1].open >= quotes[2].close || Math.abs(quotes[2].close - quotes[1].open) / quotes[2].close <= 0.05) && quotes[0].open > quotes[0].close && (quotes[0].open <= quotes[1].close || Math.abs(quotes[0].open - quotes[1].close) / quotes[0].open <= 0.05) && (quotes[0].close - (quotes[2].close - (Math.abs(quotes[2].close - quotes[2].open) / 2))) / (quotes[2].close - (Math.abs(quotes[2].close - quotes[2].open) / 2)) <= 0.01) {
        return 'evening';
    }
    else {
        return '-';
    }
}