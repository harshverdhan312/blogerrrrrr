const { Router } = require("express");
const { registerUser, loginUser, logoutUser, updateAccountDetails, updateUserAvatar,changeCurrentPassword,getCurrentUser,searchProfile,refreshAccessToken} = require("../controllers/user.controllers.js");
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

router.route("/searchuser").get(
    searchProfile
)
//secured routes

router.route("/refresh-token").post(refreshAccessToken)

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
router.route("/change-password").post(
    verifyJWT,
    changeCurrentPassword
)
router.route("/me").get(
    verifyJWT,
    getCurrentUser
)




module.exports = {router};
