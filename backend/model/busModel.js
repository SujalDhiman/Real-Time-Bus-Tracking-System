const mongoose=require("mongoose")

const busSchema=new mongoose.Schema({
    busNumber:{
        type:String,
        required:[true,"Bus Number is Important"],
        unique:true
    },
    busNumberPlate:{
        type:String,
        required:[true,"Bus Number plate is required"],
        unique:true
    },
    driver:{
        name:String,
        contactInfo:String,
        age:String
    },
    startingPoint:{
        type:String,
    },
    destinationPoint:{
        type:String
    },
    busStatus:{
        type:String,
        enum:["active","notActive"]
    }
},{timestamps:true})

module.exports=mongoose.model("Bus",busSchema)