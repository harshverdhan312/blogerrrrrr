const { Router } = require("express");
const {addComment,removeComment} = require("../controllers/comment.controllers.js");
const {verifyJWT} = require("../middlewares/auth.middleware.js")


const router = Router()
//secured routes
router.route("/addcomment").post(
    verifyJWT,
    addComment
)

router.route("removecomment").delete(
    verifyJWT,
    removeComment
)


module.exports = {router}