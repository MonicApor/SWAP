const   express = require("express"),
        app = express(),
        bodyParser = require("body-parser"),
        path = require("path"),
        cors = require("cors"),
        url = require('url'),
       Accounts = require('./models/Accounts'),
        multer = require('multer'),
        mongoose = require("mongoose");
const PORT = 3000;
//const JSalert = require("js-alert");


console.log("connecting....");
mongoose.connect("mongodb://localhost:27017/SwapDb", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: true }, (err, data) => {
    if (err) {
        console.log("error : " + err);
    } else {
        console.log("database is connected!");
    }
});

var user = null;
var loggedIn = false;

app.set("view engine","ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use('/files', express.static(path.join(__dirname, 'uploads')))
    

function checkUser(user){
    console.log(user);

    return new Promise((resolve,reject) => {
        Accounts.findOne({ $or: [{ username: user.username, password: user.password }, { email: user.username, password: user.password }] }, (err, data) => {
            if (!err) {
                resolve(data)
            } else {
                reject(err)
            }
        })
    })
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        var filename = `uploads_${Math.round(+new Date() / 1000)}_${file.originalname}`
        cb(null, filename)
    }
})

var upload = multer({ storage: storage, limits: { fileSize: 1000000000 } })




// const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;
 
// const profileSchema = new mongoose.Schema({
//     firstName: { type: String, required: true },
//     lastName:  { type: String, required: true },
//     userName:  { type: String, required: true, unique: true },
//     Password:  { type: String, required: true },
//     Email:      { type: String, required: true, unique: true },
//     Address:  { type: String, required: true },
//     Description:  { type: String, required: true },
//     imgLink:   { type: String, required: true}
// })

// var Profile = mongoose.model("profile",profileSchema);

// app.post('/register',(req,res) =>{
//     Profile.create({
//         firstName: req.body.firstname,
//         lastName: req.body.lastname,
//         userName: req.body.username,
//         Email: req.body.email,
//         Password: req.body.password,
//         Address: req.body.address,
//         Description: req.body.description,
//         imgLink: req.body.imgurl
//     }, (err, profile) => {
//         if(err){
//             console.log(err);
//         }else{
//             res.render('profile', {profile : profile});
//         }
//     });
// });


app.get('/', function (req, res) {
	res.render("home",{page: "Home"});
});

app.get('/profile', (req, res) => {
    if (loggedIn) {
        res.render('profile', { page: 'profile', user: user });
    } else {
       // JSalert.alert("You must login first");
        res.redirect('/home')
    }
})

app.get('/register', (req, res) => {
    var error = req.query ? req.query.error : false
    var errorMessage = req.query ? req.query.errorMessage : ''
   // JSalert.alert("You must login first");
    res.render('home', { page: 'home', error: error, errorMessage: errorMessage })
})

app.get('/account_login', (req, res) => {
    if(loggedIn){
        res.render('profile',{page: 'profile', user:user});
    }else{
     //   alert("Incorrect, pleease try again");
        var error = req.query ? req.query.error : false
        res.render('home',{page: 'home', error: error});
    }
})

app.post('/save', (req, res) => {
    // query to db
    checkUser(req.body).then(data => {
        if (data) {
            user = data
            loggedIn = true
            res.redirect("/profile")
        } else {
            res.redirect(url.format({
                pathname: "/account_login",
                query: { error: true },
            }))
        }
    }).catch(err => {
        res.send('something went wrong! \n' + err)
    })
})

app.post('/createAccount', upload.single('img'), (req, res) => {
    req.body.src = `http://localhost:${PORT}/files/${req.file.filename}`
    let newUser = new Accounts(req.body);
    newUser
        .save()
        .then((new_user) => {
            user = new_user
            res.redirect("/account_login")
        })
        .catch(err => {
            res.redirect(url.format({
                pathname: "/register",
                query: {
                    error: true,
                    errorMessage: err
                },
            }))
        });
})

app.get('/logout', (req, res) => {
    user = null;
    loggedIn = false
    res.redirect('/account_login')
})


app.listen(PORT, function (){
	console.log("Server is running");
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

