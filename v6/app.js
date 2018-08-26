var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport")
var LocalStrategy = require("passport-local")
var User = require("./models/users")
var passportLocalMongoose = require("passport-local-mongoose")

mongoose.connect("mongodb://localhost/yelp_camp_v6");

var Campground = require("./models/campground")
var seedDB =require("./seed")
var Comment = require("./models/comment")
seedDB();





mongoose.connect("mongodb://localhost/yelp_camp_v6");
var app = express();

//passport configuration==============
app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized:false
}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
/////end passport=====================
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
})
app.use(bodyParser.urlencoded({extended: true}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.get("/",function(req,res){
    res.render("landing");
});
// show all campgrounds
app.get("/campgrounds", function(req,res){

    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log("error");
        }else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });

});
// create new campgrounds
app.post("/campgrounds", function(req,res) {
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
app.get("/campgrounds/new", function(req,res){
    res.render("campgrounds/new");
})

app.get("/campgrounds/:id",function(req,res){
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

//==================================== comment routes

app.get("/campgrounds/:id/comments/new",isLoggedIn, function(req,res){
    //find campground by id
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err)
        }else{
            res.render("comment/new", {campground : campground});
        }
    })

})

app.post("/campgrounds/:id/comments", function(req,res){
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
                    campground.comments.push(comment)
                    campground.save()
                    res.redirect('/campgrounds/' + campground.id);
                }
            })
        }
    })
    //create new comment
    //connect new comment to campground
    //redirect campground
})
//=================================================
//AUTH ROUTRE
app.get("/register", function(req,res){
    res.render("register")
})
//handle sign up
app.post("/register", function(req,res){
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
app.get("/login", function(req,res){
    res.render("log")
})
//handling login logic
//middleware   进入连接后就进行操作
app.post("/login", passport.authenticate("local", {
    successRedirect : "/campgrounds",
    failureRedirect : "/login"
})  ,function(req,res){
})
app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/")
})
//logout route
app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/campgrounds")
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}









// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
