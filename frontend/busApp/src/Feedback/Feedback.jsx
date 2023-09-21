import {useState} from "react"
import { toast,ToastContainer, Zoom } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { request_url } from "../constant/constants";
import axios from "axios"
import { toastPayload } from "../Context/Assets";

function Feedback()
{
    const [feedbackData,setFeedbackData]=useState({
        busNumber:"",
        ratings:0,
        comments:""
    })  

    async function submitFeedBack()
    {
        if(feedbackData.busNumber === "" || feedbackData.ratings === 0 || feedbackData.comments === "")
        {
            toast.error("Fill All Fields Properly",toastPayload)
        }
        else
        {
            if(feedbackData.ratings > 5 || feedbackData.ratings < 0)
            {
                toast.error("Rating should be between 0 and 5",toastPayload)
            }
            else
            {
            const response=await axios.post(request_url+"/giveFeedback",feedbackData)
            console.log(response)
            }
        }
    } 

    return (
        <div>
            <div>
                <input type="text" value={feedbackData.busNumber} onChange={(e)=>setFeedbackData({...feedbackData,busNumber:e.target.value})} placeholder="Enter Bus Number"/>
            </div>
            <div>
                <input type="number" value={feedbackData.ratings} onChange={(e)=>setFeedbackData({...feedbackData,ratings:e.target.value})} placeholder="Enter Rating" />
            </div>
            <div>
                <textarea type="text" value={feedbackData.comments} onChange={(e)=>setFeedbackData({...feedbackData,comments:e.target.value})} placeholder="Enter Comments"/>
            </div>
            <button onClick={submitFeedBack}>
                Submit
            </button>
            <ToastContainer />
        </div>
    )
}

export default Feedback