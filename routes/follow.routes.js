const { Router } = require("express");
const {addFollow,removeFollow,getfollow, countFollow} = require("../controllers/follow.controllers.js");
const {verifyJWT} = require("../middlewares/auth.middleware.js")


const router = Router()
//secured routes

router.route("/addfollow").post(
    verifyJWT,
    addFollow
)

router.route("/removefollow").post(
    verifyJWT,
    removeFollow
)

router.route("/countfollowers/:userId?").get(
    verifyJWT,
    countFollow
)


module.exports = router;