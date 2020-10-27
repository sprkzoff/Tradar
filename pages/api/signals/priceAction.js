var yahooFinance = require('yahoo-finance');

export default async (req, res) => {
    let all_crypto = req.body.allSymbols.trim().split(',')
    let data = []
    let today = new Date();
    let today_minus2 = new Date(today);
    today_minus2.setDate(today_minus2.getDate()-2);
    console.log(today.toISOString().slice(0,10))
    console.log(today_minus2.toISOString().slice(0,10))

    for(let coin of all_crypto)
    {
        await yahooFinance.historical({
            symbol: coin,
            from: today_minus2.toISOString().slice(0,10), // Date string format YYYY-MM-DD
            to: today.toISOString().slice(0,10) , // Date string format YYYY-MM-DD
            
            }, function (err, quotes) {
            //console.log(quotes)
            let all_PA = {}
            // find all priceAction and add to all_PA
            // engulfing
            all_PA['engulfing'] = engulfing(quotes);
            data.push({'name': coin, 'value': all_PA})
        });
    }
      
    Promise.all(data)
    .then(() => {
        console.log('All actions run without any issues!');
        res.statusCode = 200
        res.json({'data': data})
    }).catch((error) => {
        console.log('An error occured!');
        console.error(error);
    });
}



// define priceAction func here

function engulfing(quotes) {
    // Check bullish
    if(quotes[1].open >= quotes[1].close && quotes[0].open < quotes[0].close && quotes[0].open < quotes[1].close && quotes[0].close > quotes[1].open) {
        return 'bull';
    }
    else if(quotes[1].open <= quotes[1].close && quotes[0].open > quotes[0].close && quotes[0].open > quotes[1].close && quotes[0].close < quotes[1].open) {
        return 'bear';
    }
    else return '-';
}