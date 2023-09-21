import React, {useState,useEffect,useContext} from "react"
import { SocketContext } from "../../Context/SocketContext";
import { Link } from "react-router-dom";
import { request_url } from "../../constant/constants";
import axios from "axios"
import Shimmer from "../../Shimmer/Shimmer";
import { toast,ToastContainer, Zoom } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { toastPayload } from "../../Context/Assets";
import {GoogleMap, useLoadScript} from "@react-google-maps/api";
import {MAPS_KEY} from "../../Constants/keys.js";
import './BusDashboard.css'
import {MemoizedDirectionsRenderer, MemoizedDirectionsService} from "../SendLocation/SendLocation.jsx";

function Map({busRoute}) {

    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [directionsOptions, setDirectionsOptions] = useState();

    useEffect(()=>{
        if(!busRoute)
            return;
        const waypoints = [];
        busRoute.stations.map((station) => {
            waypoints.push({"location": `${station.position[0]} ${station.position[1]}`, "stopover": true});
        });

        const directionsOptions = {
            destination: waypoints[waypoints.length-1].location ,
            origin: waypoints[0].location,
            waypoints: waypoints,
            travelMode: 'DRIVING',
        };
        setDirectionsOptions(directionsOptions);
    },[busRoute])

    return(<>
        <GoogleMap zoom={10} center={{lat:0 ,lng:0}} mapContainerClassName="map-container">
            { directionsOptions && <MemoizedDirectionsService directionsOptions={directionsOptions} setDirectionsResponse={setDirectionsResponse}/>}
            {directionsResponse && <MemoizedDirectionsRenderer directions={directionsResponse}/>}
        </GoogleMap>
    </>);
}


function BusDashboard()
{
    const [name,setName]=useState("")
    const [contact,setContact]=useState("")
    const [busNumber,setBusNumber]=useState("")
    const [busNumberPlate,setBusNumberPlate]=useState("")
    const [busStatus,setBusStatus]=useState("")
    const [busRoute, setBusRoute]=useState();
    const [imageUrl,setImageUrl]=useState("")
    const [isLoading,setIsLoading]=useState(true)

    const busId=localStorage.getItem("id")
    // const {socket,busId,setBusId}=useContext(SocketContext)
    console.log(busId)

    const {hasLoaded} = (useLoadScript({
        googleMapsApiKey: MAPS_KEY
    }));

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
        setBusRoute(Data.route);
    }   

    useEffect(()=>{
    
      toast.success("Welcome to Dashboard", toastPayload);
       getDetails()
    },[])

    return (
        <div className={"absolute top-0 left-0 bg-white w-full h-full overflow-hidden"}>
            <div className=" z-50 fixed w-full top-0 left-0 bg-[#E80202] h-[60px] flex items-center justify-center space-x-80 text-white text-3xl">
                <Link to="/driver/dashboard"><span className={"font-bold"}>Home</span></Link>
                <Link to={`/driver/sendLocation/${busId}`}>Monitor Location</Link>
                <Link to={`/driver/setStatus/${busId}`}>Update Status</Link>
            </div>
            <div className={"h-[60px]"}></div>
            <div className="mt-5 w-full h-[calc(100%-60px)] z-50">
                {isLoading === true ?   <Shimmer></Shimmer>: (<div className="w-full h-full">
                <div className="pt-40 fixed left-0 top-0 h-full bg-[#A8151F] text-white w-[520px] flex flex-col pl-20">
                    <h1 className={"text-[22px]"}>Driver Name</h1>
                    <h1 className={"mt-[-10px] mb-[20px] font-bold text-[40px]"}>{name}</h1>
                    <h1 className={"text-[22px]"}>Bus Number</h1>
                    <h1 className={"mt-[-10px] mb-[20px] font-bold text-[40px]"}>{busNumber}</h1>
                    <h1 className={"text-[22px]"}>Registration Number</h1>
                    <h1 className={"mt-[-10px] mb-[20px] font-bold text-[40px]"}>{busNumberPlate}</h1>
                    <h1 className={"text-[22px]"}>Contact Number</h1>
                    <h1 className={"mt-[-10px] mb-[20px] font-bold text-[40px]"}>{contact}</h1>
                    <div className="flex  items-center">
                </div>
            </div>
            <div className={"w-full flex flex-row h-full"}>
                <div className={"w-[520px] h-full"}></div>
                <div className={"flex flex-col w-[calc(100%-520px)] items-center"}>
                    <h1 className={"w-full text-left pl-[20px] text-[30px] mt-[-15px] font-medium"}>Bus Documents:</h1>
                    <div className=" absolute flex left-[91%] text-[20px]"><span className={"mt-[-8px]"}>Status :</span> &nbsp; {busStatus === "active"?<h1 className="w-[20px] h-[20px] rounded-full bg-green-600"></h1>:<h1 className="w-[20px] h-[20px]rounded-full bg-red-600"></h1>}</div>
                    <div className="bg-gray-300 h-[220px] w-full flex flex-row items-center pl-4">
                        <div className="relative ">
                            <a href={imageUrl} target={"_blank"} className="absolute inset-0 z-10 bg-white text-center flex flex-col items-center justify-center opacity-0 hover:opacity-100 bg-opacity-90 duration-300">
                                <h1 className="tracking-wider font-bold">PUC</h1>
                                <p className="mx-auto">Pollution Papers</p>
                            </a>
                            <a href={imageUrl} className="relative">
                                <div className="h-48 flex flex-wrap content-center">
                                    <img src={imageUrl} className="mx-auto  h-[180px]" alt=""/>
                                </div>
                            </a>
                        </div>
                    </div>
                    <Map busRoute={busRoute} className=" mt-[20px] w-[90%] "/>
                </div>
            </div>
        </div>
        )}
        </div>
        <ToastContainer transition={Zoom}/>
        </div>
    )
}


export default BusDashboard;