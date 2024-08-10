const { Router } = require("express");
const { registerUser, loginUser, logoutUser, updateAccountDetails, updateUserAvatar} = require("../controllers/user.controllers.js");
const {upload} = require("../middlewares/multer.middleware.js")
const {verifyJWT} = require("../middlewares/auth.middleware.js")

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount : 1
        }
    ]),
    registerUser
)

router.route("/login").post(
    loginUser
)

//secured routes
router.route("/logout").post(
    verifyJWT,
    logoutUser
)
router.route("/updateuser").post(
    verifyJWT,
    updateAccountDetails
)

router.route("/updateavatarimage").post(
    upload.fields([
        {
            name : "avatar",
            maxCount : 1
        }
    ]),
    verifyJWT,
    updateUserAvatar
)



module.exports = router;
