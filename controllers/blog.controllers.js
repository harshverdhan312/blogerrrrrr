const { asyncHandler } = require("../utils/asyncHandler");
const {ApiError} = require("../utils/ApiError.js")
const {ApiResponse} = require("../utils/ApiResponse.js")
const {userModel} = require("../models/user.model.js")
const {blogModel} = require("../models/blogs.model.js")
const{ uploadOnCloudinary } = require("../utils/cloudinary.js")


const postBlog = asyncHandler(async(req,res)=>{
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
        author:req.user._id,
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


const updateBlog = asyncHandler(async(req,res)=>{
    const {updatedBlogTitle, updatedBlogBody, updatedBlogGenre, updatedBlogLenght, updatedIsSuitableForKids} =req.body

    if(
        !(updatedBlogTitle || updatedBlogBody || updatedBlogGenre || updatedBlogLenght ||updatedIsSuitableForKids)
    ){
        throw new ApiError(400, "All fields are required")
    }

    const blog = await blogModel.findByIdAndUpdate(
        req.blog?._id,
        {
            $set: {
                updatedBlogTitle,
                updatedBlogBody,
                updatedBlogGenre,
                updatedBlogLenght,
                updatedIsSuitableForKids
            }
        },
        {new: true}
    )
    return res
    .status(200)
    .json(
        new ApiResponse(
            200, blog, "Blog updated successfully"
        )
    )
})

const updateCoverImage = asyncHandler(async(req,res)=>{
    const coverImageLocalPath = req.file?.path
    if (!coverImageLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    //TODO: delete old image 

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on avatar")
        
    }

    const blog = await userModel.findByIdAndUpdate(
        req.blog?._id,
        {
            $set:{
                coverImage: coverImage.url
            }
        },
        {new: true}
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, blog, "Cover image updated successfully"
        )
    )

})

// for those who didnt signed up or logged in yet 
const getRandomBlogs = asyncHandler(async (req, res) => {
    const blogs = await blogModel.aggregate([
        { $sample: { size: 10 } }, 
        { 
            $project: {
                _id: 1,
                title: 1,
                author: 1,
                coverImage: 1,
                mainbody: 1,
                genre: 1,
                wordslenght: 1,
                forkids: 1,
                likesCount: 1,
                comments: 1,
                createdAt: 1
            } 
        } 
    ]);

    return res
    .status(200)
    .json(
        new ApiResponse(200,blogs,"Random Blogs sent")
    )
});



module.exports = {
    postBlog,
    updateBlog,
    updateCoverImage,
    getRandomBlogs
}
