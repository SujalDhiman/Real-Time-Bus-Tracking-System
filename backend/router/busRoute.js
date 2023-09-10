const express=require("express")
const router=express.Router()

const {busDetails,activeBus,updateBusDetails}=require("../controllers/busController")


router.route("/details").post(busDetails)
router.route("/activeBus").get(activeBus)
router.route("/bus/:id").patch(updateBusDetails)

module.exports=router