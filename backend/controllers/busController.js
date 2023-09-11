const busSchema=require("../model/busModel")

exports.busDetails=async function(req,res)
{
    const {busNumber,busNumberPlate,driver,startingPoint,destinationPoint,busStatus}=req.body

    if(!(busNumber && busNumberPlate && driver && startingPoint && destinationPoint && busStatus))
    res.status(400).send("All entries are compulsory")

    const bus=await busSchema.findOne({busNumberPlate})
    if(bus)
    {
        res.status(400).send("Bus Already Registered")
    }
    else
    {
        let createdBus=await busSchema.create({...req.body})
        console.log(createdBus)
        res.status(200).json({
            success:true,
            createdBus
        })
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