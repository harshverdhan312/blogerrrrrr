const mongoose = require("mongoose");
const { Schema } = require("mongoose");


const followersUserSchema = new Schema(
    {
        user: {//author
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required: true,
          },
          followers:[//audience
            {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
          }
        ]
      
    },{
      timestamps:true
    })

const followersModel = mongoose.model("followers", followersUserSchema);
exports.followersModel = followersModel;