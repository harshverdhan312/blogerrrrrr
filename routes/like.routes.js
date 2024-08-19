const { Router } = require("express");
const {addLike,removeLike} = require("../controllers/like.controllers.js");
const {verifyJWT} = require("../middlewares/auth.middleware.js")


const router = Router()
//secured routes
router.route("/addlike").post(
    verifyJWT,
    addLike
)

router.route("removelike").delete(
    verifyJWT,
    removeLike
)

module.exports = {router}