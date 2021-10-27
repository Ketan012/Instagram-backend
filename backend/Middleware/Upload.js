var multer = require('multer');
const UserProfile = require('../Models/UserProfile');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + '/../Assets/uploads/')
    },
    filename: (req, file, cb) => {
        let fileName;
        // console.log("file: ", req.path.substring(13))
        UserProfile.findOne({ userId: req.path.substring(13)}, (err, user)=>{
            if(err){
                console.log("error: ", err);
            }
            console.log("user: ", user);
            if(user){
                userpath = user.path.split('/');
                fileName = userpath[userpath.length - 1];
                console.log("filename: ", fileName)
                cb(null, fileName);
            }
            else{
                cb(null, file.fieldname + '-' + Date.now())
            }
           

        })
    }
});
  
var upload = multer({ storage: storage });

module.exports = upload;