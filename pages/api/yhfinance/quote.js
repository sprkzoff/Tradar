var yahooFinance = require('yahoo-finance');

export default (req, res) => {
    yahooFinance.quote({
        symbol: req.body.symbol,
        modules: req.body.modules.trim().split(',') // see the docs for the full list "a,b,c" => ['a','b','c']
    }, function (err, quotes) {
        //console.log(quotes)
        res.statusCode = 200
        res.json(quotes)
    });
}