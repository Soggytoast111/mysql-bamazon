var inquirer = require("inquirer")
var mysql = require("mysql")
var cTable = require("console.table")

var itemTable = []

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "dummy",
    password: "password",
    database: "bamazon"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected!")
    listAllItems()
    });


var customerBuy = [
    {
        message: "What would you like to buy?",
        type: "input",
        name: "item",
        validate: function( value ) {
            var valid = !isNaN(parseFloat(value));
            return valid || "Please enter a number";
          },
          filter: Number
        },
    {
        message: "How much would you like to buy?",
        type: "input",
        name: "quantity",
        validate: function( value ) {
            var valid = !isNaN(parseFloat(value));
            return valid || "Please enter a number";
          },
          filter: Number
    }
]

function listAllItems(){
    var query = "select * from products"
    connection.query(query, function(err, res){
        for (i=0; i<res.length; i++){
            var item = {
                item_id: res[i].item_id,
                product_name: res[i].product_name,
                price: "$" + res[i].price,
                stock_quantity: res[i].stock_quantity
            }
            itemTable.push(item)
        }
        console.table(itemTable)
        inquirerPrompt()
    })
}

function inquirerPrompt(){
    inquirer.prompt(customerBuy).then(function(response){
        var items = response.item
        var quant = response.quantity
        processOrder(items, quant)
    });
}

function processOrder(item_id, quantity){
    if (quantity>itemTable[item_id-1].stock_quantity){
        console.log("Sorry, we don't have that many of: " + itemTable[item_id-1].product_name)
        setTimeout(function(){
        inquirerPrompt()
        },100)
    }
    else{
    console.log("You are purchasing x"+ quantity + " " + itemTable[item_id-1].product_name)
    var currency = itemTable[item_id-1].price;
    var numberPrice = Number(currency.replace(/[^0-9.-]+/g,""));

    console.log("Your total is:  $" + (numberPrice * quantity))
    console.log("Thanks for shopping at Bamazon!")
    
    var currentQuantity = itemTable[item_id-1].stock_quantity
    var newQuantity = currentQuantity - quantity

    var query = "update products set stock_quantity = "+newQuantity + " where item_id = " + item_id + ";" 
    connection.query(query, function(err, res){
    connection.end()
    })
    }
}