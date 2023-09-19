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
            <div className="top-0 left-0 bg-[#E80202] h-[50px] flex items-center justify-center space-x-20 text-white text-3xl">
                <Link to="/driver/dashboard">Home</Link>
                <Link to={`../driver/sendLocation/${id}`}>Monitor Location</Link>
                <Link to={`../driver/setStatus/${id}`}>Update Status</Link>
            </div>
            <div className="mt-10 flex flex-col justify-center items-center">
                <h1 className="text-white text-3xl font-bold text-center">Bus Details</h1>
                <div className="rounded-lg bg-[#E93F4B] w-[500px] h-[500px] flex flex-col justify-center items-center space-y-14">
    
                    <div className={" flex mt-[-35%] ml-[60%] gap-[5px]"}>
                        <h1>Status </h1>
                        <label htmlFor="toggle-example" className="flex items-center cursor-pointer relative mb-4">
                            <input type="checkbox" id="toggle-example" className="sr-only" onClick={changeStatus}/>
                                <div
                                    className="toggle-bg bg-[#FAD1D4] border-2 border-[#FAD1D4] h-6 w-[60px] rounded-full"></div>
                        </label>
                    </div>
                    <input type="text" value={name}  onChange={(e)=>setName(e.target.value)} placeholder="Enter Name"/>


                    <select value={route} onChange={(e) => setRoute(e.target.value)}>
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

                    <button onClick={submitDetails}>Set Details</button>
                    
                </div>
            </div>
            <ToastContainer />
        </div>
        )
}


export default BusStatus;