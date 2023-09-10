import { useState,useEffect } from "react"
import axios from "axios"
import {Link} from "react-router-dom"
function Card({busNumber,name,active,objectId})
{
    return (
        <div className="rounded-lg bg-slate-700 w-[400px] text-white">
            <h1><Link to= {`/bus/${objectId}`}>Bus Number :- {busNumber}</Link></h1>
            <h1>Driver Uncle :- {name}</h1>
            <div className="flex space-x-10">Bus Status :- &nbsp;  {active === "active"?<h1 className="w-[20px] h-[20px] rounded-full bg-green-600"></h1>:<h1 className="w-[20px] h-[20px] rounded-full bg-red-600"></h1>}</div>
        </div>
    )
}

export function Gotdetails()
{
    const [dataReceived,setDataReceived]=useState([])
    const [isLoading,setLoading]=useState(true)
    async function getActiveBusDetails()
    {
        const response=await axios.get(`http://127.0.0.1:10000/api/v1/activeBus`)
        console.log(response.data.buses)
        setDataReceived(response.data.buses)
        setLoading(false)
    }
    useEffect(()=>{
        getActiveBusDetails()
    },[])

    return (
        <div className="space-y-16">
        {isLoading?<h1> Ruko Bhaiyo </h1>:dataReceived.map((ele)=><Card busNumber={ele.busNumber}  name={ele.driver.name} active={ele.busStatus} key={ele._id} objectId={ele._id}/>)}
        </div>
    )
}