const express = require("express")
const router = express.Router()

const bcrypt  = require("bcryptjs")


const User = require("./User")

router.get("/admin/users/create", (req, res) =>{    
    res.render("admin/users/create")
})

// router.post("/admin/categories/save", (req, res)=>{
router.post("/users/create", (req, res) => { 

    var email = req.body.email;
    var password = req.body.password;

    User.findOne({ 
        where: {
            email: email
        }
    }).then(user =>{
        if(user == undefined){

            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
        
                User.create({
                    email: email,
                    password: hash
                }).then(()=>{
                    res.redirect("/admin/users")
                }).catch(()=>{
                    res.redirect("/")
                })
        }else{
            res.redirect("/admin/users/create")
        }
    })

    
})

router.get("/admin/users", (req, res) =>{

    User.findAll()
        .then((users =>{
            res.render("admin/users/index", {
                users: users
            })
        })
    )
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