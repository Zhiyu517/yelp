var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/blog_demo_2");

var Post = require("./models/post")
var User = require("./models/user")


Post.create({
    title:"how to cool pt3.",
    content:"barbarbrasadssdasda"
},function(err,post){
    User.findOne({email: "asdasd@gmail.com"}, function(err,foundUser){
        foundUser.posts.push(post)
        foundUser.save(function(err,data){
            console.log(data)        //只可以看见 post 中的id
        })
    })
})




// User.create({
//     email:"asdasd@gmail.com",
//     name:"wang"
// })




//find user    可以看见id 内的内容

// User.findOne({email:"asdasd@gmail.com"}).populate("posts").exec(function(err,user){
//     console.log(user)
// })
