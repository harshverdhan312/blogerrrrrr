const mongoose = require("mongoose");
const { Schema } = require("mongoose");


const blogsSchema = new Schema(
    {
      blogTitle: {
        type: String,
        required: true,
      },
      author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
      },
      coverImage:{
        type:String,
        required: true,
      },
      blogBody: {
        type:String,
        required: true,
      },
      blogGenre:{
        type:String,
        required : true,
      },
      blogLenght:{
        type:String,
        possibleValues: ["less than 100 words ", "more than 100 words"],
        required:true
      },
      isSuitableForKids:{
        type:Boolean,
        required: true
      },
      likesCount:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Like",
      },
      comments:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Comment",
      }
      
    },{
      timestamps:true
    })



const blogModel = mongoose.model("Blog", blogsSchema);
module.exports.blogModel = blogModel;