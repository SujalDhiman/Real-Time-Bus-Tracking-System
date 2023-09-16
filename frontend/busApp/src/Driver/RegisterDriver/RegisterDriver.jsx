import {useState,useEffect,useCallback} from "react"
import {useNavigate} from "react-router-dom"
import axios from "axios"
import { SERVER_URL } from "../../Constants/config"
import {Link} from "react-router-dom"
import { UserSVG,BusNumberPlate,BusNumberSVG,ContactSVG,PasswordSVG, HidePasswordSVG } from "../../Context/Assets"

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

            const response=await axios.post(`${SERVER_URL}/api/v1/register`,payload)

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
        <div>
            <div className="w-[552px] h-[1068px]">
                
                <div className="mt-5 flex flex-col justify-evenly items-start space-y-10">
                    <div className="box-border w-[450px] h-[48px] flex justify-between px-2 py-1 bg-black rounded-lg ">
                        <input type="text" value={busNumber} onChange={(e)=>setBusNumber(e.target.value)} className=" bg-black text-white outline-none rounded-md px-4 py-2" placeholder="Bus Number"/>
                        <BusNumberSVG />
                    </div>

                    <div className="box-border w-[450px] h-[48px] flex justify-between px-2 py-1 bg-black rounded-lg">
                        <input type="text" value={busNumberPlate}  onChange={(e)=>setBusNumberPlate(e.target.value)}  className=" bg-black text-white outline-none rounded-md px-4 py-2" placeholder="Bus Number Plate"/>
                        <BusNumberPlate />
                    </div>

                    <div className="box-border w-[450px] h-[48px] flex justify-between px-2 py-1 bg-black rounded-lg">
                        <input type="text" value={name}  className="bg-black text-white outline-none rounded-md px-4 py-2" onChange={(e)=>setName(e.target.value)} placeholder="Name"/>
                        <UserSVG />
                    </div>
                    
                    <div className="box-border w-[450px] h-[48px] flex justify-between px-2 py-1 bg-black rounded-lg">
                        <input type="text" value={contact}   className=" bg-black text-white outline-none rounded-md px-4 py-2"  onChange={(e)=>setContact(e.target.value)} placeholder="Contact No."/>
                        <ContactSVG />
                    </div>
    
                    <div className="box-border w-[450px] h-[48px] flex justify-between px-2 py-1 bg-black rounded-lg">
                        <input type={toggle} value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password"  className=" bg-black text-white outline-none rounded-md px-4 py-2"/>
                        <button onClick={viewPassword} className=" text-white">{toggle === "password"? <PasswordSVG />:<HidePasswordSVG />}</button>
                    </div>
        
                    <button className="px-4 py-2 rounded-lg text-white bg-blue-600" onClick={submitDetails}>Submit</button>
    
                    <h1 className="text-white">Already signed in <Link to={"/driver/login"}>Login</Link></h1>
                </div>

                <div>
                    
                </div>
            </div>
        </div>
        )
}


export default RegisterDriver;