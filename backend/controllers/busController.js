const busSchema=require("../model/busModel.js")

exports.register=async function(req,res)
{
    const {busNumber,busNumberPlate,driver}=req.body
    try
    {
        if(!(busNumber && busNumberPlate && driver ))
        {
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
                res.status(400).send("Bus Already Registered")
            }
            else
            {
                let createdBus=await busSchema.create({...req.body})

                createdBus.save({validateBeforeSave:false})
                console.log(createdBus)
                res.status(200).json({
                    success:true,
                    createdBus
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
    const allActiveBuses=await busSchema.find({busStatus:"active"})

    if(allActiveBuses.length === 0)
        res.status(400).send("No Active Buses for now")
    else
    {
        res.status(200).json({
            success:true,
            buses:allActiveBuses
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
        //give data to update with
        const updatedBusDetails=await busSchema.findByIdAndUpdate(id,{...req.body})

        console.log(updatedBusDetails)

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
    const bus=await busSchema.findById(id);

    res.status(200).json({
        bus
    })
}