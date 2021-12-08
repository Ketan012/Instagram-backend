const PostContent = require("../../Models/PostContent");
const UserPost = require("../../Models/UserPost");

exports.createPost = (req, res) => {

    const { location, postType, caption } = req.body;

    let postcontentdata = {};

    if(!req.file){
        return res.json({
            data: null,
            status: "error",
            error: "Content is required."
        })
    }

    const { mimetype, buffer, size } = req.file;

    if(!postType || postType === ""){
        return res.json({
            data: null,
            status: "error",
            error: "Post type is required."
        })
    }

    if(postType !== 'reel' && postType !== 'story' && postType !=='post'){
        return res.json({
            data: null,
            status: "error",
            error: "Post type is invalid."
        })
    }

    if(mimetype !== 'video/mp4' && mimetype !== 'image/jpeg' && mimetype !== 'image/jpg' && mimetype !== 'image/png'){
        return res.json({
            data : null,
            status: "error",
            error: "Unsupported format."
        })
    }

    if(size > 16777216){
        return res.json({
            data : null,
            status: "error",
            error: "File size should be less than 16 mb."
        })
    }

    if(caption && location){
        postcontentdata = {
            content : {
                buffer: `data:${mimetype};base64,` + buffer.toString('base64'),
                contentType: mimetype
            },
            postType : postType,
            caption : caption,
            location : location
        };
    } else if(caption && !location){
        postcontentdata = {
            content : {
                buffer: `data:${mimetype};base64,` + buffer.toString('base64'),
                contentType: mimetype
            },
            postType : postType,
            caption : caption
        };
    } else if(!caption && location){
        postcontentdata = {
            content : {
                buffer: `data:${mimetype};base64,` + buffer.toString('base64'),
                contentType: mimetype
            },
            postType : postType,
            location : location
        };
    }

    const newPostContent = new PostContent(postcontentdata);
    newPostContent.save((err, postContent) => {
      if (err) {
        return res.json({
          data: null,
          status: "error",
          error: "Failed to create a post.",
        });
      }

      const newUserPost = new UserPost({
        postContentId: postContent._id,
        userId : req.profile._id
      });

      newUserPost.save((err, userpost) => {
        if (err) {
            return res.json({
              data: null,
              status: "error",
              error: "Failed to create a post.",
            });
          }

          return res.json({
            data: "Post created successfully.",
            status: "success",
            error: null,
          });
      })
    });
}