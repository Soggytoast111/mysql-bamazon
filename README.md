# Bamazon!

Bamazon is a command-line app in node.js that simulates a online retailer.  There is no real functionality to the app - this was just an exercise for me to develop some comfort with mysql and access from node.js.

## Getting Started

Run either "node bamazon-customer.js" or "node bamazon-manager.js" from the command line.

### Prerequisites

Requires node.js from the command line to run (obviously).

Dependencies in node are inquirer, mysql, and console.table.  

Must have a SQL database to link the app to.  Edit the .js files to log in to database with user/password.

### Installing

"npm install" from the command line should install all dependencies.  Otherwise you could install them manually.

### What it does

bamazon-customer.js -- access the store as a mock customer.  Select a product by number and a quantity.  This alerts the customer to the total cost of the order, then reduces the quantity of items in the database.

bamazon-manager.js -- now you are in the role of the manager.  You can update quantites of items and add new items to the database.  

