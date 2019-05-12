var inquirer = require("inquirer")
var mysql = require("mysql")
var cTable = require("console.table")

var itemTable = []

var managerStock = [
    {
        message: "What item would you like to restock?",
        type: "input",
        name: "item",
        validate: function( value ) {
            var valid = !isNaN(parseFloat(value));
            return valid || "Please enter a number";
          },
          filter: Number
        },
    {
        message: "How many items would you like to add?",
        type: "input",
        name: "quantity",
        validate: function( value ) {
            var valid = !isNaN(parseFloat(value));
            return valid || "Please enter a number";
          },
          filter: Number
    }
]

var newProductAsk = [
    {
        message: "Product name?",
        type: "input",
        name: "productName"
    },
    {
        message: "Department?",
        type: "input",
        name: "department"
    },
    {
        message:  "Price?",
        type: "input",
        name: "price",
        validate: function( value ) {
            var valid = !isNaN(parseFloat(value));
            return valid || "You must enter a valid number";
          },
          filter: Number
    },
    {
        message:  "Quantity?",
        type: "input",
        name: "quantity",
        validate: function( value ) {
            var valid = !isNaN(parseFloat(value));
            return valid || "You must enter a valid number";
          },
          filter: Number
    }
]


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
    inquirerPrompt()
    });


function inquirerPrompt(){
    inquirer.prompt(
        [{ 
            message: "What would you like to do?",
            type: "list",
            name: "list",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        }]
    ).then(function(response){
    console.log(response)
        if (response.list == "View Products for Sale"){
            connection.end(listAllItems())
        }
        else if (response.list == "View Low Inventory"){
            connection.end(lowInventory())
        }
        else if (response.list == "Add to Inventory"){
            addInventory()
        }
        else if (response.list == "Add New Product"){
            addProduct()
        }
        else{
            console.log("You must make a selection.")
            inquirerPrompt()
        }
    })
}

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
    })
}

function lowInventory(){
    var query = "select * from products where stock_quantity < 5"
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
    })
}

function addInventory(){
    listAllItems()
    setTimeout(function(){
    inquirer.prompt(managerStock).then(function(response){
        var items = response.item
        var quant = response.quantity
        processRestock(items, quant)
    });
    },100)
}

function processRestock(items, quant){
    var newQuant = quant+itemTable[items-1].stock_quantity
    console.log("You selected:  " + itemTable[items-1].product_name)
    console.log("The old quantity was:  " + itemTable[items-1].stock_quantity)
    console.log("The new quantity will be updated to:  " + newQuant)

    var query = "update products set stock_quantity = "+newQuant + " where item_id = " + items + ";" 
    connection.query(query, function(err, res){
    })
    connection.end()
}

function addProduct(){
    inquirer.prompt(newProductAsk).then(function(response){
        
        query = "insert into products (product_name, department_name, price, stock_quantity) Values ("+
        "\"" + response.productName + "\", " +
        "\"" + response.department + "\", " +
        response.price + ", " + 
        response.quantity + ");"

        connection.query(query, function(err, res){
        })
        connection.end()
    })
}