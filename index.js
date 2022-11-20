const express = require("express")
const app = express()


app.get("/", (req, res) =>{
    res.send("Welcome to my site")
})

app.listen(8080, () => {
    console.log("Server on")
})