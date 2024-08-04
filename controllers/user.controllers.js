const { asyncHandler } = require("../utils/asyncHandler");
const {ApiError} = require("../utils/ApiError.js")
const {ApiResponse} = require("../utils/ApiResponse.js")
const {userModel} = require("../models/user.model.js")
const{ uploadOnCloudinary } = require("../utils/cloudinary.js")

const registerUser= asyncHandler (async(req,res)=>{
    const {fullName, email, username, password,dob,purpose,} = req.body

    if(
        [fullName, email, username, password, dob, purpose].some((field)=>field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }
    const existedUser = await userModel.findOne({
        $or: [{ username }, { email }]
    });
    

    if (existedUser){
        throw new ApiError(409, "User with same email and username exists ")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    console.log(avatar);
    
    if(!avatar){
        throw new ApiError(400, "Avatar file uplaod fail, Reupload!!!")
    }

    const user = await userModel.create({
        fullName,
        avatar:avatar.url,
        email,
        password,
        username: username.toLowerCase(),
        dob,
        purpose,
    })

    const createdUser = await userModel.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )



})


module.exports = {registerUser}