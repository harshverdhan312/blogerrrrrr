const mongoose = require("mongoose");
const { Schema } = require("mongoose");


const likesCountSchema = new Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required: true,
        },
        blog:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Blog",
            required: true,
        }
      
    },{
      timestamps:true
    })



const likeModel = mongoose.model("Like", likesCountSchema);
module.exports.likeModel = likeModel;