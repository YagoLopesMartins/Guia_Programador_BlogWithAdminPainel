const express = require("express")
const app = express()

const bodyParser = require("body-parser")
const connection = require("./database/database")


const CategoriesController = require("./components/user/categories/CategoriesController")
const ArticlesController = require("./components/user/articles/ArticlesController")

connection.authenticate()
    .then(() =>{
        console.log('Connection has been established successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    })

app.use("/categories", CategoriesController)
app.use("/articles", ArticlesController)

// View engine
app.set('view engine', 'ejs')

// Static files
app.use(express.static('public'))

// Body parser 
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

app.get("/", (req, res) =>{
    res.send("Welcome to my site")
})

app.listen(8080, () => {
    console.log("Server on")
})
