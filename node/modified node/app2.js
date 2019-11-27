const   express = require("express"),
        app = express(),
        parser = require("body-parser"),
        mongoose = require("mongoose");

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(parser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost/profiledb',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
 
const profileSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },
    userName:  { type: String, required: true, unique: true },
    Password:  { type: String, required: true },
    Email:      { type: String, required: true, unique: true },
    Address:  { type: String, required: true },
    Description:  { type: String, required: true },
    imgLink:   { type: String, required: true}
})

var Profile = mongoose.model("profile",profileSchema);

app.post('/register',(req,res) =>{
    Profile.create({
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        userName: req.body.username,
        Email: req.body.email,
        Password: req.body.password,
        Address: req.body.address,
        Description: req.body.description,
        imgLink: req.body.imgurl
    }, (err, profile) => {
        if(err){
            console.log(err);
        }else{
            res.render('profile', {profile : profile});
        }
    });
});

app.get('/home', function (req, res) {
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

// app.get('/profile', (req, res) => {
//     res.render("profile");
// });

app.get('/swapList', (req, res) => {
	res.render("swapList");
});

app.get('/product', (req, res) => {
    res.render("product");
});

app.get('/chat', (req, res) => {
    res.render("chat");
});


app.listen(8080, function (){
	console.log("Server is running.");
});