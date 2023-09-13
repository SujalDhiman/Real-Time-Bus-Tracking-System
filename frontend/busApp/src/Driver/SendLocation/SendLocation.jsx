import {useState, useEffect, useContext, useDeferredValue} from "react"
import {GoogleMap,MarkerF,useLoadScript} from "@react-google-maps/api"
import "./SendLocation.css"
import { SocketContext } from "../../Context/SocketContext"
import { useParams } from "react-router-dom"



function Map()
{
    const socket =useContext(SocketContext)

    const [latitude,setLatitude]=useState(0);
    const [longitude,setLongitude]=useState(0);

    //To prevent react batch rendering problems
    const differedLatitude = useDeferredValue(latitude);
    const differedLongitude = useDeferredValue(longitude);

    const {id}=useParams()

    useEffect(()=>{

        const options = {
            enableHighAccuracy: true,
            maximumAge: 0,
        };

        const error = (err) => {
            console.error(`ERROR(${err.code}): ${err.message}`);
        }

        navigator.geolocation.watchPosition((position)=>{
            console.log(position.coords);
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
        }, error, options);

    },)

    useEffect(() => {
        //Only emitting when there is a change in position
        socket.emit(`busId`,{latitude: differedLatitude, longitude: differedLongitude,id})
        console.log(differedLatitude, differedLongitude);
    }, [differedLatitude, differedLongitude])

    return (
        <>
        <div><h1 className="text-white">latitude :{differedLatitude}  longitude : {differedLongitude} </h1></div>
            <GoogleMap zoom={10} center={{lat:differedLatitude,lng:differedLongitude}} mapContainerClassName="map-container">
                <MarkerF position={{lat:differedLatitude,lng:differedLongitude}} />
            </GoogleMap>
        </>
    )
}


function SendLocation()
{
    const {isLoaded}=useLoadScript({
        googleMapsApiKey:"AIzaSyAQ3BL9108_P__WzVDfJ7DnUg30WMLQu2A"
    })

    if(!isLoaded) return <h1 className="text-white">wait plz</h1>
    else
    return (
    <>
        <div>
            {/* <TrackVechicle/> */}
        </div>
        <Map className="mt-10"/>
    </>
    )
}

export default SendLocation




