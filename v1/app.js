var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser");


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


app.get("/",function(req,res){
    res.render("landing");
});
var campgrounds = [
    {name: "salmon greek", image: "http://img4.imgtn.bdimg.com/it/u=3848456523,1148983535&fm=27&gp=0.jpg"},
    {name: "grantil hill", image: "http://img3.imgtn.bdimg.com/it/u=1998543207,413466780&fm=27&gp=0.jpg"},
    {name: "springwall", image: "http://img3.imgtn.bdimg.com/it/u=39804869,1100954374&fm=27&gp=0.jpg"},
    {name: "salmon greek", image: "http://img4.imgtn.bdimg.com/it/u=3848456523,1148983535&fm=27&gp=0.jpg"},
    {name: "grantil hill", image: "http://img3.imgtn.bdimg.com/it/u=1998543207,413466780&fm=27&gp=0.jpg"},
    {name: "springwall", image: "http://img3.imgtn.bdimg.com/it/u=39804869,1100954374&fm=27&gp=0.jpg"},
    {name: "salmon greek", image: "http://img4.imgtn.bdimg.com/it/u=3848456523,1148983535&fm=27&gp=0.jpg"},
    {name: "grantil hill", image: "http://img3.imgtn.bdimg.com/it/u=1998543207,413466780&fm=27&gp=0.jpg"},
    {name: "springwall", image: "http://img3.imgtn.bdimg.com/it/u=39804869,1100954374&fm=27&gp=0.jpg"}
];
app.get("/campgrounds", function(req,res){

    res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req,res) {
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
    // res.send("you post");
});
app.get("/campgrounds/new", function(req,res){
    res.render("new.ejs");
})


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
