const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = require("mongoose");


const userSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      profilePic:{
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
        type:string,
        possibleValues: ["Read", "Writing", "Both"],
        default: "Both",
        required:"true"
      },
      prefferedGenre:{
        //edit this
        type:string
      },
      blogs:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Blog"
      },
      following:{
        type: mongoose.Schema.Types.ObjectId,
            ref:"following",
            required:true,
      },
      followers:{
        type: mongoose.Schema.Types.ObjectId,
            ref:"followers",
            required:true,
      }
    },{ timestamps: true }
)

userSchema.pre("save", async function (next) {
    if (this.isModified("password") || this.isNew) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const userModel = mongoose.model("User", userSchema);
exports.UserModel = userModel;