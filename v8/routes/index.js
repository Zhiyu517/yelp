var express = require("express")
var router = express.Router()
var passport = require("passport")
var User = require("../models/users")
var Comment = require("../models/comment")
var Campground = require("../models/campground")


//root route
router.get("/",function(req,res){
    res.render("landing");
});
//=================================================
//AUTH ROUTRE
router.get("/register", function(req,res){
    res.render("register")
})
//handle sign up
router.post("/register", function(req,res){
    var newUser = new User({
        username: req.body.username
    })
    User.register(newUser, req.body.password,function(err,user){
        if(err){
            console.log(err)
            return res.render("register")  ///return  好处是直接终止了
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/campgrounds")
            });
        }
    })
})
//show login form
router.get("/login", function(req,res){
    res.render("log")
})
//handling login logic
//middleware   进入连接后就进行操作
router.post("/login", passport.authenticate("local", {
    successRedirect : "/campgrounds",
    failureRedirect : "/login"
})  ,function(req,res){
})
router.get("/logout", function(req,res){
    req.logout();
    res.redirect("/")
})
//logout route
router.get("/logout", function(req,res){
    req.logout();
    res.redirect("/campgrounds")
})



module.exports = router;