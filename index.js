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
app.get("/login",(req,res)=>{
    res.render("login")
})
app.get("/signup",(req,res)=>{
    res.render("signup")
})
app.get("/readBlogs",(req,res)=>{
    res.render("readBlogs")
})
app.get("/write",(req,res)=>{
    res.render("writeBlogs")
})
app.get("/profile",(req,res)=>{
    res.render("profile")
})

app.listen(3020,(req,res)=>{
    console.log(`Server running at: http://127.0.0.1:${3020}`);
})