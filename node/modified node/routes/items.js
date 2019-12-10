var express = require("express");
var router  = express.Router();
var Item = require("../models/item");
var middleware = require("../middleware");


//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Item.find({}, function(err, allItems){
       if(err){
           console.log(err);
       } else {
          res.render("category",{items:allItems});
       }
    });
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to item array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newItem = {name: name, image: image, description: desc, author:author}
    // Create a new campground and save to DB
    Item.create(newItem, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/items");
        }
    });
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("postitem"); 
});

router.get("/:id", function(req, res){
    Item.findById(req.params.id).populate("comments").exec(function(err, foundItem){
        if(err){
            console.log(err);
        } else {
            console.log(foundItem)
            res.render("product", {item: foundItem});
        }
    });
});


router.get("/:id/edit", middleware.checkItemOwnership, function(req, res){
    Item.findById(req.params.id, function(err, foundItem){
        res.render("edit", {item: foundItem});
    });
});

router.put("/:id",middleware.checkItemOwnership, function(req, res){
    Item.findByIdAndUpdate(req.params.id, req.body.item, function(err, updatedItem){
       if(err){
           res.redirect("/items");
       } else {
           res.redirect("/items/" + req.params.id);
       }
    });
});


router.delete("/:id",middleware.checkItemOwnership, function(req, res){
   Item.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/items");
      } else {
          res.redirect("/items");
      }
   });
});


module.exports = router;

