var express = require("express")
var router = express.Router({mergeParams: true})
var Comment = require("../models/comment")
var Campground = require("../models/campground")
//==================================== comment routes

//comment new
router.get("/new",isLoggedIn, function(req,res){
    //find campground by id
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err)
        }else{
            res.render("comment/new", {campground : campground});
        }
    })

})



router.post("/", function(req,res){
    //look up campground using id
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        }else {
            Comment.create(req.body.comment, function(err,comment){
                if(err){
                    console.log(err)
                }else{
                    //add username and id
                    comment.author.id = req.user._id;
                    comment.username = req.user.username
                    // and save
                    comment.save()
                    campground.comments.push(comment)
                    campground.save()
                    res.redirect('/campgrounds/' + campground.id);
                }
            })
        }
    })



})
//middle ware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

module.exports = router;