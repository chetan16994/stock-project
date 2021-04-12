const fs = require('fs');
const csv = require('csv-parser');
module.exports = {

    algo1: (req, res) => {

        let ticker = req.params.ticker;

        let arr1 = []
 
       fs.createReadStream(ticker + '.csv')
            .pipe(csv())
           .on('data', (row) => arr1.push(parseFloat(row["close"])))
            .on('end', () => {
                // arr1.forEach(element => {
                //     console.log(" close--- ",element)
                // });
                console.log(meanReversionStrategy(arr1,ticker))

                console.log(simpleMovingAverage(arr1,ticker))

                console.log(bb(arr1,ticker))

                console.log('CSV file successfully processed');
            });

        const meanReversionStrategy = (prices, file) => {

            let finalArr1 = []
            let buy1 = 0
            
            console.log("\t !!!!!Starting Mean Reversion Strategy for!!!!!", file)

            let buy = 0
            let iterative_profit = 0
            let total_profit = 0
            let first_buy = 0
            //  Getting back to Moving Average
            let i = 0
            for (let price of prices) {
               
                if (i >= 5) {
                    let current_price = price
                    let moving_average =  (prices[i-1] + prices[i-2] + prices[i-3] + prices[i-4] + prices[i-5])/5;

                    // console.log("-----moving avg ----",moving_average)

                    if ((current_price > 0.95 * moving_average) && buy == 0) {
                        if (i == (prices.length) - 1) {
                            console.log("")
                            console.log("        YOU SHOULD BUY TODAY")
                            console.log("")
                        }
                        buy = current_price
                        buy1=buy
                        console.log("Buying the Stock", buy)
                        if (first_buy == 0) {
                            first_buy = buy
                            // # saves the first buy
                            // # in a situation where the program starts and satisfies the condition
                            console.log("The first buy is at: ", first_buy)
                            finalArr1.push({ firstBuy: first_buy });
                        }
                    }
                    else if ((current_price < 1.05 * moving_average) && buy != 0) {
                        if (i == prices.length - 1) {
                            console.log("")
                            console.log("        YOU SHOULD SELL TODAY")
                            console.log("")
                        }
                        console.log("Selling stock at: ", current_price)
                        iterative_profit = current_price - buy
                        buy = 0
                        console.log("This trade Profit is: ", iterative_profit)
                        total_profit += iterative_profit
                        console.log("")
                        finalArr1.push({ buy: buy1, sell: current_price, profit: total_profit })
                    }
                }
                i = i+1;
            }
            //  Now processing the profits
            console.log("-----------------------MEAN REVERSION total profits earned from the first buy----------------------")
            final_profit_percent = (total_profit / first_buy) * 100
            console.log("")
            console.log("For the Ticker: ", file)
            console.log("The total profit percentage is: ", final_profit_percent)
            console.log("The total Profit is: ", total_profit)
            console.log("")
            console.log("-----------------------------------------------------------------------------------------------------")

            finalArr1.push({ totalProfit: total_profit })

            let finalJson1 = JSON.stringify(finalArr1);

            fs.writeFile(file + "algo1.json", finalJson1, 'utf8', function (err) {
                if (err) {
                    console.log("An error occured while writing JSON Object to File.");
                    return console.log(err);
                }
                console.log("JSON file has been saved.");
            });

            // # the dict will store data for the various profits
            // mean_reversion_dict[file] = {
            //                 'total profit': total_profit,
            //                 'profit percent': final_profit_percent
            //             }

            return total_profit, final_profit_percent
            // # this will return the total and percent of profit of various ticker
        }


        const simpleMovingAverage = (prices, file) =>{
    
        let finalArr2 = []
        let buy2 = 0
        
        console.log("")
        console.log("\t !!!!!Starting Simple Moving Average for!!!!!", file)
        console.log("")
        let buy = 0
        let iterative_profit = 0
        let total_profit = 0
        let first_buy = 0

    // # Getting back to Moving Average

        let i = 0
        for(let price of prices){
            if (i >= 5){
                console.log(prices[i-1]+prices[i-2]+prices[i-3])
                current_price = price
                moving_average = (prices[i - 1] + prices[i - 2] + prices[i - 3] + prices[i - 4] + prices[i - 5]) / 5
                // console.log("The Moving Average for last 5 days is", moving_average)
                if ((current_price > moving_average) && buy == 0){
                    if (i ==( prices.length) - 1){
                        console.log("")
                        console.log("        YOU SHOULD BUY TODAY")
                        console.log("")
                    }
                    buy = current_price
                    buy2=buy
                    console.log("Buying the Stock", buy)
                
                    if (first_buy == 0){
                        first_buy = buy
                        console.log("The first buy is at: ", first_buy)
                        finalArr2.push({ firstBuy: first_buy });
                    }
                }

                else if((current_price < moving_average) && buy!=0){
                    if (i == (prices.length - 1)){
                        console.log("")
                        console.log("      YOU SHOULD SELL TODAY")
                        console.log("")
                    }
                    console.log("Selling stock at: ", current_price)
                    iterative_profit = current_price - buy
                    buy = 0
                    console.log("This trade Profit is: ", iterative_profit)
                    total_profit += iterative_profit
                    console.log("")
                    finalArr2.push({ buy: buy2, sell: current_price, profit: total_profit })

                }
            }
            i += 1
        }

        // # Now processing the profits
        console.log("-----------------------SIMPLE MOVING AVERAGE total profits earned from the first buy----------------------")
    // # this will provide the profit percent since the first buy
        final_profit_percent = (total_profit / first_buy) * 100
        console.log("")
        console.log("For the Ticker: ", file)
        console.log("The total profit percentage is: ", final_profit_percent)
        console.log("The total Profit is: ", total_profit)
        console.log("")
        console.log("-----------------------------------------------------------------------------------------------------")

            finalArr2.push({ totalProfit: total_profit })

            let finalJson2 = JSON.stringify(finalArr2);

            fs.writeFile(file + "algo2.json", finalJson2, 'utf8', function (err) {
                if (err) {
                    console.log("An error occured while writing JSON Object to File.");
                    return console.log(err);
                }
                console.log("JSON file has been saved.");
            });

    // # this will make this dict store all the iterative changes along the for loop for various tickers
        // let simple_average_dict[file] = {
        //             'total profit': total_profit,
        //             'profit percent': final_profit_percent
        //         }
        return total_profit, final_profit_percent
    // # this function will return the profit and percent which will be later on used inside the other functions

        }


        const bb = (prices, file)=>{

            let finalArr3=[]
            console.log("")
            console.log("\t !!!!!!Starting Bollinger Bands Strategy for!!!!!!", file)
            console.log("")
            let buy = 0
            let buy3=0
            let iterative_profit = 0
            let total_profit = 0
            let first_buy = 0

    // # Getting back to Moving Average
            let i = 0

            for(price of prices){
                if(i>=5){
                    current_price = price
                    moving_average = ((prices[i-1] + prices[i-2] + prices[i-3] + prices[i-4] + prices[i-5]) )/ 5
                    // console.log("The Moving Average for last 5 days is", moving_average)

                    if ( (current_price < (0.95 * moving_average)) && buy == 0){
                        if (i ==(prices.length - 1)){
                            // # the console.log statement above does satisfy the condition for the project
                            // # the condition checks if the last data point is the place where it needs to be sold or bought
                            console.log("")
                            console.log("       YOU SHOULD BUY TODAY")
                            // # the console.log statement above does satisfy the condition for the project
                            // # the condition checks if the last data point is the place where it needs to be sold or bought
                            console.log("")
                        }
                        buy = current_price
                        buy3=buy;
                        console.log("Buying the Stock", buy)


                        if ( first_buy == 0){
                            first_buy = buy
                            console.log("The first buy is at: ", first_buy)
                            finalArr3.push({ firstBuy: first_buy });
                        }
                    }
                    else if ((current_price > (1.05 * moving_average)) && buy != 0){
                        if (i == (prices.length -1) ){
                            console.log("")
                            console.log("      YOU SHOULD SELL TODAY")
                            // # the console.log statement above does satisfy the condition for the project
                            // # the condition checks if the last data point is the place where it needs to be sold or bought
                            console.log("")
                        }

                        console.log("Selling stock at: ", current_price)
                        iterative_profit = current_price - buy
                        buy = 0
                        console.log("This trade Profit is: ", iterative_profit)
                        total_profit += iterative_profit
                        console.log("")
                        finalArr3.push({buy:buy3, sell:current_price, profit:total_profit})
                    }
                }

                i += 1

            }
            //  # Now processing the profits
                console.log("-----------------------BOLLINGER BANDS total profits earned from the first buy----------------------")
                final_profit_percent = (total_profit / first_buy) * 100
                console.log("")
                console.log("For the Ticker: ", file)
                console.log("The total profit percentage is: ", final_profit_percent)
                console.log("The total Profit is: ", total_profit)
                console.log("")
                console.log("-----------------------------------------------------------------------------------------------------")
            
                finalArr3.push({totalProfit:total_profit})

                // finalArr3.forEach(element => {
                //     console.log(element)
                // });

            let finalJson3=JSON.stringify(finalArr3);

            fs.writeFile(file + "algo3.json", finalJson3, 'utf8', function (err) {
                if (err) {
                    console.log("An error occured while writing JSON Object to File.");
                    return console.log(err);
                }
                console.log("JSON file has been saved.");
            });


        return total_profit, final_profit_percent
        };

        
    }
}