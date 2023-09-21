const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const {Router} = require("express");


const busSchema=new mongoose.Schema({
    busNumber:{
        type:String,
        unique:[true,"Bus Number Already Registered Try Other Number"]
    },
    busNumberPlate:{
        type:String,
        unique:[true,"Bus Number Plate Already Registered"]
    },
    driver:{
        name:{
            type:String,
        },
        contactInfo:{
            type:String,
        },
        password:{
            type:String,
            unique:[true,"Password Already Taken"],
            minlength:[6,"Password Should Contain Atleast 6 Characters"]
        }
    },
    avgRating:{
        type:Number,
        default:0
    },
    route: {
        ref: "Route",
        type: mongoose.Schema.Types.ObjectId
    },
    busStatus:{
        type:String,
        enum:["active","notactive"],
        default:"notactive"
    },
    photo:{
        secure_url:String,
        photo_id:String
    }
},{timestamps:true})

busSchema.methods.validatePassword=async function (gotPassword){
    try
    {
        return await bcrypt.compare(gotPassword,this.driver.password)
    }
    catch(error)
    {
        console.log("error in validating password")
    }
}


busSchema.pre("save",async function (next){
    if(!this.isModified("driver.password"))
        return next();
    this.driver.password=await bcrypt.hash(this.driver.password,8);
})

module.exports=mongoose.model("Bus",busSchema)