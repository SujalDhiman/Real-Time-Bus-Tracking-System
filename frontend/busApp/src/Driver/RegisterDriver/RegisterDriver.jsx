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
    <div className="flex h-[100vh] w-[100vw] overflow-hidden font-comic-neue"> 
    <div className="bg-[#F5FDFF] h-[100vh] w-[35%] flex flex-col items-center">
        <div className="flex flex-col mt-[6vh]">
            <div className="flex space-x-20">
            <button className={` text-2xl ${page === "Sign In" ?"text-[#BAA2A2]" : "text-black" }`}  onClick={changePage}>Register</button>
            <button className={`text-2xl ${page === "Register" ?"text-[#BAA2A2]":"text-black"}`} onClick={changePage}>Sign In</button>
            </div>
            <div>
            <div className={`shadow-xl rounded-lg line bg-[#E01A27] h-[5px] w-[35%] transition-transform ${page === "Register" ? "translate-x-0" : "translate-x-[160px]"}`}></div>
            </div>
        </div>
        {page === "Register"?(
            <div className="mt-[4vh]">
            <div className="flex flex-col items-center space-y-[4vh]">
                <div className="flex bg-white border border-black w-[290px] h-[50px] justify-between items-center rounded-lg p-2 shadow-xl">
                <input type="text" className="placeholder-black focus:outline-none" value={busNumber} onChange={(e) => setBusNumber(e.target.value)} placeholder="Bus Number"/>
                <BusNumberSVG />
                </div>

                <div className="flex bg-white border border-black w-[290px] h-[50px] justify-between items-center rounded-lg p-2 shadow-xl">
                <input type="text" value={busNumberPlate}  className="placeholder-black focus:outline-none" onChange={(e)=>setBusNumberPlate(e.target.value)} placeholder="Registration number"/>
                <BusNumberPlate />
                </div>

                <div className="flex bg-white border border-black w-[290px] h-[50px] justify-between items-center rounded-lg p-2 shadow-xl">
                <input type="text" value={name}  className="placeholder-black focus:outline-none" onChange={(e)=>setName(e.target.value)} placeholder="Name"/>
                <UserSVG />
                </div>

                <div className="flex bg-white border border-black w-[290px] h-[50px] justify-between items-center rounded-lg p-2 shadow-xl">
                <input type="text" value={contact}  className="placeholder-black focus:outline-none"  onChange={(e)=>setContact(e.target.value)} placeholder="Contact Number"/>
                <ContactSVG />
                </div>    

                <div className="flex bg-white border border-black w-[290px] h-[50px] justify-between items-center rounded-lg p-2 shadow-xl">
                    <input type={toggle} value={password}  className="placeholder-black focus:outline-none" onChange={(e)=>setPassword(e.target.value)} placeholder="Password"/>
                    <button onClick={viewPassword} className="">{toggle === "password"? <PasswordSVG />:<HidePasswordSVG />}</button>
                </div>
                
                <div className="flex items-center h-[50px] w-[290px]">
                    <span className="text-[23px] mr-[6px]">PUC:</span>
                    <input className="text-[#5F5E5E] border-none" type="file" accept="image/*" onChange={(e)=>
                        {
                            setFileDetails(e.target.files[0])}
                        }/>
                </div>

                <div className="flex flex-col items-center space-y-5">
                    <h1 className="text-[15px]">Have an account already ? <button onClick={changePage} className="text-[#E93F4B]">Sign In</button></h1>
                    {isLoading ? (
                       <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-b-4 border-l-3 border-r-3 border-yellow-500 mx-auto"></div>
                    ) : (
                         <button className="px-12 py-3 w-[200px] rounded-full font-bold  text-white bg-[#E93F4B] hover:text-gray-300 text-[20px]" onClick={submitDetails}>Submit</button> 
                    )}
                   
                    
                </div>
            </div>
        </div>) :  (
            <LoginDriver/>
        ) }
    </div>
    <div>
        <img src={main} alt="photo" className="h-[100vh] w-[100vw]"/>
    </div>
    <ToastContainer transition={Zoom}/>
    </div>
    )
}


export default RegisterDriver;