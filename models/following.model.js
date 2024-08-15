const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = require("mongoose");


const followingUserSchema = new Schema(
    {
      user: {//audience
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
      },
      following:[//authors
        {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
      }
    ]
},{
      timestamps:true
})

const followingModel = mongoose.model("following", followingUserSchema);
exports.followingModel = followingModel;