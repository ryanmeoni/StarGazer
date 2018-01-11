var mongoose = require("mongoose");
var Post = require("./models/post");
var Comment = require("./models/comment");

var data = [{
    name: "Cloud's Rest",
    image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    author: {
        id: mongoose.Types.ObjectId(),
        username: "Seeded"
    }
}]

function seedDB() {
    //Remove all posts
    Post.remove({}, function(err) {
        if (err) {
            console.log(err);
        }
        console.log("removed posts!");
        //add a few posts
        data.forEach(function(seed) {
            Post.create(seed, function(err, post) {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log("added a post");
                    //create a comment
                    Comment.create({
                        text: "This place is great, but I wish there was internet",
                        author: {
                            id: mongoose.Types.ObjectId(),
                            username: "Seeded"
                        }
                    }, function(err, comment) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            post.comments.push(comment);
                            post.save();
                            console.log("Created new comment");
                        }
                    });
                }
            });
        });
    });
    //add a few comments
}

module.exports = seedDB;
