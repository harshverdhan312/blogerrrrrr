const { asyncHandler } = require("../utils/asyncHandler");
const {ApiError} = require("../utils/ApiError.js")
const {ApiResponse} = require("../utils/ApiResponse.js")
const {userModel} = require("../models/user.model.js")
const {blogModel} = require("../models/blogs.model.js")
const{ uploadOnCloudinary } = require("../utils/cloudinary.js")


const saveBlog = asyncHandler(async(req,res)=>{
    const {blogTitle, blogBody, blogGenre, blogLenght, isSuitableForKids} =req.body

    if(
        [blogTitle, blogBody, blogGenre, blogLenght, isSuitableForKids].some((field)=>field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }
    const coverImageLocalPath = req.files?.avatar[0]?.path

    if(!coverImageLocalPath){
        throw new ApiError(400,"cover image is required")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    
    if(!coverImage){
        throw new ApiError(400, "cover Image uplaod fail, Reupload!!!")
    }

    const blog = await blogModel.create({
        blogTitle,
        blogBody,
        blogGenre,
        blogLenght,
        isSuitableForKids,
        coverImage:coverImage.url,
    })
    const createdBlog = await userModel.findById(blog._id)
    if (!createdBlog) {
        throw new ApiError(500, "Something went wrong while uploading the Blog")
    }

    return res.status(201).json(
        new ApiResponse(200, createdBlog, "Blog Uploaded Successfully")
    )

})


module.exports = {
    saveBlog,
}
