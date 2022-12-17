const express = require("express")

const bodyParser = require("body-parser")
const session = require("express-session")

const connection = require("./database/database")

const CategoriesController = require("./categories/CategoriesController")
const ArticlesController = require("./articles/ArticlesController")
const UsersController = require("./users/UsersController")

const Article = require("./articles/Article")
const Category = require("./categories/Category")
const User = require("./users/User")

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
app.use("/users", UsersController)

app.get("/session", (req, res) => {
    req.session.treinamento = "Formação"
    req.session.ano = 2019
    req.session.user = {
        username: "dcdc",
        email: "sdd",
        id:10
    }
    res.send("Sessao gerada!")
})
app.get("/leitra/session", (req, res) =>{
    res.json({
        treinamento: req.session.treinamento,
        ano: req.session.ano = 2019,
        user: req.session.user
    })
})

// View engine
app.set('view engine', 'ejs')

// Redis database for sessions

// Sessions
app.use(session({
    secret: "zxcçzçlxcçldç~ldlsçlsdflç~sldfls~kdfksdfç",
    cookie: {
        maxAge: 300000 // 3 seg
    }
}))

// Static files
app.use(express.static('public'))

// Body parser 
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json({ extended: true}))

app.get("/", (req, res) =>{
    Article.findAll({
        order:[
            ['id', 'DESC']
        ],
        limit: 2
    })
    .then(articles => {
        Category.findAll()
        .then(categories =>{
            res.render("index", { articles: articles, categories: categories})
        })
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
            Category.findAll()
                .then(categories =>{
                    res.render("article", { article: article, categories: categories})
                })
        }else{
            res.redirect("/")
        }
    }).catch((error) => {
        console.error('Error:', error);
    })
})

app.get("/category/:slug", (req, res)=>{
    var slug = req.params.slug

    Category.findOne({
        where: {
            slug: slug
        },
        include: [{ model: Article}]
    }).then(category => {
        if(category != undefined){
            Category.findAll()
                .then(categories =>{
                    res.render("index", { articles: category.articles, categories: categories})
                })
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
