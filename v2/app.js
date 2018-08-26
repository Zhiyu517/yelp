var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");
var app = express();
app.use(bodyParser.urlencoded({extended: true}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name : String,
    image : String,
    description: String


})
var Campground = mongoose.model("Campground", campgroundSchema);
// Campground.create(
//     {
//         name: "the first",
//         image: "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1582169128,1036342155&fm=15&gp=0.jpg",
//         description: "This is a huge bad hill"
//     },function(err,campground){
//         if(err){
//             console.log(err);
//         }else{
//             console.log(campground);
//         }
//     });


app.get("/",function(req,res){
    res.render("landing");
});
// show all campgrounds
app.get("/campgrounds", function(req,res){
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log("error");
        }else{
            res.render("index", {campgrounds: allCampgrounds});
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
    res.render("new.ejs");
})

app.get("/campgrounds/:id",function(req,res){
   //find the campground with the provided id
   //render show template with that
    Campground.findById(req.params.id, function(err,foundCampground){
       if(err){
           console.log(err);
       } else{
           res.render("show", {campground: foundCampground});
       }
    });

});









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
