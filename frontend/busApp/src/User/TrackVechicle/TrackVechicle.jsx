import React, { useState,useEffect,useContext } from "react"
import axios from "axios"
import {Link,useParams} from "react-router-dom"
import {
    DirectionsRenderer,
    DirectionsService,
    GoogleMap,
    MarkerF,
    TrafficLayer,
    useLoadScript
} from "@react-google-maps/api"
import { SocketContext } from "../../Context/SocketContext"
import "./TrackVechicle.css"
import {MAPS_KEY} from "../../Constants/keys.js";
import {axiosConfig, SERVER_URL} from "../../Constants/config.js";


const MemoizedDirectionsRenderer = React.memo(({ directions }) => (
    <DirectionsRenderer options={{ directions: directions }} />
));


const MemoizedDirectionsService = React.memo(({ directionsOptions, setDirectionsResponse }) => (
    <DirectionsService options={directionsOptions} callback={(response) => {
        if (response !== null) {
            if (response.status === 'OK') {
                setDirectionsResponse(response);
            } else {
                console.log('response: ', response)
            }
        }
    }}/>
));


function Map()
{
    const socket = useContext(SocketContext).socket;
    const {id}=useParams()
    const [latitude,setLatitude]=useState(0)
    const [longitude,setLongitude]=useState(0)

    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [directionsOptions, setDirectionsOptions] = useState();
    const [progress, setProgress] = useState();

    useEffect(() => {
        socket.on(`busLocation-${id}`,(payload)=>{
            console.log(payload)
            setLatitude(payload.latitude)
            setLongitude(payload.longitude)
            setProgress(payload.progress)}
        )
    }, [])

    useEffect(()=> {
        (async () => {
            const route = await axios.get(`${SERVER_URL}/api/v1/activeBus/${id}`, axiosConfig);
            const waypoints = [];
            route.data.bus.route.stations.map((station) => {
                waypoints.push({"location": `${station.position[0]} ${station.position[1]}`, "stopover": true});
            });


            const directionsOptions = {
                destination: waypoints[waypoints.length-1].location ,
                origin: waypoints[0].location,
                waypoints: waypoints,
                travelMode: 'DRIVING',
            };
            setDirectionsOptions(directionsOptions);
        })();
    },[])


    return (
        <>
        <div><h1 className="text-white">latitude :{latitude}  longitude : {longitude} </h1></div>
            <GoogleMap zoom={10} center={{lat:latitude,lng:longitude}} mapContainerClassName="map-container">
                { directionsOptions && <MemoizedDirectionsService directionsOptions={directionsOptions} setDirectionsResponse={setDirectionsResponse}/>}
                {directionsResponse && <>
                    <TrafficLayer/>
                    <MemoizedDirectionsRenderer directions={directionsResponse }/>
                </>}
                <MarkerF position={{lat:latitude,lng:longitude}} />
            </GoogleMap>
            <ul>
                {progress && progress.map((p) => {return (<li className={p.reached?"text-white":"text-red-700"}>{`* - ${p.distance} ${p.eta}`}</li>)})}
            </ul>
        </>
    )
}



function Card({busNumber,busNumberPlate,contactInfo,route,age,name,busStatus})
{

    return (
        <>
        <div className="rounded-lg bg-slate-700 w-[400px] text-white">
            <h1>Bus Number :- {busNumber}</h1>
            <h1>Bus Number Plate :- {busNumberPlate}</h1>
            <h1>Driver Name :- {name}</h1>
            <h2>Driver Contact Information :- {contactInfo}</h2>
            <h2>Route :- 0--{(()=>{
                return route.stations.map((station) => <><span>{`${station.stationName}`}</span>--</>)
            })()}0</h2>
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
        getActiveBusDetails()
    },[])

    if(!isLoaded)
        return <h1>Loading...</h1>
    else
    {
        return (
            <>
            <div className="space-y-16">
            {isLoading?<h1> Loading... </h1>:<Card busNumber={dataReceived.busNumber} busNumberPlate={dataReceived.busNumberPlate} contactInfo={dataReceived.driver.contactInfo} route={dataReceived.route} age={dataReceived.driver.age} name={dataReceived.driver.name} busStatus={dataReceived.busStatus} key={dataReceived._id} objectId={dataReceived._id}/>}
            </div>
            <Map />
            </>
        )
    }
}