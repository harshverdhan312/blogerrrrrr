const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = require("mongoose");


const followersUserSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required: true,
          },
          followers:[
            {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
          }
        ]
      
    },{
      timeseries:true
    })



const followersModel = mongoose.model("followers", followersUserSchema);
exports.followersModel = followersModel;