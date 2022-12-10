const express = require("express")
const slugify = require("slugify")

const router = express.Router()

const Article = require("./Article")
const Category = require("../categories/Category")

router.get("/admin/articles", (req, res) =>{

        Article.findAll({
            include: [{
                model: Category
            }]
        })
        .then((articles =>{
            res.render("admin/articles/index", {
                articles: articles
            })
        })
    )
    res.render("admin/articles/index")
})

router.get("/admin/articles/new", (req, res) =>{    

    Category.findAll()
        .then((categories =>{
            res.render("admin/articles/new", {
                categories: categories
            })
        })
    )
})

router.post("/admin/articles/save", (req, res)=>{
    var title       = req.body.title;
    var body        = req.body.body;
    var category    = req.body.category;
    
    if(title != undefined){

        Article.create({
            title: title,
            slug: slugify(title),
            title: title,
            categoryId: category
        }).then(()=>{
            res.redirect("/admin/articles")
        })

    }else{
        res.redirect("/admin/categories/new")
    }
})

router.post("/admin/articles/delete", (req, res) =>{
    var id = req.body.id

    if(id != undefined){

        if(!isNaN(id)){
            Article.destroy({
                where: {
                    id: id
                }
            }).then(()=>{
                res.redirect("/admin/articles")
            }).catch((error) => {
                console.error('Error: ', error);
            })
        }else{
            res.redirect("/admin/articles")
        }
    }else{
        res.redirect("/admin/articles")
    }
})

router.get("/admin/articles/edit/:id", (req, res) =>{

    var id = req.params.id

    if(isNaN(id)){
        res.redirect("/admin/articles")
    }

    Article.findByPk(id)
        .then(article => {
            if(article != undefined){

                Category.findAll()
                    .then((categories =>{
                        res.render("admin/articles/edit", {
                            categories: categories, article: article
                        })
                    })
                )    
            }else{
                res.redirect("/")
            }
        })
        .catch((error) => {
            console.error('Error: ', error);
        })
})

router.post("/update", (req, res) => {
    var id = req.body.id
    var title = req.body.title
    var body = req.body.body
    var category = req.body.category

    Article.update({ 
        title: title,
        body: body,
        category: category,
        slug: slugify(title)
    },{
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/articles")
    }).catch((error) => {
        console.error('Error: ', error);
        res.redirect("/")
    })
})

router.get("/articles/page/:num", (req, res) => {
    var page = req.params.num
    var offset = 0
    var limit = 2

    if(isNaN(page) || page == 1){
        offset = 0
    }else{
        offset = (parseInt(page) - 1) * limit
    }

    Article.findAndCountAll({
        limit: limit,
        offset: offset,
        order:[
            ['id', 'DESC']
        ],
    }).then(articles =>{
        var next
        if(offset + limit >= articles.count){
            next = false
        }else{
            next = true
        }

        var result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }

        Category.findAll()
        .then((categories =>{
            res.render("admin/articles/page", {
                categories: categories, result: result
            })
        })
    )    
    })
})


module.exports = router