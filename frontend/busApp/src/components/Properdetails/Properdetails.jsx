import { useState,useEffect } from "react"
import axios from "axios"
import {Link,useParams} from "react-router-dom"

function Card({busNumber,busNumberPlate,contactInfo,startingLocation,destinationLocation,age,name,busStatus})
{
    return (
        <div className="rounded-lg bg-slate-700 w-[400px] text-white">
            <h1>Bus Number :- {busNumber}</h1>
            <h1>Bus Number Plate :- {busNumberPlate}</h1>
            <h1>Driver Uncle :- {name}</h1>
            <h2>Driver Contact Information :- {contactInfo}</h2>
            <h2>Driver Age :- {age}</h2>
            <h2>Starting Location :- {startingLocation}</h2>
            <h2>Destination Location :- {destinationLocation}</h2>
            <div className="flex">Bus Status :- &nbsp; {busStatus === "active"?<h1 className="w-[20px] h-[20px] rounded-full bg-green-600"></h1>:<h1 className="w-[20px] h-[20px]rounded-full bg-red-600"></h1>}</div>
        </div>
    )
}

export function Properdetails()
{
    const {id}=useParams()
    const [dataReceived,setDataReceived]=useState([])
    const [isLoading,setLoading]=useState(true)
    async function getActiveBusDetails()
    {
        const response=await axios.get("http://127.0.0.1:10000/api/v1/activeBus")
        console.log(response.data.buses)
        setDataReceived(response.data.buses)
        setLoading(false)
    }
    useEffect(()=>{
        getActiveBusDetails()
    },[])

    return (
        <div className="space-y-16">
        {isLoading?<h1> Ruko Bhaiyo </h1>:dataReceived.map((ele)=><Card busNumber={ele.busNumber} busNumberPlate={ele.busNumberPlate} contactInfo={ele.driver.contactInfo} startingLocation={ele.startingPoint} destinationLocation={ele.destinationPoint} age={ele.driver.age} name={ele.driver.name} busStatus={ele.busStatus} key={ele._id} objectId={ele._id}/>)}
        </div>
    )
}