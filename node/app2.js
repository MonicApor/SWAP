var express = require("express");
var app = express();

app.use(express.static("public"));
app.set("view engine","ejs");

app.get('/', function (req, res) {
	res.render("home");
});

app.get('/aboutus', (req, res) => {
    res.render("aboutus");
});

app.get('/category', function (req, res) {
	res.render("category");
});

app.get('/womendress', (req, res) => {
    res.render("womendress");
});

app.get('/womenfootwear', function (req, res) {
	res.render("womenfootwear");
});

app.get('/womenpants', (req, res) => {
    res.render("womenpants");
});

app.get('/womentops', function (req, res) {
	res.render("womentops");
});

app.get('/profile', (req, res) => {
    res.render("profile");
});

app.get('/swapList', (req, res) => {
	res.render("swapList");
});

app.get('/product', (req, res) => {
    res.render("product");
});

app.get('/chat', (req, res) => {
    res.render("chat");
});

app.get('/babiesclothes', (req, res) => {
    res.render("babiesclothes");
});

app.get('/babiesstuffs', (req, res) => {
    res.render("babiesstuffs");
});

app.get('/babiestoys', (req, res) => {
    res.render("babiestoys");
});

app.get('/menshirts', (req, res) => {
    res.render("menshirts");
});

app.get('/menpants', (req, res) => {
    res.render("menpants");
});

app.get('/menfootwear', (req, res) => {
    res.render("menfootwear");
});

app.get('/others', (req, res) => {
    res.render("others");
});

app.get('/livingroom', (req, res) => {
    res.render("livingroom");
});

app.get('/kitchen', (req, res) => {
    res.render("kitchen");
});

app.get('/electronics', (req, res) => {
    res.render("electronics");
});

app.listen(3000, function (){
	console.log("Server is running.");
});