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

// router.get("/admin/categories/edit/:id", (req, res) =>{

//     var id = req.params.id

//     if(isNaN(id)){
//         res.redirect("/admin/categories")
//     }

//     Category.findByPk(id)
//         .then(category => {
//             if(category != undefined){
//                 res.render("admin/categories/edit", {
//                     category: category
//                 })
//             }else{
//                 res.redirect("/admin/categories")
//             }
//         })
//         .catch((error) => {
//             console.error('Error: ', error);
//         })
// })

// router.post("/update", (req, res) => {
//     var id = req.body.id
//     var title = req.body.title

//     Category.update({ 
//         title: title,
//         slug: slugify(title)
//     },{
//         where: {
//             id: id
//         }
//     }).then(() => {
//         res.redirect("/admin/categories")
//     })
// })


module.exports = router