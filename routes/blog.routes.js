const { Router } = require("express");
const {postBlog, updateBlog, updateCoverImage} = require("../controllers/blog.controllers.js");
const {upload} = require("../middlewares/multer.middleware.js")
const {verifyJWT} = require("../middlewares/auth.middleware.js")



const router = Router()

// secured routes
router.route("/postblog").post(
    upload.fields([
        {
            name : "cover",
            maxCount : 1
        }
    ]),
    verifyJWT,
    postBlog
)

router.route("/updateblog").post(
    verifyJWT,
    updateBlog
)

router.route("/updatecoverimage").post(
    upload.fields([
        {
            name : "cover",
            maxCount : 1
        }
    ]),
    verifyJWT,
    updateCoverImage
)

module.exports = router;