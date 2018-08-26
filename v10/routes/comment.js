var express = require("express")
var router = express.Router({mergeParams: true})
var Comment = require("../models/comment")
var Campground = require("../models/campground")
var middleware = require("../middleware/index")
//==================================== comment routes

//comment new
router.get("/new",middleware.isLoggedIn, function(req,res){
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
                    comment.author.username = req.user.username
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
//comment edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnerShip, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comment/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});
//comment update route
router.put("/:comment_id",middleware.checkCommentOwnerShip,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            res.redirect("back")
        }else{
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
})
//comment delete route
router.delete("/:comment_id", middleware.checkCommentOwnerShip, function(req,res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back")
        }else{
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

//middle ware

module.exports = router;