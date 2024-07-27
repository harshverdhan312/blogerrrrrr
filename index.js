const express = require("express")
const mongo = require ("mongoose")
const path = require('path');

const app = express()


app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, "public")));

app.get("/",(req,res)=>{
    res.render("index")
})
app.listen(3020,(req,res)=>{
    console.log(`Server running at: http://127.0.0.1:${3020}`);
})