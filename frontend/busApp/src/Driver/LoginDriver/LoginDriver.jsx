import {useState,useEffect,useCallback,useContext} from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../../Context/SocketContext";
import { Link } from "react-router-dom";
import {SERVER_URL} from "../../Constants/config.js";
import { BusNumberSVG, HidePasswordSVG, PasswordSVG } from "../../Context/Assets";
import { PageContext } from "../../utilityFunctions/PageContext";

function LoginDriver()
{
    let navigate=useNavigate()
    const [busNumber,setBusNumber]=useState("")
    const [password,setPassword]=useState("")
    const [toggle,setToggle]=useState("password")
    let {socket,busId,setBusId}=useContext(SocketContext)
    const [error,setError]=useState(false)
    const {page,setPage}=useContext(PageContext)

    function changePage(e)
    {   
    if(e.target.innerText === "Register")
        setPage("Register")
    else
        setPage("Sign In")
    }

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

            const response=await axios.post(`${SERVER_URL}/api/v1/login`,payload)

            console.log(response)

            if(response.data.login === true)
            {
                // navigate("/driver/login")
                localStorage.setItem("id",response.data.bus._id)
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
            <div className="flex flex-col justify-center bg-[#0F232C] mt-5 h-[100vh] rounded-lg">
                <div className="rounded-lg  flex flex-col justify-center  items-center space-y-9">

                    <div className="flex justify-center bg-black items-center px-4 rounded-md"> 
                        <input type="text" className="outline-none bg-black text-white h-[50px] " value={busNumber} onChange={(e)=>setBusNumber(e.target.value)} placeholder="Enter Bus Number"/>
                        <BusNumberSVG />
                    </div>
                    
                    <div className="flex  bg-black  justify-center items-center rounded-md">
                        <input type={toggle}  value={password} onChange={(e)=>
                            {
                                if(e.target.value === "")
                                    setError(false)
                                setPassword(e.target.value)
                            }} 
                            placeholder="Enter Your Password" 
                            className="outline-none  bg-black text-white h-[50px] px-2 rounded-md"/>
                        <button onClick={viewPassword} className="px-4 py-1 text-white">{toggle === "password"? <PasswordSVG />:<HidePasswordSVG />}</button>
                        
                    </div>
                    {error === true ? <h1 className="text-white">Incorrect Password </h1> : <h1></h1>} 
                    
                    <div className="flex flex-col items-center justify-center space-y-5">
                        <h1 className="text-white text-xl">Want to register first ? <button onClick={changePage}  className="text-yellow-500 font-semibold text-xl">Register</button></h1>
                        <button className="px-12 py-2 rounded-xl font-bold text-1xl text-white bg-[#004D52] hover:text-gray-300" onClick={loginDriver}>Log in</button>
                    </div>


                </div>
            </div>
        </>
        )
}



export default LoginDriver;
