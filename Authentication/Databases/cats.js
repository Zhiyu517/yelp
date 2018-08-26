var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/water_app");

var waterSchema = new mongoose.Schema({
    name:String,
    age:Number,
    temperament:String
});

var Water = mongoose.model("Water", waterSchema);



//adding a new cat to the db
//
var geroge = new Water({
                name:"qian",
                age:2,
                temperament:"Evil"
});

geroge.save(function(err,water){
    if(err){
        console.log("something is wrong")
    }else{
        console.log("we just saved a cat")
        console.log(water);
    }
});
Water.create({
   name: "snow white",
   age: 15,
   temperament: "Bland"
},function(err,water){
    if(err){
        console.log("err");
    }else{
        console.log(water);
    }
});



//retrieve all cats from the db and console each one

Water.find({},function(err,water){
    if(err){
        console.log("oh error");
        console.log(err);
    }else{
        console.log("all the cats....")
        console.log(water);
    }
})