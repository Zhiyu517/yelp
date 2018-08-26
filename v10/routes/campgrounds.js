var express = require("express")
var router = express.Router()
var Comment = require("../models/comment")
var Campground = require("../models/campground")
var middleware = require("../middleware/index")
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
router.post("/",middleware.isLoggedIn, function(req,res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author ={
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: description, author: author};
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
router.get("/new",middleware.isLoggedIn, function(req,res){
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

//Edit campgrounds
router.get("/:id/edit", middleware.checkCampgroundOwnerShip,function(req,res){
    //if user is logged in ?
        Campground.findById(req.params.id, function(err,foundCampground){
                res.render("campgrounds/edit",{campground: foundCampground})
        })
})
//update campgrounds
router.put("/:id", middleware.checkCampgroundOwnerShip,function(req,res){
    // find and upadate the correct campground

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if (err) {
            console.log(err)
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
    //rediirect somewhere
})

//Delete campground route
router.delete("/:id",middleware.checkCampgroundOwnerShip, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds")
        }else{
            res.redirect("/campgrounds")
        }
    })
})


module.exports = router;