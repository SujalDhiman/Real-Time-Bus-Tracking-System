import React, {useState, useEffect, useContext, createContext} from "react"
import axios from "axios"
import {Link} from "react-router-dom"
import {axiosConfig, SERVER_URL} from "../../Constants/config.js";
import {GoogleMap, useLoadScript} from "@react-google-maps/api";
import {MAPS_KEY} from "../../Constants/keys.js";
import {MemoizedDirectionsRenderer, MemoizedDirectionsService} from "../../Driver/SendLocation/SendLocation.jsx";
import "./LookupVechicles.css";


function Card({busNumber,route ,active,objectId, eta, rating})
{
    const setRoute = useContext(RouteContext).setRoute;
    return (
        <div onClick={() => {
            setRoute(route);
        }} className="ml-2 rounded-2xl bg-[#E93F4B] w-[400px] h-[190px] text-white p-4">
            <h1 className={"font-bold text-2xl"}>ETA: {(eta)?eta.progress?eta.progress[eta.progress.length-1].eta:"N/A":"N/A"}</h1>
            <div className={""}>
                <div className={"flex flex-row gap-[5px] items-center"}>
                    <div className="w-3 h-3 bg-[#38B3F9] rounded-full "></div>
                    <p className={"p-0 m-0"}>{route.stations[route.stations.length - 1].stationName}</p>
                </div>
                <div className=" mt-[-5px] mb-[-5px] left-[5px] border-l-2 border-black h-[35px]"></div>
                <div className={"flex flex-row gap-[5px] items-center"}>
                    <div className="w-3 h-3 bg-[#38B3F9] rounded-full "></div>
                    <p className={"p-0 m-0"}>{route.stations[0].stationName}</p>
                </div>
            </div>
            <div className={"relative top-[-35px]"}>
                <h1 className={"font-bold text-2xl ml-[75%]"}>Bus: {busNumber}</h1>
                <div className={"ml-[75%]"}>
                    <p className={"text-yellow-300 text-xl"}>{Array(Number(Math.round(rating))).fill("*").map((e) =><span>*</span>)}{Array(Number(5-Math.round(rating))).fill("*").map((e) =><span className={"text-white"}>*</span>)}<span className={"text-white text-[13px]"}></span></p>
                </div>
                <button className={"w-[98%] border-[1px] drop-shadow-md border-black bg-[#38B3F9] h-[35px] text-black rounded-2xl"}><Link to= {`/user/trackVehicle/${objectId}`}>View Bus &#x2192;</Link></button>
            </div>
        </div>
    )
}

function LoadMap() {
    const {isLoaded}=useLoadScript({
        googleMapsApiKey: MAPS_KEY
    })

    if(!isLoaded) return <h1 className="text-white">wait plz</h1>
    else
        return (
            <div className={"w-full"}>
                <Map className="mt-10"/>
            </div>
        )
}

function Map() {

    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [directionsOptions, setDirectionsOptions] = useState();
    const busRoute = useContext(RouteContext).route;

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
        <GoogleMap zoom={10} center={{lat:0 ,lng:0}} mapContainerClassName="map-container2">
            { directionsOptions && <MemoizedDirectionsService directionsOptions={directionsOptions} setDirectionsResponse={setDirectionsResponse}/>}
            {directionsResponse && <MemoizedDirectionsRenderer directions={directionsResponse}/>}
        </GoogleMap>
    </>);
}

const RouteContext = createContext();

export function LookupVehicles()
{
    const [dataReceived,setDataReceived]=useState([])
    const [preserveData,setPreserveData]=useState([])
    const [search,setSearch]=useState("")
    const [isLoading,setLoading]=useState(true)
    const [busRoutes, setBusRoutes]=useState([]);
    const [route, setRoute] = useState();

    function searchLocation()
    {
        if(!busRoutes)
            return;
        let filteredRoutes = busRoutes.filter((route) => {
            console.log(route);
            return route.stations.some((station) => {
                return station.stationName === search;
            });
        });

        let filteredResult= dataReceived.filter((ele)=> filteredRoutes.some((route) => {
            return route._id === ele.route._id;
        }))
        setDataReceived(filteredResult)
    }

    function getActiveBusDetails()
    {
        axios.get(`${SERVER_URL}/api/v1/activeBus`, axiosConfig)
            .then(response => {
                console.log(response.data);
                setDataReceived(response.data.buses);
                setPreserveData(response.data.buses);
                setLoading(false);
            })
    }

    useEffect(()=>{
        (async () => {
            const routes= await axios.get(`${SERVER_URL}/api/v1/busRoutes`, axiosConfig);
            setBusRoutes(routes.data.routes);
        })();
        getActiveBusDetails()
    },[])

    return (
        <>
            <RouteContext.Provider value={{route, setRoute}}>
                <div className="z-50 w-full top-0 left-0 bg-[#E80202] h-[60px] flex items-center justify-center space-x-80 text-white text-3xl">
                    <h1 className={"font-bold"}>Active Buses</h1>
                </div>
                <div className={"flex flex-row justify-start"}>
                    <div>
                        <div>
                            <div className={"mt-5 ml-2"}>
                                <input type="text" value={search} onChange={(e)=>{
                                    if(e.target.value === "")
                                    {
                                        setDataReceived(preserveData)
                                    }setSearch(e.target.value)}} className="bg-[#D9D9D9] w-[317px] px-4 py-2 text-1xl font-semibold rounded-tl-lg rounded-bl-lg outline-none" />
                                <button className="px-4 py-2 text-1xl bg-[#E93F4B] text-white rounded-tr-lg rounded-br-lg" onClick={searchLocation}>Search</button>
                            </div>
                        </div>
                        <div className="w-[440px] space-y-16 mt-10 overflow-y-scroll h-[570px]">
                        {(isLoading)?<h1 className="text-white"> Loading... </h1>:dataReceived.map((ele)=><Card busNumber={ele.busNumber} rating={ele.avgRating} route={ele.route} active={ele.busStatus} eta={ele.progress} key={ele._id} objectId={ele._id}/>)}
                        </div>
                    </div>
                    <LoadMap/>
                </div>
            </RouteContext.Provider>
        </>
    )
}