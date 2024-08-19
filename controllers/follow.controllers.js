const { asyncHandler } = require("../utils/asyncHandler");
const { ApiResponse } = require("../utils/ApiResponse.js")
const { followersModel } = require("../models/following.model.js")
const { followingModel } = require("../models/followers.models.js")


const addFollow = asyncHandler(async (req, res) => {
    const { userToFollowId } = req.body; // The ID of the user to be followed
    const userId = req.user._id; // The ID of the current user who is following
  
    // Update followersUserSchema
    const userToFollow = await followersModel.findOne({ user: userToFollowId });
    if (!userToFollow) {
      userToFollow = await followersModel.create({
        user: userToFollowId,
        followers: [userId]
      });
    } else {
      if (!userToFollow.followers.includes(userId)) {
        userToFollow.followers.push(userId);
        await userToFollow.save();
      }
    }
  
    // Update followingUserSchema
    const userFollowing = await followingModel.findOne({ user: userId });
    if (!userFollowing) {
      userFollowing = await followingModel.create({
        user: userId,
        following: [userToFollowId]
      });
    } else {
      if (!userFollowing.following.includes(userToFollowId)) {
        userFollowing.following.push(userToFollowId);
        await userFollowing.save();
      }
    }
  
    return res
    .status(200)
    .json(
        new ApiResponse(200, null, "Successfully followed the user")
    )

});
  
const removeFollow = asyncHandler(async(req,res)=>{
    const { userToUnfollowId } = req.body; // The ID of the user to be unfollowed
    const userId = req.user._id; // The ID of the current user who is unfollowing
  
    // Update followersModel (Remove the current user from the followers array of the user being unfollowed)
    const userToUnfollow = await followersModel.findOne({ user: userToUnfollowId });
    if (userToUnfollow) {
      userToUnfollow.followers = userToUnfollow.followers.filter(
        followerId => !followerId.equals(userId)
      );
      await userToUnfollow.save();
    }
  
    // Update followingModel (Remove the user being unfollowed from the following array of the current user)
     const userFollowing = await followingModel.findOne({ user: userId });
    if (userFollowing) {
      userFollowing.following = userFollowing.following.filter(
        followingId => !followingId.equals(userToUnfollowId)
      );
      await userFollowing.save();
    }
  
    res.status(200).json(new ApiResponse(200, null, "Successfully unfollowed the user"));
  
})

const countFollow = asyncHandler(async(req,res)=>{
    const userId = req.params.userId || req.user._id; 

    const followersCount = await followersModel.findOne({ user: userId }).select('followers').then(followersDoc => {
        return followersDoc ? followersDoc.followers.length : 0;
    });

    const followingCount = await followingModel.findOne({ user: userId }).select('following').then(followingDoc => {
        return followingDoc ? followingDoc.following.length : 0;
    });

    return res.status(200).json(
        new ApiResponse(200, { followersCount, followingCount }, "Follow counts retrieved successfully")
    )
})




module.exports = {
    addFollow,
    removeFollow,
    countFollow
}