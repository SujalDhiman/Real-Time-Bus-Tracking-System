const express=require("express")
const router=express.Router()

const {register,login,activeBus,updateBusDetails,activeBusDetails, busRoutes,getFeedBack,allFeedBack,searchFeedBack}=require("../controllers/busController")

//route for register driver
router.route("/register").post(register)

//route for login driver
router.route("/login").post(login)

//route for seeing list of active bus
router.route("/activeBus").get(activeBus)

//route for seeing detail of particular active bus
router.route("/activeBus/:id").get(activeBusDetails)

//route for updating details of the particular bus
router.route("/bus/:id").post(updateBusDetails)

//route for getting info about bus routes
router.route("/busRoutes").get(busRoutes);

//route for getting feedbacks
router.route("/giveFeedback").post(getFeedBack)

//route for getting all feedbacks
router.route("/getFeedbacks").get(allFeedBack)

//route for getting feedback of a particular bus
router.route("/specificFeedback").post(searchFeedBack)


module.exports=router