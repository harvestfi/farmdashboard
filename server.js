//Install express server
const express = require('express');
const path = require('path');
const https = require('https');
const app = express();
const cors = require('cors');


cors({credentials: true, origin: true});

app.use(cors());

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/farmdashboard-front'));

app.get('/harvestFinance/vaults', function(req, res) {
    try {
        https.get('https://api-ui.harvest.finance/vaults?key=41e90ced-d559-4433-b390-af424fdc76d6', (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                console.log('data: ' + data);
                try {
                    return res.send(JSON.parse(data));
                } catch (e) {
                    console.log('Error: ' + e);
                    return res.send("{}");
                }
            });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    } catch (e) {
        console.log('Error: ' + e);
    }

});

app.get('/matic-info', function(req, res) {
    try {
        https.get('https://api.coingecko.com/api/v3/simple/price?include_last_updated_at=true&ids=matic-network&vs_currencies=usd', (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                return res.send(JSON.parse(data)["matic-network"]);
            });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    } catch (e) {
        console.log('Error: ' + e);
    }

});


app.get('/*', function(req,res) {

    res.sendFile(path.join(__dirname+'/dist/farmdashboard-front/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
