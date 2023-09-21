const busSchema=require("../model/busModel.js")
const routeSchema = require("../model/routeModel.js")
const stationSchema = require("../model/stationModel.js");
const cloudinary=require("cloudinary")
const {cache} = require("../Cache/cache");

exports.register=async function(req,res)
{
    const {busNumber,busNumberPlate,name,contactInfo,password}=req.body
        try {
        let photoData={secure_url:"",photo_id:""}
        
        if(req.files)
        {
            const result=await cloudinary.v2.uploader.upload(req.files.photo.tempFilePath,{
                folder:"testPhoto"
            })
            photoData.secure_url=result.secure_url
            photoData.photo_id=result.public_id
        }

        if(!(busNumber && busNumberPlate && name && contactInfo && password ))
        {
            console.log("hello no guys")
            res.status(400).json({
                allFields:false,
                message:"All fields are not filled"
            })
        }
        else
        {
            const bus=await busSchema.findOne({busNumberPlate})
            if(bus)
            {
                res.status(200).json({
                    success:false
                })
            }
            else
            {
                let createdBus=await busSchema.create({busNumber,busNumberPlate,driver:{name,contactInfo,password},photo:photoData})

                createdBus.save({validateBeforeSave:false})
                console.log(createdBus)
                res.status(200).json({
                    success:true,
                    createdBus,
                })
            }
        }
    }
    catch(error)
    {
        console.log(error.message)
        //will see if response of error message has to be returned or not
        res.status(400).send("Schema's requirement not fulfilled")
    }  
}

exports.login=async function (req,res)
{
    //grabbing entered details from body
    
    const {busNumber,password}=req.body

    try
    {
        //checking if busDriver with given busNumber exists or not

        const bus=await busSchema.findOne({busNumber:busNumber})

        console.log(bus)
        //checking simulataneously if both busDriver exists and given password is correct
        if(bus &&  await bus.validatePassword(password))
        {
            res.status(200).json({
                login:true,
                message:"Login Successful",
                bus
            })
        }
        else
        {
            res.status(200).json({
                login:false,
                message:"Registration is required"
            })
        }
    }
    catch(error)
    {
        console.log(error.message)
    }
}


exports.activeBus=async function(req,res)
{
    const allActiveBuses=await busSchema.find({busStatus:"active"}).populate({
        path: 'route',
        populate: {
            path: 'stations',
            select: 'stationName position -_id'
        }
    });
    //console.log(allActiveBuses);
    if(allActiveBuses.length === 0)
        res.status(400).send("No Active Buses for now")
    else
    {
        console.log(typeof allActiveBuses);

        const buses = allActiveBuses.map((bus) => {
            if(cache.get(bus._id.toString()))
            {
                bus._doc.progress = cache.get(bus._id.toString());
                return bus;
            }
            return bus;
        });

        res.status(200).json({
            success:true,
            buses: buses
        })
    }
}

exports.updateBusDetails=async function(req,res){

    //getting id of that particular bus

    const {id}=req.params

    //finding the bus with the id
    const bus=await busSchema.findById(id)

    console.log(bus)

    if(!bus)
    {
        res.status(400).send("No bus found with such details")
    }
    else
    {
        console.log(req.body);
        //give data to update with
        const updatedBusDetails=await busSchema.findByIdAndUpdate(id,{$set: {...req.body}},{
            new:true
        })

       // console.log(updatedBusDetails)

        res.status(200).json({
            update:"successful",
            updatedBusDetails
        })
    }
}

exports.activeBusDetails=async function(req,res)
{
    const {id}=req.params
    
    //getting bus with the id
    const bus=await busSchema.findById(id).populate({
        path: 'route',
        select: 'routeName -_id',
        populate: {
            path: 'stations',
            select: 'stationName position -_id'
        }
    });

    bus._doc.progress = cache.get(bus._id.toString());
    res.status(200).json({
        bus
    })
}

exports.busRoutes = async function(req, res) {
    const allRoutes = await routeSchema.find().populate("stations");

    res.status(200).json({
        success: true,
        routes: allRoutes
    });
}