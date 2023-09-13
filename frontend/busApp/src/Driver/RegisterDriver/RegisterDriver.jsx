import { useState } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";

export function RegisterDriver()
{
    let navigate=useNavigate()
    const [busNumber,setBusNumber]=useState("")
    const [busNumberPlate,setBusNumberPlate]=useState("")
    const [name,setName]=useState("")
    const [contact,setContact]=useState("")
    const [age,setAge]=useState("")
    const [sp,setSP]=useState("")
    const [dp,setDP]=useState("")
    const [bs,setBS]=useState("")

    async function submitDetails()
    {
        let obj={
            busNumber,
            busNumberPlate,
            driver:{
                name,
                contactInfo:contact,
                age
            },
            startingPoint:sp,
            destinationPoint:dp,
            busStatus:bs
        }
        try {
            const response=await axios.post("http://127.0.0.1:443/api/v1/details",obj)

            console.log(response)
            navigate(`/driver/sendLocation/${response.data.createdBus._id}`)

        } catch (error) {
            console.log("An error occured")
        }
    }


    return (
        <>
            <div className="mt-10 flex flex-col justify-center items-center">
                <h1 className="text-white text-3xl font-bold text-center">Bus Details</h1>
                <div className="rounded-lg bg-gray-700 w-[500px] flex flex-col justify-center items-center space-y-14">
                    <input type="text" value={busNumber} onChange={(e)=>setBusNumber(e.target.value)} placeholder="Enter Bus Number"/>

                    <input type="text" value={busNumberPlate}  onChange={(e)=>setBusNumberPlate(e.target.value)} placeholder="Enter Bus Number Plate"/>

                    <input type="text" value={name}  onChange={(e)=>setName(e.target.value)} placeholder="Enter Name"/>

                    <input type="text" value={contact}  onChange={(e)=>setContact(e.target.value)} placeholder="Enter Contact Number"/>

                    <input type="text" value={age}  onChange={(e)=>setAge(e.target.value)} placeholder="Enter Age "/>

                    <input type="text" value={sp}  onChange={(e)=>setSP(e.target.value)} placeholder="Enter Current Location"/>

                    <input type="text" value={dp}  onChange={(e)=>setDP(e.target.value)} placeholder="Enter Destination Location"/>

                    <input type="text" value={bs}  onChange={(e)=>setBS(e.target.value)} placeholder="Enter Bus Status"/>
                    
                    <button className="px-4 py-2 rounded-lg text-white bg-blue-600" onClick={submitDetails}>Register</button>
                </div>
            </div>
        </>
    )
}