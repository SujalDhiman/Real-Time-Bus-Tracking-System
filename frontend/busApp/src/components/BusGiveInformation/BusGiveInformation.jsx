import { useState,useEffect, useContext } from "react"
import {GoogleMap,MarkerF,useLoadScript} from "@react-google-maps/api"
import { Properdetails } from "../Properdetails/Properdetails"
import "./BusGiveInformation.css"
import { SocketContext } from "../../Context/SocketContext"
import { useParams } from "react-router-dom"



function Map()
{
    const socket =useContext(SocketContext)

    const [latitude,setLatitide]=useState(30.35315)
    const [longitude,setLongitude]=useState(78.01751)

    const {id}=useParams()

    useEffect(()=>{
        window.navigator.geolocation.watchPosition((position)=>{
            setLatitide(position.coords.latitude)
            setLongitude(position.coords.longitude)
        })

        socket.emit(`busId`,{latitude,longitude,id})

    },[latitude,longitude])

    return (
        <>
        <div><h1 className="text-white">latitude :{latitude}  longitude : {longitude} </h1></div>
            <GoogleMap zoom={10} center={{lat:latitude,lng:longitude}} mapContainerClassName="map-container">
                <MarkerF position={{lat:latitude,lng:longitude}} />
            </GoogleMap>
        </>
    )
}


function BusGiveInformation()
{
    const {isLoaded}=useLoadScript({
        googleMapsApiKey:"AIzaSyAnHMHMgI2JsOrNrmDO2VYNR6Dyw7qcpik"
    })

    if(!isLoaded) return <h1 className="text-white">wait plz</h1>
    else
    return (
    <>
        <div>
            {/* <Properdetails/> */}
        </div>
        <Map className="mt-10"/>
    </>
    )
}

export default BusGiveInformation




