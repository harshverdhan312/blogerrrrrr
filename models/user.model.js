const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = require("mongoose");
const jwt = require("jsonwebtoken")

const userSchema = new Schema(
    {
      fullName: {
        type: String,
        required: true,
      },
      avatar:{
        type:String,
        required:true
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      username: {
        type: String,
        required: true,
        unique: true,
      },
      password:{
        type:String,
        required:true
      },
      dob:{
        type:Date,
        required:true
      },
      purpose:{
        type:String,
        possibleValues: ["Read", "Writing", "Both"],
        default: "Both",
        required:"true"
      },
      prefferedGenre:{
        //edit this
        type:String
      },
      blogs:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Blog"
      },
      following:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"following",
      },
      followers:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"followers",
      },
      refreshTokens:{
        type:String
      }
    },{ timestamps: true }
)

userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password)
}

userSchema.pre("save", async function (next) {
    if (this.isModified("password") || this.isNew) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});
userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
      _id : this.id,
      _username : this.username,
      _email : this.email,
      _fullname : this.name
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}
userSchema.methods.generateRefreshToken = function(){
  return jwt.sign({
    _id : this.id,
    
  },
  process.env.REFRESH_TOKEN_SECRET,
  {
    expiresIn : process.env.REFRESH_TOKEN_EXPIRY
  }
)
}


const userModel = mongoose.model("User", userSchema);
module.exports.userModel = userModel;