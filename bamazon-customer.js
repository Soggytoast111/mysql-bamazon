var inquirer = require("inquirer")
var mysql = require("mysql")

var customerBuy = [
    {
        message: "What would you like to buy?",
        type: "input",
        name: "item",
        default: -1,
        validate: function(number){
            console.log(number != "" && number != NaN)
            console.log(number != "")
            console.log(number != NaN)
        }
    },
    {
        message: "How much would you like to buy?",
        type: "input",
        name: "quantity",
        default: -1,
        validate: function(number){
            return number != "" && number != NaN
        }
    }
]


inquirer.prompt(customerBuy, function(response){
    console.log(response.item)
    console.log(response.quantity)
});

