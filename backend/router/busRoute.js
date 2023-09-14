const express=require("express")
const router=express.Router()

const {register,login,activeBus,updateBusDetails,activeBusDetails}=require("../controllers/busController")


router.route("/register").post(register)
router.route("/login").post(login)

router.route("/activeBus").get(activeBus)
router.route("/activeBus/:id").get(activeBusDetails)
router.route("/bus/:id").patch(updateBusDetails)

module.exports=router