var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/blog_demo");

//post  title and content
var postSchema = new mongoose.Schema({
    title:String,
    content:String
})
var Post = mongoose.model("Post",postSchema);
//user - email name


var userSchema = new mongoose.Schema({
    email:String,
    name:[String],
    posts: [postSchema]
})
var User = mongoose.model("User",userSchema);
//
//
var newUser = new User({
    email : "asd@gmail.com",
    name : ["sadasd"]
})
newUser.posts.push({
   title:"asdwasdad",
    content:"ssadasdadasd"
})
newUser.save(function(err,user){
    if(err){
        console.log(err);
    }else{
        console.log(user);
    }
})

// var newPost = new Post({
//     title:"on apples",
//     content: "they are good"
// })
//
// newPost.save(function(err,post){
//     if(err){
//         console.log(err)
//     }else{
//         console.log(post)
//     }
// })

//
// User.findOne({name : "tom"},function(err,user){
//     if(err){
//         // console.log(err)
//     }else{
//         user.posts.push({
//             title:"3 things i dont",
//             content: " sdada "
//         })
//         user.save(function(err,user){
//             if(err){
//                 console.log(err)
//             }else{
//                 console.log(user)
//             }
//         })
//     }
// })