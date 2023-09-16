import { useState,useEffect,useContext } from "react"
import axios from "axios"
import {Link,useParams} from "react-router-dom"
import {GoogleMap,MarkerF,useLoadScript} from "@react-google-maps/api"
import { SocketContext } from "../../Context/SocketContext"
import "./TrackVechicle.css"
import {MAPS_KEY} from "../../Constants/keys.js";
import {axiosConfig, SERVER_URL} from "../../Constants/config.js";


function Map()
{
    const socket = useContext(SocketContext).socket;
    const {id}=useParams()
    const [latitude,setLatitude]=useState(0)
    const [longitude,setLongitude]=useState(0)

    useEffect(()=> {

        socket.on(`busLocation-${id}`,(payload)=>{
            console.log(payload)
            setLatitude(payload.latitude)
            setLongitude(payload.longitude)
        })

    },[])




    return (
        <>
        <div><h1 className="text-white">latitude :{latitude}  longitude : {longitude} </h1></div>
            <GoogleMap zoom={10} center={{lat:latitude,lng:longitude}} mapContainerClassName="map-container">
                <MarkerF position={{lat:latitude,lng:longitude}} />
            </GoogleMap>
        </>
    )
}



function Card({busNumber,busNumberPlate,contactInfo,startingLocation,destinationLocation,age,name,busStatus})
{

    return (
        <>
        <div className="rounded-lg bg-slate-700 w-[400px] text-white">
            <h1>Bus Number :- {busNumber}</h1>
            <h1>Bus Number Plate :- {busNumberPlate}</h1>
            <h1>Driver Uncle :- {name}</h1>
            <h2>Driver Contact Information :- {contactInfo}</h2>
            <h2>Driver Age :- {age}</h2>
            <h2>Starting Location :- {startingLocation}</h2>
            <h2>Destination Location :- {destinationLocation}</h2>
            <div className="flex">Bus Status :- &nbsp; {busStatus === "active"?<h1 className="w-[20px] h-[20px] rounded-full bg-green-600"></h1>:<h1 className="w-[20px] h-[20px]rounded-full bg-red-600"></h1>}</div>
        </div>
        </>
    )
}

export function TrackVechicle()
{

    const {isLoaded}=useLoadScript({
        googleMapsApiKey: MAPS_KEY
    })

    const socket =useContext(SocketContext).socket;

    const {id}=useParams()
    const [dataReceived,setDataReceived]=useState({})
    const [isLoading,setLoading]=useState(true)
    async function getActiveBusDetails()
    {
        const response=await axios.get(`${SERVER_URL}/api/v1/activeBus/${id}`, axiosConfig)
        console.log(response.data.bus)
        // console.log(response.data.buses)
        setDataReceived(response.data.bus)
        setLoading(false)
    }
    useEffect(()=>{
        console.log(`busLocation-${id}`)
        socket.on(`busLocation-${id}`,(payload)=>{
            //console.log(payload)
        })
        getActiveBusDetails()
    },[])

    if(!isLoaded) return <h1>Ruko Yaar</h1>
    else
    {
    return (
        <>
        <div className="space-y-16">
        {isLoading?<h1> Ruko Bhaiyo </h1>:<Card busNumber={dataReceived.busNumber} busNumberPlate={dataReceived.busNumberPlate} contactInfo={dataReceived.driver.contactInfo} startingLocation={"sp"} destinationLocation={"dp"} age={dataReceived.driver.age} name={dataReceived.driver.name} busStatus={dataReceived.busStatus} key={dataReceived._id} objectId={dataReceived._id}/>}
        </div>
        <Map />
        </>
    )
    }
}