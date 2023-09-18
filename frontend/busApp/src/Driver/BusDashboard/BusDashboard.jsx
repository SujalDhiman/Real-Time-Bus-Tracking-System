import {useState,useEffect,useContext} from "react"
import { SocketContext } from "../../Context/SocketContext";
import { Link } from "react-router-dom";
import { request_url } from "../../constant/constants";
import axios from "axios"
import Shimmer from "../../Shimmer/Shimmer";
import { toast,ToastContainer, Zoom } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { toastPayload } from "../../Context/Assets";

function BusDashboard()
{
    const [name,setName]=useState("")
    const [contact,setContact]=useState("")
    const [busNumber,setBusNumber]=useState("")
    const [busNumberPlate,setBusNumberPlate]=useState("")
    const [busStatus,setBusStatus]=useState("")
    const [imageUrl,setImageUrl]=useState("")
    const [isLoading,setIsLoading]=useState(true)
    const busId=localStorage.getItem("id")
    // const {socket,busId,setBusId}=useContext(SocketContext)
    console.log(busId)

    async function getDetails()
    {
        const response=await axios.get(request_url+`activeBus/${busId}`)
        const Data=response.data.bus
        console.log(response)
        setName(Data.driver.name)
        setContact(Data.driver.contactInfo)
        setBusNumber(Data.busNumber)
        setBusNumberPlate(Data.busNumberPlate)
        setBusStatus(Data.busStatus)
        setIsLoading(false)
        setImageUrl(response.data.bus.photo.secure_url)
    }   

    useEffect(()=>{
    
      toast.success("Welcome to Dashboard", toastPayload);
       getDetails()
    },[])

    return (
        <>
        <div className="mt-20 flex items-center justify-center space-x-20 text-white text-3xl">
            <Link to="/driver/dashboard">Home</Link>
            <Link to={`/driver/sendLocation/${busId}`}>Monitor Location</Link>
            <Link to={`/driver/setStatus/${busId}`}>Update Status</Link>
        </div>
        <div className="mt-5 flex justify-center items-center">   
        {isLoading === true ?   <Shimmer></Shimmer>: (<div className="flex justify-center items-center space-x-5">
            <div className="bg-gray-800 text-white w-[400px] h-[200px] flex flex-col items-center space-y-3">
                <h1>Driver Name :- {name}</h1>
                <h1>Bus Number  :- {busNumber}</h1>
                <h1>Registration Number :- {busNumberPlate}</h1>
                <h1>Contact Number :- {contact}</h1>
                <div className="flex  items-center">
                <h1>Bus Status :- &nbsp;</h1>
                {busStatus === "notactive" ? <div className="w-5 h-5 animate-pulse bg-red-600 rounded-full"></div>:<div className="w-5 h-5 animate-pulse bg-green-600 rounded-full"></div>}
                </div>
            </div>
            <div className="w-[300px] h-[300px] bg-white">
                <img src={imageUrl} alt="photo"/>
            </div>
            </div>
        )}
        </div>
        <ToastContainer transition={Zoom}/>
        </>
    )
}


export default BusDashboard;