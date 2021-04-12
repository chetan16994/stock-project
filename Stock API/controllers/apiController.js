const httpStatus = require("http-status-codes"),
    fs=require("fs"),
    axios = require("axios");

module.exports = {

stockAPI: async (req, res) => {

        let apiKey = "NG9C9EPVYBMQT0C8"
        let ticker=req.params.ticker;
        let query = 'http://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + 
                    ticker + '&outputsize=full&apikey=' + apiKey;
    try {
        let result = await axios.get(query);
        let stockData = result.data["Time Series (Daily)"]
        let keys1 = Object.entries(stockData);    
        console.log(keys1.length)

        let i=0;

        let arr=[]
        while(i< keys1.length){
            let key2=keys1[i];
            arr.push({ date: Object.values(key2)[0], close: Object.values(key2)[1]['4. close'] })
            i=i+1;
        }

        output=Object.keys(arr[0]).join(',')+'\n';

        for(kp of arr)
            output += Object.values(kp).join(',')+'\n'
        
        fs.writeFile(ticker + ".csv", output, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
            console.log("JSON file has been saved.");
        });
    } catch (error) {
        res.send("something went wrong !");
    }
},
}