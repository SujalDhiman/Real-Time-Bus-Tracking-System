import {useState,useEffect,useCallback, useContext} from "react"
import {useNavigate,Link} from "react-router-dom"
import axios from "axios"
import { SERVER_URL } from "../../Constants/config"
import LoginDriver from "../LoginDriver/LoginDriver"
import { UserSVG,PasswordSVG,HidePasswordSVG,BusNumberPlate,ContactSVG,BusNumberSVG,toastPayload } from "../../Context/Assets"
import { PageContext } from "../../Context/PageContext"
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import main from "../../assets/main.jpg"


function RegisterDriver()
{
    let navigate=useNavigate()
    const [busNumber,setBusNumber]=useState("")
    const [busNumberPlate,setBusNumberPlate]=useState("")
    const [name,setName]=useState("")
    const [contact,setContact]=useState("")
    const [password,setPassword]=useState("")
    const [toggle,setToggle]=useState("password")
    const [isLoading,setIsLoading]=useState(false)
    const {page,setPage}=useContext(PageContext)
    const [fileDetails,setFileDetails]=useState("")

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
            setIsLoading(true)
            let payload={
                busNumber,
                busNumberPlate,
                name,
                contactInfo:contact,
                password,
                photo:fileDetails
            }
            console.log(payload)
            const response=await axios.post(`${SERVER_URL}/api/v1/register`,payload,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            setIsLoading(false)
            if(response.data.success === true)
            {
                toast.success("Registered Successfully",toastPayload)
                setPage("Sign In")
            }
            else
            {
                toast.error("Driver Already Registered !!",toastPayload)
            }
        }
        else
        {
            toast.error("Missing Fields Information",toastPayload)
        }
    }

    return (
    <div className="w-screen h-screen flex overflow-hidden"> 
    <div className="flex flex-col justify-center w-1/3 bg-[#0F232C] h-[100vh]">
        <div className="flex justify-evenly items-center pt-10 mt-16">
            <button className={`px-4 py-2 text-2xl font-semibold ${page === "Sign In" ?"text-white" : "text-orange-600"  }`}  onClick={changePage}>Register</button>
            <button className={`px-4 py-2 text-2xl font-semibold ${page === "Register" ?"text-white":"text-orange-600"}`} onClick={changePage}>Sign In</button>
        </div>
        {page === "Register"?(
            <div className="mt-5 flex flex-col justify-center items-center">
            <div className="rounded-lg w-2/3 h-screen  flex flex-col  items-center space-y-5">
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
                
                <div className="flex pl-20">
                    <input type="file" accept="image/*" onChange={(e)=>
                        {
                            setFileDetails(e.target.files[0])}
                        }/>
                </div>

                <div className="flex flex-col items-center justify-center space-y-5">
                    <h1 className="text-white">Have an account already ? <button onClick={changePage} className="text-yellow-500 font-semibold ">Sign In</button></h1>
                    {isLoading ? (
                       <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-b-4 border-l-3 border-r-3 border-yellow-500 mx-auto"></div>
                    ) : (
                         <button className="px-12 py-2 rounded-xl font-bold  text-white bg-[#004D52] hover:text-gray-300" onClick={submitDetails}>Submit</button> 
                    )}
                   
                    
                </div>
            </div>
        </div>) :  (
            <LoginDriver/>
        ) }
    </div>
    <div className="flex object-cover">
        <img src={main} alt="photo"/>
    </div>
    <ToastContainer transition={Zoom}/>
    </div>
    )
}


export default RegisterDriver;