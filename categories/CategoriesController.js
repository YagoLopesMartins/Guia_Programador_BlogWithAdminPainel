const express = require("express")
const slugify = require("slugify")

const router = express.Router()


const Category = require("./Category")

router.get("/admin/categories", (req, res) =>{

    Category.findAll()
        .then((categories =>{
            res.render("admin/categories/index", {
                categories: categories
            })
        })
    )
})

router.get("/admin/categories/new", (req, res) =>{    
    res.render("admin/categories/new")
})

// router.post("/admin/categories/save", (req, res)=>{
router.post("/save", (req, res) => { 

    var title = req.body.title;
    
    if(title != undefined){

        Category.create({
            title: title,
            slug: slugify(title)
        }).then(()=>{
            res.redirect("/admin/categories")
        })

    }else{
        res.redirect("/admin/categories/new")
    }
})

router.post("/delete", (req, res) =>{
    var id = req.body.id

    if(id != undefined){

        if(!isNaN(id)){
            Category.destroy({
                where: {
                    id: id
                }
            }).then(()=>{
                res.redirect("/admin/categories")
            }).catch((error) => {
                console.error('Error: ', error);
            })
        }else{
            res.redirect("/admin/categories")
        }
    }else{
        res.redirect("/admin/categories")
    }
})

router.get("/admin/categories/edit/:id", (req, res) =>{

    var id = req.params.id

    if(isNaN(id)){
        res.redirect("/admin/categories")
    }

    Category.findByPk(id)
        .then(category => {
            if(category != undefined){
                res.render("admin/categories/edit", {
                    category: category
                })
            }else{
                res.redirect("/admin/categories")
            }
        })
        .catch((error) => {
            console.error('Error: ', error);
        })
})

router.post("/update", (req, res) => {
    var id = req.body.id
    var title = req.body.title

    Category.update({ 
        title: title,
        slug: slugify(title)
    },{
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/categories")
    })
})


module.exports = router