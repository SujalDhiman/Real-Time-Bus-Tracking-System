import { useState,useEffect } from "react"
import axios from "axios"
import {Link} from "react-router-dom"
import {axiosConfig, SERVER_URL} from "../../Constants/config.js";


function Card({busNumber,route ,active,objectId, eta, rating})
{
    return (
        <div className="ml-2 rounded-2xl bg-[#E93F4B] w-[400px] h-[190px] text-white p-4">
            <h1 className={"font-bold text-2xl"}>ETA: {(eta)?eta.progress?eta.progress[eta.progress.length-1].eta:"N/A":"N/A"}</h1>
            <div className={"relative"}>
                <div className={"flex flex-row gap-[5px] items-center"}>
                    <div className="w-3 h-3 bg-[#38B3F9] rounded-full "></div>
                    <p className={"p-0 m-0"}>{route.stations[route.stations.length - 1].stationName}</p>
                </div>
                <div className="relative mt-[-5px] mb-[-5px] left-[5px] border-l-2 border-black h-[35px]"></div>
                <div className={"flex flex-row gap-[5px] items-center"}>
                    <div className="w-3 h-3 bg-[#38B3F9] rounded-full "></div>
                    <p className={"p-0 m-0"}>{route.stations[0].stationName}</p>
                </div>
            </div>
            <div className={"relative top-[-35px]"}>
                <h1 className={"font-bold text-2xl ml-[75%]"}>Bus: {busNumber}</h1>
                <div className={"ml-[75%]"}>
                    <p className={"text-yellow-300"}>{Array(Number(Math.round(rating))).fill("*").map((e) =><span>*</span>)}{Array(Number(5-Math.round(rating))).fill("*").map((e) =><span className={"text-white"}>*</span>)}<span className={"text-white text-[13px]"}>(443)</span></p>
                </div>
                <button className={"w-[98%] border-[1px] drop-shadow-md border-black bg-[#38B3F9] h-[35px] text-black rounded-2xl"}><Link to= {`/user/trackVehicle/${objectId}`}>View Bus &#x2192;</Link></button>
            </div>
        </div>
    )
}

export function LookupVehicles()
{
    const [dataReceived,setDataReceived]=useState([])
    const [preserveData,setPreserveData]=useState([])
    const [search,setSearch]=useState("")
    const [isLoading,setLoading]=useState(true)
    const [busRoutes, setBusRoutes]=useState([]);

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
        <div>
            <div className=" z-50 w-full top-0 left-0 bg-[#E80202] h-[60px] flex items-center justify-center space-x-80 text-white text-3xl">
                <h1 className={"font-bold"}>Active Buses</h1>
            </div>
            <input type="text" value={search} onChange={(e)=>{
                if(e.target.value === "")
                {
                    setDataReceived(preserveData)
                }setSearch(e.target.value)}} className="px-4 py-2 text-1xl font-semibold rounded-tl-lg rounded-bl-lg outline-none" />
            <button className="px-4 py-2 text-1xl bg-blue-700 text-white rounded-tr-lg rounded-br-lg" onClick={searchLocation}>Search</button>
        </div>
        <div className="space-y-16 mt-10">
        {(isLoading)?<h1 className="text-white"> Loading... </h1>:dataReceived.map((ele)=><Card busNumber={ele.busNumber} rating={ele.avgRating} route={ele.route} active={ele.busStatus} eta={ele.progress} key={ele._id} objectId={ele._id}/>)}
        </div>
        </>
    )
}