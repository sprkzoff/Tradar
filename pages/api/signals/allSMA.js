var yahooFinance = require('yahoo-finance');

const reducer = (accumulator, currentValue) => accumulator + currentValue;

export default async (req, res) => {
    let all_crypto = req.body.allSymbols.trim().split(',')
    let data = {}
    let out = []
    let today = new Date();
    today.setDate(today.getDate() + 1);
    let today_minus2 = new Date(today);
    today_minus2.setDate(today_minus2.getDate() - 199);
    await yahooFinance.historical({
        symbols: all_crypto,
        from: today_minus2.toISOString().slice(0, 10), // Date string format YYYY-MM-DD
        to: today.toISOString().slice(0, 10), // Date string format YYYY-MM-DD

    }, function (err, quotes) {
        data = quotes
    });
    for(let coin in data) {
        let all_SMA = {}
        // find all SMA and add to all_SMA
        let focus = data[coin].slice(0,5).map((item) => { return item['close'] })
        all_SMA['SMA5'] = focus.reduce(reducer)/5.0
        focus = data[coin].slice(0,10).map((item) => { return item['close'] })
        all_SMA['SMA10'] = focus.reduce(reducer)/10.0
        focus = data[coin].slice(0,25).map((item) => { return item['close'] })
        all_SMA['SMA25'] = focus.reduce(reducer)/25.0
        focus = data[coin].slice(0,75).map((item) => { return item['close'] })
        all_SMA['SMA75'] = focus.reduce(reducer)/75.0
        focus = data[coin].slice(0,125).map((item) => { return item['close'] })
        all_SMA['SMA125'] = focus.reduce(reducer)/125.0
        focus = data[coin].slice(0,200).map((item) => { return item['close'] })
        all_SMA['SMA200'] = focus.reduce(reducer)/200.0
        out.push({ 'name': coin, 'value': all_SMA })
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