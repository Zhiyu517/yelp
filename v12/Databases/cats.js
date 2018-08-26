var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cat_app");

var catSchema = new mongoose.Schema({
    name:String,
    age:Number,
    temperament:String
});

var Cat = mongoose.model("Cat", catSchema);



//adding a new cat to the db
//
var geroge = new Cat({
                name:"qian",
                age:2,
                temperament:"Evil"
});

geroge.save(function(err,cat){
    if(err){
        console.log("something is wrong")
    }else{
        console.log("we just saved a cat")
        console.log(cat);
    }
});
Cat.create({
   name: "snow white",
   age: 15,
   temperament: "Bland"
},function(err,cat){
    if(err){
        console.log("err");
    }else{
        console.log(cat);
    }
});



//retrieve all cats from the db and console each one
Cat.find({},function(err,cats){
    if(err){
        console.log("oh error");
        console.log(err);
    }else{
        console.log("all the cats....")
        console.log(cats);
    }
})