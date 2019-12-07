const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const PORT = 5000;
const cors = require("cors");
const url = require('url')
const mongoose = require("mongoose");
const AccountModel = require('./models/AccountModel')
const multer = require('multer');
const Item = require('./models/item');
const expressSanitizer  = require('express-sanitizer');
const passport = require("passport");
const localStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");

console.log("connecting....");
mongoose.connect("mongodb://localhost:27017/SwapDb", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: true }, (err, data) => {
    if (err) {
        console.log("error : " + err);
    } else {
        console.log("database is connected!");
    }
});

var user = null,
    loggedIn = false



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/files', express.static(path.join(__dirname, 'uploads')))
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(require("express-session")({
    secret: "It is a secret.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//passport.use(new localStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser())

var user = null,
    loggedIn = false

function checkUser(user) {
    console.log(user);

    return new Promise((resolve, reject) => {
        AccountModel.findOne({ $or: [{ username: user.userKey, password: user.password }, { email: user.userKey, password: user.password }] }, (err, data) => {
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

app.get("/", (req, res) => {
    res.render("home", { page: 'Home' })
})
app.get('/dashboard', (req, res) => {
    if (loggedIn) {
        res.render('profile', { page: 'profile', user: user });
    } else {
        res.redirect('/account_login')
    }
})
app.get('/account_login', (req, res) => {
    if (loggedIn) {
        res.render('profile', { page: 'profile', user: user });
    } else {
        var error = req.query ? req.query.error : false
        res.render('login', { page: 'login', error: error })
    }

})
app.get('/register', (req, res) => {
    var error = req.query ? req.query.error : false
    var errorMessage = req.query ? req.query.errorMessage : ''
    res.render('register', { page: 'register', error: error, errorMessage: errorMessage })
    console.log(error);
})

app.post('/save', (req, res) => {
    // query to db
    checkUser(req.body).then(data => {
        if (data) {
            user = data
            loggedIn = true
            res.redirect("/dashboard")
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
    let newUser = new AccountModel(req.body);
    newUser
        .save()
        .then((new_user) => {
            user = new_user
            res.redirect('/account_login')
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



//category
app.get("/category", (req, res) => {
    Item.find({}, (error, items) => {
        if(error) {
            console.log("Error retrieving");
        } else {
            res.render("womendress", {items: items});
        }
    });
});

//post new item
app.get("/postitem", (req, res) => {
    res.render("postitem", { page: 'postitem' })
});

//create
app.post("/additem", (req, res) => {
    req.body.item.body = req.sanitize(req.body.item.body);
    Item.create(req.body.item, (error, newItem) =>{
        if(error) {
            console.log("Error inserting.");
            console.log(error);
        } else {
            res.redirect("/category");
        }
    });
});

//show
app.get("/index/:id", (req, res) => {
    Item.findById(req.params.id, (error, items) => {
        if(error) {
            res.redirect("/category");
        } else {
            res.render("product", {items: items});
        }
    });
});

// //edit
// app.get("/index/:id/edit", (req, res) => {
//     Blog.findById(req.params.id, (error, blog) => {
//         if(error) {
//             res.redirect("/blogs");
//         } else {
//             res.render("blog/edit", {blog: blog});
//         }
//     });
// });

// //update
// app.put("/blogs/:id", (req, res) => {
//     req.body.blog.body = req.sanitize(req.body.blog.body);
//     Blog.findByIdAndUpdate(req.params.id, req.body.blog, (error, updatedBlog) => {
//         if(error) {
//             res.redirect("/blogs");
//         } else {
//             res.redirect("/blogs/"+req.params.id);
//         }
//     });
// });

// //delete
// app.delete("/blogs/:id", (req, res) => {
//     Blog.findByIdAndRemove(req.params.id, (error) => {
//         if(error) {
//             res.redirect("/blogs");
//         } else {
//             res.redirect("/blogs");
//         }
//     });
// });


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


app.listen(PORT, () => {
    console.log(`Server is running on Port:${PORT}`);
});
