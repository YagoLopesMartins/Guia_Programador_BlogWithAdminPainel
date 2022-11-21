const express = require("express")

const router = express.Router()

router.get("/", (req, res) =>{
    res.send("ROTA de categorias")
})

module.exports = router