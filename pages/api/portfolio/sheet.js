const {google} = require('googleapis');
const key = require('./../../../sheet_key.json');

export default async (req, res) => {
    const client = new google.auth.JWT(
        key.client_email,
        null,
        key.private_key,
        ['https://www.googleapis.com/auth/spreadsheets.readonly']
    );
    client.authorize(function(err,tokens) {
        if(err) {
            console.log(err);
            res.statusCode = err.response.status
        } else {
            console.log("Sheet connected!")
        }
    });
    const sheet = google.sheets({ version:'v4', auth: client });
    const opt = {
        spreadsheetId: process.env.SPREAD_SHEET_ID,
        range: 'portfolio!A1:F'
    }
    let data = await sheet.spreadsheets.values.get(opt);
    res.statusCode = 200
    // console.log('BE portfolio', data.data['values'])
    res.json({ 'data': data.data['values'] });
}