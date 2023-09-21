import {useState} from "react"
import { toast,ToastContainer, Zoom } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { request_url } from "../constant/constants";
import axios from "axios"
import { toastPayload } from "../Context/Assets";
import { useParams } from "react-router-dom";
import {ActiveRatingSVG,InactiveRatingSVG} from "../Context/Assets"

function Feedback()
{
    const {id}=useParams()
    const [comments,setComments]=useState("")  
    const [index,setIndex]=useState(0)
    async function submitFeedBack()
    {
            let payload={
                busNumber:id,
                ratings:index,
                comments
            }
            console.log(payload)
            const response=await axios.post(request_url+"/giveFeedback",payload)
            toast.success("Fedback was submitted!", toastPayload);
            console.log(response)
    } 

    return (
        <div className="w-[100vw] h-[100vh] bg-[#B8EFFE] flex justify-center items-center font-comic-neue">
            <div className="w-[60vw] h-[80vh] bg-white flex flex-col rounded-[30px] shadow-custom">
            <div className="flex flex-col items-center">
                <h1 className="text-[35px] mt-7">Your Feedback</h1>
                <hr className="h-[2px] w-[55vw] bg-[#969696] mt-3"/>
                <h1 className="text-[25px] mt-7">Rate your ride</h1>
            <div className="flex mt-3">
                {
                    Array(5).fill("").map((ele,idx)=>
                    {
                        if(idx+1 <= index)
                        return <h1 key={idx} className="cursor-pointer" onClick={()=>setIndex(idx+1)}><ActiveRatingSVG/></h1>
                        else
                        return <h1 key={idx} className="cursor-pointer" onClick={()=>setIndex(idx+1)}><InactiveRatingSVG/></h1>
                    })
                }
            </div>
            <hr className="h-[2px] w-[55vw] bg-[#969696] mt-7"/>
            </div>
            <div className="ml-10 mt-5">
            <h1 className="text-[20px]">Additional comments</h1>
            <div className="mt-1">
                <textarea type="text" value={comments} onChange={(e)=>setComments(e.target.value)} placeholder="Type Message..." className="bg-[#D9D9D9] px-3 py-2 w-[54.5vw] h-[20vh] resize-none rounded-xl focus:outline-none border-black border-2 text-[18px]"/>
            </div>
            <button onClick={submitFeedBack} className="bg-[#E93F4B] text-white items-center w-[54.5vw] h-[8vh] mt-3 text-[25px] rounded-xl">
                Submit
            </button>
            </div>
            <ToastContainer />
            </div>
        </div>
    )
}

export default Feedback