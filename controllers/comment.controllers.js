const { asyncHandler } = require("../utils/asyncHandler");
const { ApiResponse } = require("../utils/ApiResponse.js");
const { commentsModel } = require("../models/comments.model.js");
const { ApiError } = require("../utils/ApiError.js");


const addComment = asyncHandler(async(req,res)=>{
    const commentString = req.body.comment
    if(!commentString){
        throw new ApiError(400, "No comment provided");
    }
    const user = req.user._id
    const blog = req.params.id

    const comment = await commentsModel.create(
        {
            user:user,
            blog:blog,
            comments:[commentString]
        }
    )
    if(!comment){
        throw new ApiError(500,"comment not saved")
    }
    return res.status(200).json(
        new ApiResponse(200,comment, "Comment added successfullyy")
    )
})

const removeComment = asyncHandler(async(req,res)=>{
    const id = req.params.id
    if (!id) {
        throw new ApiError(400, "No comment ID provided");
    }

    const result = await commentsModel.deleteOne({ _id: new ObjectId(id)})

    if(result.deletedCount === 0){
        throw new ApiError(500,"Something went wrong")
    }
    return res.status(200).json(
        new ApiResponse(
            200,null,"Comment deleted successfully"
        )
    )

})


module.exports ={
    addComment,
    removeComment
}