import {useState} from "react"
import { toast,ToastContainer, Zoom } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { request_url } from "../constant/constants";
import axios from "axios"
import { toastPayload } from "../Context/Assets";
import { useParams } from "react-router-dom";

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
        <div>
            <div className="flex">
                {
                    Array(5).fill("").map((ele,idx)=>
                    {
                        if(idx+1 <= index)
                        return <h1 key={idx} className="cursor-pointer" onClick={()=>setIndex(idx+1)}>😎</h1>
                        else
                        return <h1 key={idx} className="cursor-pointer" onClick={()=>setIndex(idx+1)}>😊</h1>
                    })
                }
            </div>
            <div>
                <textarea type="text" value={comments} onChange={(e)=>setComments(e.target.value)} placeholder="Enter Comments"/>
            </div>
            <button onClick={submitFeedBack}>
                Submit
            </button>
            <ToastContainer />
        </div>
    )
}

export default Feedback