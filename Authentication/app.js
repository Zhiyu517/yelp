var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var passport = require("passport")
var User = require("./models/user")
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose")



mongoose.connect("mongodb://localhost/auth_demo_app");



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
////////use passport
app.use(require("express-session")({
    secret: "Rusty is the best",
    resave: false,
    saveUninitialized:false
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));





app.use(passport.initialize());
app.use(passport.session());
/////end passport
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());







//=================ROUTE===============






app.get("/", function(req,res){
    res.render("home")
})

app.get("/secret",isLoggedIn, function(req,res){
    res.render("secret")
})



//=========================auth
//show sign up form
app.get("/register",function(req,res){
    res.render("register")
})
//handling the user sign uo
app.post("/register",function(req,res){
    req.body.username
    req.body.password
    User.register(new User({username:req.body.username}), req.body.password,function(err,user){
        if(err){
            console.log(err)
            return res.render("register")
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secret")
            })
        }
    })
})
//login routes
//render login form
app.get("/login",function(req,res){
    res.render("login")
})
//login logic
//middleware   进入连接后就进行操作
app.post("/login", passport.authenticate("local", {
    successRedirect : "/secret",
    failureRedirect : "/login"
})  ,function(req,res){
})
app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/")
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
