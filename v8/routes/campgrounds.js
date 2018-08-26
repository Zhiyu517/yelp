var express = require("express")
var router = express.Router()
var Comment = require("../models/comment")
var Campground = require("../models/campground")
// show all campgrounds
router.get("/", function(req,res){

    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log("error");
        }else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });

});
// create new campgrounds
router.post("/", function(req,res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name: name, image: image, description: description};
    //create a new cp in db
    Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
    })

});

// show new campgrounds
router.get("/new", function(req,res){
    res.render("campgrounds/new");
})

router.get("/:id",function(req,res){
    //find the campground with the provided id
    //render show template with that
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });

});
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}


module.exports = router;