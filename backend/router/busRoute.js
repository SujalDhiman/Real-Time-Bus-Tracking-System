const express=require("express")
const router=express.Router()

const {register,login,activeBus,updateBusDetails,activeBusDetails, busRoutes}=require("../controllers/busController")


router.route("/register").post(register)
router.route("/login").post(login)

router.route("/activeBus").get(activeBus)
router.route("/activeBus/:id").get(activeBusDetails)

//Not working with patch or put
router.route("/bus/:id").put(updateBusDetails)
router.route("/busRoutes").get(busRoutes);


module.exports=router