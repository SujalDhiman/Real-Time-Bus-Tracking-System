import { useState,useEffect } from "react"
import axios from "axios"
import {Link} from "react-router-dom"


function Card({busNumber,startingPoint,destinationPoint,active,objectId})
{
    return (
        <div className="rounded-lg bg-slate-700 w-[400px] text-white">
            <h1><Link to= {`/user/trackVehicle/${objectId}`}>Bus Number :- {busNumber}</Link></h1>
            <h1>Current Location :{startingPoint.toUpperCase()}</h1>
            <h2>Target Location :{destinationPoint.toUpperCase()}</h2>
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

    function searchLocation()
    {
        let filteredResult=dataReceived.filter((ele)=>ele.startingPoint.toLowerCase() === search.toLowerCase())
        setDataReceived(filteredResult)
    }

    async function getActiveBusDetails()
    {
        const response=await axios.get(`http://localhost:443/api/v1/activeBus`)
        console.log(response.data.buses)
        setDataReceived(response.data.buses)
        setPreserveData(response.data.buses)
        setLoading(false)
    }
    useEffect(()=>{
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
        {isLoading?<h1 className="text-white"> Ruko Bhaiyo </h1>:dataReceived.map((ele)=><Card busNumber={ele.busNumber}  startingPoint={ele.startingPoint} destinationPoint={ele.destinationPoint} active={ele.busStatus} key={ele._id} objectId={ele._id}/>)}
        </div>
        </>
    )
}