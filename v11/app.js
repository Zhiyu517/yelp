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
var methodOverride = require("method-override")
var flash = require("connect-flash")

mongoose.connect("mongodb://localhost/yelp_camp_v11");

var Campground = require("./models/campground")
var seedDB =require("./seed")
var Comment = require("./models/comment")
// seedDB();
var commentRoutes = require("./routes/comment")
var campgroundRoutes = require("./routes/campgrounds")
var indexRoutes = require("./routes/index")




var app = express();
app.use(flash())
//passport configuration==============
app.use(require("express-session")({
    secret: "wang is the best ",
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
    res.locals.error = req.flash("error")  //让每个地方都加上message
    res.locals.success = req.flash("success")  //让每个地方都加上message
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
app.use(methodOverride("_method"))


//require route
app.use("/",indexRoutes)
app.use("/campgrounds",campgroundRoutes)
app.use("/campgrounds/:id/comments",commentRoutes)

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });



module.exports = app;
