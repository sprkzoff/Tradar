// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

var yahooFinance = require('yahoo-finance');

export default (req, res) => {
  yahooFinance.historical({
    symbol: req.body.symbol,
    from: req.body.from, //'2012-01-01'
    to: req.body.to,
    // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
  }, function (err, quotes) {
    //console.log(quotes)
    res.statusCode = 200
    res.json({ data: quotes })
  });
}