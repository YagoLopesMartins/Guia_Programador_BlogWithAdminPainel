const express = require("express")

const bodyParser = require("body-parser")
const connection = require("./database/database")

const CategoriesController = require("./categories/CategoriesController")
const ArticlesController = require("./articles/ArticlesController")

const Article = require("./articles/Article")
const Category = require("./categories/Category")

const app = express()

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
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json({ extended: true}))

app.get("/", (req, res) =>{
    Article.findAll({
        order:[
            ['id', 'DESC']
        ]
    })
    .then(articles => {
        res.render("index", { articles: articles})
    })
})

app.get("/:slug", (req, res)=>{
    var slug = req.params.slug

    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
            res.render("article", { article: article})
        }else{
            res.redirect("/")
        }
    }).catch((error) => {
        console.error('Error:', error);
    })


})

app.get("/testindex", (req, res) =>{
    res.send("testindex")
})

app.listen(8080, () => {
    console.log("Server on")
})
