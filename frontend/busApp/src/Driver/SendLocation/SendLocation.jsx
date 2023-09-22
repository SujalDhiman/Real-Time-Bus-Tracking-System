import {useState, useEffect, useContext, useDeferredValue, useRef} from "react"
import React from 'react';
import {
    DirectionsRenderer, DirectionsService, DistanceMatrixService,
    GoogleMap,
    MarkerF,
    TrafficLayer,
    useLoadScript
} from "@react-google-maps/api"
import "./SendLocation.css"
import { SocketContext } from "../../Context/SocketContext"
import {Link, useNavigate, useParams } from "react-router-dom"
import {MAPS_KEY} from "../../Constants/keys.js";
import axios from "axios";
import {axiosConfig, SERVER_URL} from "../../Constants/config.js";
import plus from "../../assets/plus.png"
import minus from "../../assets/minus.png"

export const MemoizedDirectionsRenderer = React.memo(({ directions }) => (
    <DirectionsRenderer options={{ directions: directions }} />
));

export const MemoizedDirectionsService = React.memo(({ directionsOptions, setDirectionsResponse }) => (
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

const MemorizedDistanceService = React.memo(({ pos, distanceOptions, setDistanceResponse }) => (
    <DistanceMatrixService options={distanceOptions} callback={(response) => {
        console.log("hi");
        setDistanceResponse(response.rows[0].elements);
    }}/>
));

export function Map()
{
    const {socket} =useContext(SocketContext)

    let navigate=useNavigate()

    const [latitude,setLatitude]=useState(0);
    const [longitude,setLongitude]=useState(0);
    const [busRoute, setBusRoute]=useState();

    const [passengerCount,setPassengerCount]=useState(0)
    //To prevent react batch rendering problems
    const differedLatitude = useDeferredValue(latitude);
    const differedLongitude = useDeferredValue(longitude);

    const [waypoints, setWaypoints] = useState();
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [directionsOptions, setDirectionsOptions] = useState();
    const [distanceOptions, setDistanceOptions] = useState();
    const [stopGPS,setStopGPS]=useState(0)

    //ETA
    const [distanceResponse, setDistanceResponse] = useState();
    const [progress, setProgress] = useState();

    //State Variables For Toggle Buttons
    const [toggle,setToggle]=useState("pause")

    const {id}=useParams()

    useEffect(()=>{

        const options = {
            enableHighAccuracy: true,
            maximumAge: 0,
        };

        const error = (err) => {
            console.error(`ERROR(${err.code}): ${err.message}`);
        }

        let navID=navigator.geolocation.watchPosition((position)=>{
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
        }, error, options);
        setStopGPS(navID)

        //cleanup function when component unmounts
        return ()=>{
            if(navID)
                navigator.geolocation.clearWatch(navID)
        }

    },[latitude,longitude])

    useEffect(() => {
        axios.get(`${SERVER_URL}/api/v1/activeBus/${id}`, axiosConfig).then(
            (route) => {
                setBusRoute(route);
            }
        )
        console.log("here");
        if(sessionStorage.getItem("progress") !== null && sessionStorage.getItem("progress") !== "undefined") {
            setProgress(JSON.parse(sessionStorage.getItem("progress")));
        }
    }, [])

    useEffect(() => {
        if(!busRoute)
            return;

        const waypoints = [];
        busRoute.data.bus.route.stations.map((station) => {
            waypoints.push({"location": `${station.position[0]} ${station.position[1]}`, "stopover": true});
        });
        //console.log(waypoints);
        setWaypoints(waypoints);

        const directionsOptions = {
            destination: waypoints[waypoints.length-1].location ,
            origin: waypoints[0].location,
            waypoints: waypoints,
            travelMode: 'DRIVING',
        };
        setDirectionsOptions(directionsOptions);

        const distanceOptions = {
            origins: [`${latitude} ${longitude}`],
            //origins: [`30.2828877 78.0746451`],
            destinations: waypoints.map((waypoint) => {return waypoint.location}),
            travelMode: 'DRIVING',
            unitSystem: 0.0,
            avoidHighways: false,
            avoidTolls: false,
        }

        setDistanceOptions(distanceOptions);
    },[busRoute])

    useEffect(() => {
        //Only emitting when there is a change in position
        socket.emit(`busId`,{latitude: differedLatitude, longitude: differedLongitude, progress: progress, id})
        console.log(differedLatitude, differedLongitude, progress);

        if(distanceOptions)
            setDistanceOptions((distanceOptions) => {distanceOptions.origins = [`${latitude} ${longitude}`]
                return distanceOptions;
            });
    }, [differedLatitude, differedLongitude])

    useEffect(() => {
        if(!distanceResponse || !distanceResponse[0].distance || !distanceResponse[0].duration)
            return;
        const updateProgress = [];

        let info = Object.keys(distanceResponse);

        info.forEach((info) => {
            updateProgress.push({
                distance: distanceResponse[info].distance.text,
                eta: distanceResponse[info].duration.text,
                reached: (progress && progress[info].reached) || distanceResponse[info].distance.value < 1000?true:false
            });
        })
        //console.log(progress);

        if(updateProgress.every((entry) => {entry.reached}))
            setProgress(undefined);
        else
            setProgress(updateProgress);

        sessionStorage.setItem("progress",JSON.stringify( progress));
    }, [distanceResponse])

    //function to pause  and resume GPS
    function monitorStatus(e)
    {
        console.log(e.target.id)
        if(e.target.id === "pause")
        {
            navigator.geolocation.clearWatch(stopGPS)
            setStopGPS(0)
            setToggle("resume")
        }
        else if (e.target.id === "resume")
        {
            setLatitude(0)
            setLongitude(0)
            setToggle("pause")
        }
        else
        {
            navigate("/driver/dashboard")
        }
    }

    //function to update passenger count
    function updateCount(e)
    {
        console.log("inc-dec")
        if(e.target.id === "inc")
        {
            if(passengerCount <=59)
                setPassengerCount(passengerCount+1)
            else
                setPassengerCount(passengerCount)
        }
        else
        {
            if(passengerCount>=1)
                setPassengerCount(passengerCount-1)
            else
                setPassengerCount(passengerCount)
        }
    }

    function sendPassengerCount()
    {
        socket.emit("count",{countPassenger:passengerCount})
    }

    return (
        <>
        <div className="top-0 left-0 bg-[#E80202] h-[60px] flex items-center justify-center space-x-80 text-white text-3xl">
                <span class=""><Link to="../driver/dashboard">Home</Link></span>
                <span class="font-bold"><Link to={`../driver/sendLocation/${id}`}>Monitor Location</Link></span>
                <span class=""><Link to={`../driver/setStatus/${id}`}>Update Status</Link></span>
            </div>
            <GoogleMap zoom={10} center={{lat:differedLatitude,lng:differedLongitude}} mapContainerClassName="map-container">
                { directionsOptions && <MemoizedDirectionsService directionsOptions={directionsOptions} setDirectionsResponse={setDirectionsResponse}/>}
                {directionsResponse && <>
                    <TrafficLayer/>
                    <MemoizedDirectionsRenderer directions={directionsResponse}/>

                </>}
                { distanceOptions && <MemorizedDistanceService pos={distanceOptions.origins[0]} distanceOptions={distanceOptions} setDistanceResponse={setDistanceResponse}/>}
                <MarkerF position={{lat:differedLatitude,lng:differedLongitude}} />
            </GoogleMap>
            {/* <ul className={"absolute left-[4%] font-lexend top-[65%] border-l-[6px] border-red-600 flex flex-col gap-[15px]"}>
                {progress && progress.map((p) => {return (<li className={"ml-[-11px] flex flex-row items-center gap-2"}><div className={p.reached?"w-4 h-4 bg-[#38B3F9] rounded-full":"w-4 h-4 bg-red-600 rounded-full"}></div><p className={p.reached?"text-[#38B3F9]":"text-red-700"}>{`${p.distance} ${p.eta}`}</p></li>)})}
            </ul> */}
            <div className="flex mt-7 justify-center">
            <div className=" w-[50vw] flex flex-col items-center space-y-2">
                <h1>Available seats</h1>
                <div className="rounded-[20px] border-[1px] shadow-custom bg-[#CEF4FE] w-[12vw] h-[8vh] flex items-center justify-center text-[25px]">
                {passengerCount}/60
                </div>
                <div className="flex space-x-[5vw]">
                <button className="px-4 py-2"><img id="inc"  onClick={updateCount} src={plus} height="50px" width="50px"></img></button>
                <button className="ml-4 px-4 py-2"><img id="dec" onClick={updateCount} src={minus} height="50px" width="50px"></img></button>
                </div>
                <button onClick={sendPassengerCount} className="text-white px-4 py-2 bg-[#FF0000] rounded-full shadow-custom">Update Details
                </button>
            </div>
            <div className="h-[30vh] w-[40vw] flex flex-col items-center space-y-[10vh] border-[1px] border-black shadow-custom rounded-[20px]">
                <h1 className="text-[20px] mt-3">Location Sharing</h1>
                <div className="flex space-x-[25vw] items-center">
                <button className={`h-20 w-20 focus:outline-none relative overflow-hidden transform transition-transform duration-100 hover:-translate-y-0.5 active:translate-y-0.5 active:scale-95 shadow-custom3 ${toggle === 'pause'? ' text-white font-bold': 'text-white font-bold'}  ${toggle === 'pause'? 'rounded-full bg-yellow-500': ' rounded-full bg-green-700'}`}  onClick={monitorStatus}  id={toggle}>
                    {toggle.toUpperCase()}
                    {/* <div className="absolute inset-0 flex items-center justify-center bg-opacity-0 bg-white hover:bg-opacity-30 transition-opacity duration-100 opacity-0 active:opacity-100"> */}

                </button>
                
                <button
                className="w-20 h-20 bg-red-700 border-2 border-red-700 rounded-full text-white focus:outline-none relative overflow-hidden transform transition-transform duration-100 hover:-translate-y-0.5 active:translate-y-0.5 active:bg-red-700 active:scale-95 shadow-custom3" onClick={monitorStatus} id="stop">STOP
                <div className="absolute inset-0 flex items-center justify-center bg-opacity-0 bg-white hover:bg-opacity-30 transition-opacity duration-100 opacity-0 active:opacity-100">
                </div>
            </button>
            </div>
            </div>
            </div>
        </>
    )
}


function SendLocation()
{
    const {isLoaded}=useLoadScript({
        googleMapsApiKey: MAPS_KEY
    })

    if(!isLoaded) return <h1 className="text-white">wait plz</h1>
    else
    return (
    <div className={"overflow"}>
        <div>
            {/* <TrackVechicle/> */}
        </div>
        <Map className="mt-10"/>
    </div>
    )
}

export default SendLocation




