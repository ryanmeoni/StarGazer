var express = require("express");
var router  = express.Router();
var Post = require("../models/post");
var middleware = require("../middleware");


//INDEX - show all posts
router.get("/", function(req, res){
    // Get all posts from DB
    Post.find({}, function(err, allPosts){
       if(err){
           console.log(err);
       } else {
          res.render("posts/index",{posts: allPosts});
       }
    });
});

//CREATE - add new post to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to Posts array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var price = req.body.price; 
    var newPost = {name: name, image: image, description: desc, author: author, price: price}
    // Create a new post and save to DB
    Post.create(newPost, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to posts page
            console.log(newlyCreated);
            res.redirect("/posts");
        }
    });
});

//NEW - show form to create new post
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("posts/new"); 
});

// SHOW - shows more info about one post
router.get("/:id", function(req, res){
    //find the post with provided ID
    Post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            console.log(foundPost);
            //render show template with that post
            res.render("posts/show", {post: foundPost});
        }
    });
});

// EDIT POST ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        if (err) {
            req.flash("error", "Cannot fetch edit post page!"); 
            res.redirect("back");
        }
        res.render("posts/edit", {post: foundPost});
    });
});

// UPDATE POST ROUTE
router.put("/:id",middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedPost){
       if(err){
           res.redirect("/posts");
       } else {
           //redirect somewhere(show page)
           res.redirect("/posts/" + req.params.id);
       }
    });
});

// DESTROY POST ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership, function(req, res){
   Post.findByIdAndRemove(req.params.id, function(err){
      if(err){
          req.flash("error", "Post not deleted! Error!");
          res.redirect("/posts");
      } else {
          req.flash("success", "Post deleted!");
          res.redirect("/posts");
      }
   });
});


module.exports = router;

