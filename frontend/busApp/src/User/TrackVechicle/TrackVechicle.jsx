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
import {adminAddress, axiosConfig, SERVER_URL} from "../../Constants/config.js";
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastPayload } from "../../Context/Assets"
import stopAudio from "./stop.mp4"
import {unmountComponentAtNode} from "react-dom";



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

function PanicButton({busDetails})
{
    const {id}=useParams()
    let [latitude,setLatitude]=useState(0)
    let [longitude,setLongitude]=useState(0)
    let emergencyaudio=new Audio(stopAudio)
    const {socket} = useContext(SocketContext);
    const [panicDetails,setPanicDetails]=useState({
        alertId:"",
        alertLatitude:"",
        alertLongitude:"",
        alertSignal:false
    }) 
    const [audio,setAudio]=useState(null)

    //listening for coordinates
    useEffect(()=>{
    navigator.geolocation.getCurrentPosition((position)=>{
        setLatitude(position.coords.latitude)
        setLongitude(position.coords.longitude)
    })},[latitude,longitude])


    //listening for PANIC ALARM
    useEffect(()=>{
        socket.on("sendAlarm",(payload)=>{
            toast.warn("An Emergency Occured",{
                autoClose:1000,
                position:"top-center",
                theme:"dark"
            })
            setPanicDetails({...panicDetails,alertId:`${payload.id}`,alertLatitude:`${payload.latitude}`,alertLongitude:`${payload.longitude}`,alertSignal:true})
            
            emergencyaudio.play()
            setAudio(emergencyaudio)
        })
    },[])

    //sending the EVENT
    function panic()
    {
        console.log("pressed")
        let payload={
            id,
            latitude,
            longitude
        }
        socket.emit("panicAlarm",payload);

        const sosPayload = {
            "recipientAddress": adminAddress,
            "subject": "SOS",
            "message": `Emergency on BusNumber ${busDetails.busNumber} on route: ${busDetails.route.routeName}
            Driver Name: ${busDetails.driver.name},
            Driver Contact: ${busDetails.driver.contactInfo},
            Live Location: http://localhost:5173/bus-real#/user/trackVehicle/6507b12bb75297ebd9110f8b
            `
        }

        axios.post(`https://sos-message.azurewebsites.net/api/sos-mail?code=_kVVzKkAx9GlalN6MWe7l9QGTMsRH9MKckEB5_ysjPzgAzFucyZDmg==`,sosPayload).then((response) => console.log(response));
    }

    return (<>
    <div className="mt-10 ml-[70%] flex items-end mb-[30px]">
    <button
  className="w-[100px] h-[100px] bg-red-600 border-2 border-red-700 rounded-full text-white text-[20px] focus:outline-none relative overflow-hidden transform transition-transform duration-100 hover:-translate-y-0.5 active:translate-y-0.5 active:bg-red-700 active:scale-95 shadow-custom2"
  onClick={panic}
>PANIC!
  <div className="absolute inset-0 flex items-center justify-center bg-opacity-0 bg-white hover:bg-opacity-30 transition-opacity duration-100 opacity-0 active:opacity-100">
    PANIC!
  </div>
</button>

    </div>
    <div className="flex flex-col items-center justify-center">
    {panicDetails.alertSignal === true ? <div className="w-[400px] h-[100px] border-2 bg-black text-white">
        <h1>Bus ID :-{panicDetails.alertId}</h1>
        <h1>Alert Latitude :- {panicDetails.alertLatitude} </h1>
        <h1>Alert Longitude :- {panicDetails.alertLongitude}</h1>
        <button onClick={()=>{
            if(audio)
            {
                console.log(audio)
                audio.pause()
                setAudio(null)
            }
            setPanicDetails({...panicDetails,alertSignal:false})
        }} className="bg-red-700 text-white ">Ignore Notification</button>
    </div>:<h1></h1>}
    <ToastContainer />
    </div>
    </>
    )
}


function Map()
{
    const {socket} = useContext(SocketContext);
    const {id}=useParams()
    const [latitude,setLatitude]=useState(0)
    const [longitude,setLongitude]=useState(0)
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [directionsOptions, setDirectionsOptions] = useState();
    const [progress, setProgress] = useState();

    useEffect(() => {
        socket.on(`busLocation-${id}`,(payload)=>{
            setLatitude(payload.latitude)
            setLongitude(payload.longitude)
            setProgress(payload.progress)
            console.log(payload);
        }
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
            <GoogleMap zoom={10} center={{lat:latitude,lng:longitude}} mapContainerClassName="container shadow-custom">
                { directionsOptions && <MemoizedDirectionsService directionsOptions={directionsOptions} setDirectionsResponse={setDirectionsResponse}/>}
                {directionsResponse && <>
                    <TrafficLayer/>
                    <MemoizedDirectionsRenderer directions={directionsResponse }/>
                </>}
                <MarkerF position={{lat:latitude,lng:longitude}} />
            </GoogleMap>
            <ul className="">
                <div className={"absolute left-1 top-[80%]"}>
                    {progress && progress.map((p) => {return (<li className={p.reached?"text-white":"text-red-700"}>{`* - ${p.distance} ${p.eta}`}</li>)})}
                </div>
            </ul>

        </>
    )
}

function Card({busNumber,busNumberPlate,contactInfo,route,age,name,busStatus})
{

    return (
        <div className="flex flex-col space-y-5 items-center justify-between mb-[30px]">
        <div className="rounded-[20px] bg-[#E93F4B] w-[30vw] text-white pt-4 pb-4 pl-6 pr-6 space-y-3 shadow-custom mt-[7vh]">
            <h1>Bus Number :- {busNumber}</h1>
            <h1>Bus Number Plate :- {busNumberPlate}</h1>
            <h1>Driver Name :- {name}</h1>
            <h2>Driver Contact Information :- {contactInfo}</h2>
            <h2>Route :- 0--{(()=>{
                return route.stations.map((station) => <><span>{`${station.stationName}`}</span>--</>)
            })()}0</h2>
            <div className="flex">Bus Status :- &nbsp; {busStatus === "active"?<h1 className="w-[20px] h-[20px] rounded-full bg-green-600"></h1>:<h1 className="w-[20px] h-[20px]rounded-full bg-red-600"></h1>}</div>
        </div>
        <div className="text-[#9A9A9A]">
                Enjoying your ride? <Link to="/user/feedback" className="text-red-600">Provide feedback</Link>
        </div>
        </div>
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
            <div className="w-[100vw] h-[100vh] flex flex-col items-center font-lexend">
            <div className="mt-[40px]">
                <Map/>
            </div>
            <div className="flex h-[90vh]">
                <>
                    {isLoading ?<h1> Loading... </h1>:<Card key={dataReceived._id} busNumber={dataReceived.busNumber} busNumberPlate={dataReceived.busNumberPlate} contactInfo={dataReceived.driver.contactInfo} route={dataReceived.route} age={dataReceived.driver.age} name={dataReceived.driver.name} busStatus={dataReceived.busStatus}  objectId={dataReceived._id}/>}
                </>
                <PanicButton className={""}  busDetails={dataReceived}/>
            </div>
            </div>
        )
    }
}