import {useState,useEffect,useCallback,useContext} from "react"
import axios from "axios"
import { request_url } from "../constant/constants";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../Context/SocketContext";
import { Link } from "react-router-dom";

function LoginDriver()
{
    let navigate=useNavigate()
    const [busNumber,setBusNumber]=useState("")
    const [password,setPassword]=useState("")
    const [toggle,setToggle]=useState("password")
    let {socket,busId,setBusId}=useContext(SocketContext)
    const [error,setError]=useState(false)

    const viewPassword=useCallback(function ()
    {
        if(toggle === "password")
            setToggle("text")
        else 
            setToggle("password")
    },[toggle])

    async function loginDriver()
    {
        if(busNumber !== "" && password !== "")
        {
            let payload={
                busNumber,
                password
            }

            const response=await axios.post(request_url + "login",payload)

            console.log(response)

            if(response.data.login === true)
            {
                // navigate("/driver/login")
                setBusId(response.data.bus._id)
                console.log("hello")
                navigate("/driver/dashboard")
            }
            else
            {
                setError(true)
                console.log("Either Password is wrong or you have not registered")
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
    
                    <div className="flex">
                        <input type={toggle} value={password} onChange={(e)=>
                            {
                                if(e.target.value === "")
                                    setError(false)
                                setPassword(e.target.value)
                            }} placeholder="Enter Your Password" className="outline-none"/>
                        <button onClick={viewPassword} className="px-4 py-1 bg-blue-700 text-white">{toggle === "password"? "Show":"Hide"}</button>
                        
                    </div>
                    {error === true ? <h1 className="text-white">Incorrect Password </h1> : <h1></h1>} 
                    <button className="px-4 py-2 rounded-lg text-white bg-blue-600" onClick={loginDriver}>Log in</button>

                    <h1 className="text-white">Want to register first? <Link to="/driver/registerDriver">register</Link></h1>

                </div>
            </div>
        </>
        )
}



export default LoginDriver;
