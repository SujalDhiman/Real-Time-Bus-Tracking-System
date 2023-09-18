import { useState,useEffect } from "react"
import axios from "axios"
import {Link} from "react-router-dom"
import {axiosConfig, SERVER_URL} from "../../Constants/config.js";


function Card({busNumber,route ,active,objectId})
{
    return (
        <div className="rounded-lg bg-slate-700 w-[400px] text-white">
            <h1><Link to= {`/user/trackVehicle/${objectId}`}>Bus Number :- {busNumber}</Link></h1>
            <h1>0--{
                (
                    () => {
                        return route.stations.map((station) => {
                            return (<><span>{`${station.stationName}`}</span>--</>);
                        })
                    }
                )()
            }0</h1>
            <div className="flex space-x-10">Bus Status :- &nbsp;  {active === "active"?<h1 className="w-[20px] h-[20px] rounded-full bg-green-600"></h1>:<h1 className="w-[20px] h-[20px] rounded-full bg-red-600"></h1>}</div>
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
            <input type="text" value={search} onChange={(e)=>{
                if(e.target.value === "")
                {
                    setDataReceived(preserveData)
                }setSearch(e.target.value)}} className="px-4 py-2 text-1xl font-semibold rounded-tl-lg rounded-bl-lg outline-none" />
            <button className="px-4 py-2 text-1xl bg-blue-700 text-white rounded-tr-lg rounded-br-lg" onClick={searchLocation}>Search</button>
        </div>
        <div className="space-y-16 mt-10">
        {(isLoading)?<h1 className="text-white"> Loading... </h1>:dataReceived.map((ele)=><Card busNumber={ele.busNumber}  route={ele.route} active={ele.busStatus} key={ele._id} objectId={ele._id}/>)}
        </div>
        </>
    )
}