import { useCallback,useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { request_url } from "../../constant/constants"
import axios from "axios"
import { axiosConfig } from "../../Constants/config"

function BusStatus()
{

    const navigate=useNavigate()
    const {id}=useParams()
    const [name,setName]=useState("")
    const [status,setStatus]=useState("")
    const [startingPoint,setStartingPoint]=useState("")
    const [destinationPoint,setDestinationPoint]=useState("")

    const changeStatus=useCallback(function (e)
    {
        if(e.target.id === "a")
            setStatus("active")
        else
            setStatus("notactive")
    },[status])

    async function submitDetails (){

        if(name !== "" && status !== "" && startingPoint !== "" && destinationPoint !== "")
        {
            let payload={
                driver:{
                    name
                },
                startingPoint ,
                destinationPoint,
                busStatus:status
            }
            console.log(payload)
            console.log(request_url+`bus/${id}`)
            const response=await axios.put(request_url+`bus/${id}`,payload,axiosConfig)
            console.log(response)
            navigate("/driver/dashboard")
        }
        else
        {
            alert("Fill All Fields")
        }
    }

    return (
        <>
            <div className="mt-10 flex flex-col justify-center items-center">
                <h1 className="text-white text-3xl font-bold text-center">Bus Details</h1>
                <div className="rounded-lg bg-gray-700 w-[500px] flex flex-col justify-center items-center space-y-14">
    
                    <input type="text" value={name}  onChange={(e)=>setName(e.target.value)} placeholder="Enter Name"/>
    
                    <div>
                        <h1>Bus Status :- {status.toUpperCase()}</h1>
                        <button id="a" onClick={changeStatus}  className="px-2 py-2 bg-blue-600 text-white">Active</button>
                        <button id="na" onClick={changeStatus} className="px-2 py-2 bg-blue-600 text-white">Not Active</button>
                    </div>
                    
                    <input type="text" value={startingPoint}  onChange={(e)=>setStartingPoint(e.target.value)} placeholder="Enter Starting Point"/>

                    <input type="text" value={destinationPoint}  onChange={(e)=>setDestinationPoint(e.target.value)} placeholder="Enter Destination Point"/>

                    <button onClick={submitDetails}>Set Details</button>
                    
                </div>
            </div>
        </>
        )
}


export default BusStatus;