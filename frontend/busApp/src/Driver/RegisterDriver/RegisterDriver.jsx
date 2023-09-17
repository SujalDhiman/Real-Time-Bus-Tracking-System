import {useState,useEffect,useCallback, useContext} from "react"
import {useNavigate} from "react-router-dom"
import axios from "axios"
import { SERVER_URL } from "../../Constants/config"
import {Link} from "react-router-dom"
import LoginDriver from "../LoginDriver/LoginDriver"
import { UserSVG,PasswordSVG,HidePasswordSVG,BusNumberPlate,ContactSVG,BusNumberSVG } from "../../Context/Assets"



import main from "../../assets/main.jpg"
import { PageContext } from "../../utilityFunctions/PageContext"

function RegisterDriver()
{
    let navigate=useNavigate()
    const [busNumber,setBusNumber]=useState("")
    const [busNumberPlate,setBusNumberPlate]=useState("")
    const [name,setName]=useState("")
    const [contact,setContact]=useState("")
    const [password,setPassword]=useState("")
    const [toggle,setToggle]=useState("password")

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

            const response=await axios.post(`${SERVER_URL}/api/v1/register`,payload)

            console.log(response)

            if(response.data.success === true)
            {
                setPage("Sign In")
            }
        }
        else
        {
            alert("Missing Fields Information")
        }
    }


    return (
    <div className="w-screen h-screen flex overflow-hidden "> 
    <div className="flex flex-col justify-center w-1/3 bg-[#0F232C] h-[100vh]">
        <div className="flex justify-evenly items-center pt-10 mt-16">
            <button className="px-4 py-2 text-2xl font-semibold text-white focus:text-orange-500" onClick={changePage}>Register</button>
            <button className="px-4 py-2 text-2xl font-semibold text-white focus:text-orange-500" onClick={changePage}>Sign In</button>
        </div>
        {page === "Register"?(
            <div className="mt-5 flex flex-col justify-center items-center">
            <div className="rounded-lg w-2/3 h-screen  flex flex-col  items-center space-y-9">
                <div className="box-border flex bg-black items-center px-4 rounded-md"> 
                <input type="text" className="outline-none bg-black text-white h-[50px] " value={busNumber} onChange={(e)=>setBusNumber(e.target.value)} placeholder="Enter Bus Number"/>
                <BusNumberSVG />
                </div>

                <div className="flex  bg-black items-center px-4 rounded-md">
                <input type="text" value={busNumberPlate}  className="outline-none  bg-black  text-white h-[50px]" onChange={(e)=>setBusNumberPlate(e.target.value)} placeholder="Enter Bus Number Plate"/>
                <BusNumberPlate />
                </div>

                <div className="flex  bg-black items-center px-4 rounded-md">
                <input type="text" value={name}  className="outline-none  bg-black  text-white h-[50px]" onChange={(e)=>setName(e.target.value)} placeholder="Enter Name"/>
                <UserSVG />
                </div>

                <div className="flex  bg-black items-center px-4 rounded-md">
                <input type="text" value={contact}  className="outline-none  bg-black text-white h-[50px]"  onChange={(e)=>setContact(e.target.value)} placeholder="Enter Contact Number"/>
                <ContactSVG />
                </div>    

                <div className="flex  bg-black  items-center rounded-md">
                    <input type={toggle} value={password}  className="outline-none  bg-black text-white h-[50px] px-2 rounded-md" onChange={(e)=>setPassword(e.target.value)} placeholder="Enter Your Password"/>
                    <button onClick={viewPassword} className="px-4 py-1 text-white">{toggle === "password"? <PasswordSVG />:<HidePasswordSVG />}</button>
                </div>
                
                <div className="flex flex-col items-center justify-center space-y-5">
                    <h1 className="text-white">Have an account already ? <button onClick={changePage} className="text-yellow-500 font-semibold text-xl">Sign In</button></h1>
                    <button className="px-12 py-2 rounded-xl font-bold text-1xl text-white bg-[#004D52] hover:text-gray-300" onClick={submitDetails}>Submit</button>
                </div>
            </div>
        </div>) :  (
            <LoginDriver />
        ) }
    </div>
    <div className="flex object-cover">
        <img src={main} alt="photo"/>
    </div>
    </div>
    )
}


export default RegisterDriver;