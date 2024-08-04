const { asyncHandler } = require("../utils/asyncHandler");
const {ApiError} = require("../utils/ApiError.js")
const {ApiResponse} = require("../utils/ApiResponse.js")
const {userModel} = require("../models/user.model.js")
const{ uploadOnCloudinary } = require("../utils/cloudinary.js")



const generateAccessAndRefreshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

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

const loginUser = asyncHandler(async (req, res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email, username, password} = req.body

    if (!username || !email) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await userModel.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await userModel.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})



module.exports = {
    registerUser,
    loginUser,
    logoutUser
}