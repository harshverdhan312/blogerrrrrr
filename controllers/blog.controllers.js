const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError.js")
const { ApiResponse } = require("../utils/ApiResponse.js")
const { userModel } = require("../models/user.model.js")
const { blogModel } = require("../models/blogs.model.js")
const{ uploadOnCloudinary } = require("../utils/cloudinary.js")


/* const readBlog = async(blogId)=>{
    blog = await blogModel.findOne(blogId)
    if (!blog){
        throw new ApiError(404,"Blog not found")
    }
    return res.status(200).json(new ApiResponse(200,blog,"blog fetched successfully"))
} */

const postBlog = asyncHandler(async(req,res)=>{
    const {blogTitle, blogBody, blogGenre, blogLenght, isSuitableForKids} =req.body

    if(
        [blogTitle, blogBody, blogGenre, blogLenght, isSuitableForKids].some((field)=>field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }
    console.log(req.files)
    
    const coverImageLocalPath = req.files?.cover[0]?.path

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

    if (!blog) {
        throw new ApiError(500, "Something went wrong while uploading the Blog")
    }

    return res.status(201).json(
        new ApiResponse(200, blog, "Blog Uploaded Successfully")
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

const getBlogsFromFollowers = asyncHandler(async(req,res)=>{
    try {
        const userId = req.params.id;
        const user = await userModel.findById(userId)
            .populate({
                path: 'followers',
                populate: {
                    path: 'blogs',
                    model: 'Blog'
                }
            });
        if (!user) {
            throw new ApiError("404","User not Found")
        }
        const blogs = {
            followers: user.followers 
        }
        return res.status(201).json(
            new ApiResponse(200,blogs,"Targeted Blogs sent")
        )
    } catch (error) {
        throw new ApiError("400", error)
    }  
})

const getBlogsFromPreferredGenre = asyncHandler(async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        
        if (!user) {
            return res.status(404).send("User not found");
        }

        const blogs = await blogModel.find({
            author: {
                $in: await userModel.find({ prefferedGenre: user.prefferedGenre }).distinct('_id')
            },
            genre: user.prefferedGenre
        }).populate('author');
        return res
        .status(200)
        .json(new ApiResponse(200,blogs,"Targeted Blogs over genre preference sent"))
    } catch (error) {
        throw new ApiError(500,error)
    }
});



module.exports = {
    postBlog,
    updateBlog,
    updateCoverImage,
    getRandomBlogs,
    getBlogsFromFollowers,
    getBlogsFromPreferredGenre
}
