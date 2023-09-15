import {useState,useEffect,useCallback} from "react"
import {useNavigate} from "react-router-dom"
import axios from "axios"
import { SERVER_URL } from "../Constants/config"
import { request_url } from "../constant/constants"
import {Link} from "react-router-dom"

function RegisterDriver()
{
    let navigate=useNavigate()
    const [busNumber,setBusNumber]=useState("")
    const [busNumberPlate,setBusNumberPlate]=useState("")
    const [name,setName]=useState("")
    const [contact,setContact]=useState("")
    const [password,setPassword]=useState("")

    const [toggle,setToggle]=useState("password")


    const viewPassword=useCallback(function ()
    {
        if(toggle === "password")
            setToggle("text")
        else 
            setToggle("password")
    },[toggle])


    async function submitDetails()
    {
        if(busNumber !== "" && busNumberPlate !== "" && name !== "" && contact !== "" && password !== "")
        {   
            let payload={
                busNumber,
                busNumberPlate,
                driver:{
                    name,
                    contactInfo:contact,
                    password
                }
            }

            const response=await axios.post(request_url + "register",payload)

            console.log(response)

            if(response.data.success === true)
            {
                navigate("/driver/login")
            }
        }
        else
        {
            alert("Missing Fields Information")
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
                
                <div className="flex">
                    <input type={toggle} value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter Your Password" className="outline-none"/>
                    <button onClick={viewPassword} className="px-4 py-1 bg-blue-700 text-white">{toggle === "password"? "Show":"Hide"}</button>
                </div>
                    
                <button className="px-4 py-2 rounded-lg text-white bg-blue-600" onClick={submitDetails}>Register</button>


                <h1 className="text-white">Already signed in <Link to={"/driver/login"}>Login</Link></h1>
            </div>
        </div>
    </>
    )
}


export default RegisterDriver;