const express = require("express")

const router = express.Router()

router.get("/", (req, res) =>{
    res.send("ROTA de categorias")
})

router.get("/admin/categories/new", (req, res) =>{
    res.render("admin/categories/new")
})

module.exports = router