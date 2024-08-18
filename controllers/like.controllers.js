const { asyncHandler } = require("../utils/asyncHandler");
const { ApiResponse } = require("../utils/ApiResponse.js");
const { likesModel } = require("../models/comments.model.js");
const { ApiError } = require("../utils/ApiError.js");

const addLike = asyncHandler(async(req,res)=>{
    const user = req.user._id
    const blog = req.params.id

    const likes = await likesModel.create({
        user:user,
        blog:blog
    })

    if(!likes){
        throw new ApiError(500,"Like not send")
    }
    return res.status(200).json(
        new ApiResponse(200,null,"Like added")
    )
})

const removeLike = asyncHandler(async(req,res)=>{
    const user = req.user._id
    const blog = req.params.id


    const isLiked = await likesModel.find(
        {
            user:user,
            blog:blog
        }
    )
    if(!isLiked){
        throw new ApiError(404,"Like not found")
    }

    const result = await likesModel.deleteOne(
        { 
            user: user,
            blog:blog
        }
    )

    if(result.deletedCount === 0){
        throw new ApiError(500,"Something went wrong")
    }
    return res.status(200).json(
        new ApiResponse(
            200,null,"like removed successfully"
        )
    )

})


module.exports ={
    addLike,
    removeLike
}