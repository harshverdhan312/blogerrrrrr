const { Router } = require("express");
const {saveBlog} = require("../controllers/blog.controllers.js");
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
    saveBlog
)


module.exports = router;