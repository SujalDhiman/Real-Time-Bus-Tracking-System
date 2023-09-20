import {useCallback, useEffect, useState} from "react"
import {Link, useNavigate, useParams} from "react-router-dom"
import axios from "axios"
import {axiosConfig, SERVER_URL} from "../../Constants/config"
import { toast,ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { toastPayload } from "../../Context/Assets";
import './BusStatusStyles.css';

function BusStatus()
{

    const navigate=useNavigate()
    const {id}=useParams()
    const [name,setName]=useState("")
    const [status,setStatus]=useState("")
    const [route, setRoute]=useState("")
    const [busRoutes, setBusRoutes]=useState([]);

    const changeStatus=useCallback(function ()
    {
        setStatus((status === "active")?"notactive":"active");
    },[status])

    useEffect(() => {
        (async () => {
            const routes = await axios.get(`${SERVER_URL}/api/v1/busRoutes`, axiosConfig);
            console.log(routes);
            setBusRoutes(routes.data.routes);
        })();
    },[]);

    async function submitDetails (){

        if(name !== "" && status !== "" && route !== "")
        {
            let payload={
                "driver.name": name,
                route: route,
                busStatus:status
            }
            console.log(payload)
            console.log(`${SERVER_URL}/api/v1/bus/${id}`)
            const response=await axios.post(`${SERVER_URL}/api/v1/bus/${id}`,payload, axiosConfig)
            console.log(response)
            navigate("/driver/dashboard")
        }
        else
        {
            toast.error("Fill All Fields",toastPayload)
        }
    }

    return (
        <div className={"absolute top-0 left-0 bg-white w-full h-full"}>
            <div className="top-0 left-0 bg-[#E80202] h-[60px] flex items-center justify-center space-x-80 text-white text-3xl">
                <Link to="/driver/dashboard">Home</Link>
                <Link to={`../driver/sendLocation/${id}`}>Monitor Location</Link>
                <Link to={`../driver/setStatus/${id}`}><span className={"font-bold"}>Update Status</span></Link>
            </div>
            <div className="mt-10 flex flex-col justify-center items-center">
                <div className="rounded-[40px] bg-[#E93F4B] w-[500px] h-[500px] flex flex-col justify-center items-center gap-[50px]">
    
                    <div className={" flex mt-[-20%] ml-[60%] gap-[5px]"}>
                        <h1>Status </h1>
                        <label htmlFor="toggle-example" className="flex items-center cursor-pointer relative mb-4">
                            <input type="checkbox" id="toggle-example" className="sr-only" onClick={changeStatus}/>
                                <div
                                    className="toggle-bg bg-[#FAD1D4] border-2 border-[#FAD1D4] h-6 w-[60px] rounded-full"></div>
                        </label>
                    </div>
                    <input className={"text-black w-[70%] h-[40px] rounded-[12px] p-3"} type="text" value={name}  onChange={(e)=>setName(e.target.value)} placeholder="Name"/>


                    <select className={"w-[70%] h-[40px] rounded-[12px] p-2"} value={route} onChange={(e) => setRoute(e.target.value)}>
                        <option>Select Route</option>
                        {
                            (() => {
                                if(busRoutes) {
                                    return busRoutes.map((route) => {
                                        return (<option value={route._id}>{route.routeName}</option>);
                                    })
                                } else {
                                    return <option>loading</option>
                                }
                            })()
                        }
                    </select>


                    {/*<input type="text" value={destinationPoint}  onChange={(e)=>setDestinationPoint(e.target.value)} placeholder="Enter Destination Point"/>*/}

                    <button className={"absolute mt-[22%] w-[150px] h-[40px] border-2 rounded-[12px] bg-[#E01A27] text-white"} onClick={submitDetails}>Set Details</button>
                    
                </div>
            </div>
            <ToastContainer />
        </div>
        )
}


export default BusStatus;