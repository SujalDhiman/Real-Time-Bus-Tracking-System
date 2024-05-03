import express from "express"

import { upload } from "../middlewares/multer.middleware.js"
import {register,login,activeBus,updateBusDetails,activeBusDetails, busRoutes,getFeedBack,allFeedBack,searchFeedBack} from "../controllers/busController.js"


const router=express.Router()

//route for register driver
router.route("/register").post(upload.fields([{
    name:"image1"
}]),register)

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


export default router