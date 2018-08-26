var mongoose = require("mongoose")
var Campground = require("./models/campground")
var Comment = require("./models/comment")
var data = [
    {
        name : "first",
        image: "https://images.unsplash.com/photo-1496947850313-7743325fa58c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=8f0bb0006c15a626dab0a5025e7838fa&auto=format&fit=crop&w=700&q=60",
        description:"blablabla"
    },
    {
        name : "sencond",
        image: "https://images.unsplash.com/photo-1500367215255-0e0b25b396af?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=193a2a1fa9c7ee1a2d4db00f22e41552&auto=format&fit=crop&w=700&q=60",
        description:"blablabla"
    },
    {
        name : "third",
        image:"https://images.unsplash.com/photo-1519790751650-82078ca9d4f3?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=9dbccd134520f0fa2a2cda23edf237e0&auto=format&fit=crop&w=700&q=60",
        description:"blablabla"
    }
]


function seedDB() {
    //Remove all thing
    Campground.remove({}, function (err) {
        console.log("removed campgrounds!")
        //add a new camp
        data.forEach(function(seed){
            Campground.create(seed,function(err,campground){
                console.log("added a camp")
                //create comment
                Comment.create(
                    {
                    text: "This is place is great",
                    author: "wang"
                    },function(err,comment){
                        campground.comments.push(comment);
                        campground.save();
                        console.log("create a  comment")
                    })
            })
        })
    })




}
module.exports = seedDB;

