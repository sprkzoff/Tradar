var yahooFinance = require('yahoo-finance');

export default async (req, res) => {
    let all_crypto = req.body.allSymbols.trim().split(',')
    let data = []
    for(let coin of all_crypto)
    {
        await yahooFinance.quote({
            symbol: coin,
            modules: ["price"]
        }, function (err, quotes) {
            //console.log(quotes)
            data.push(quotes)
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
        res.statusCode = error.response.status
    });
}