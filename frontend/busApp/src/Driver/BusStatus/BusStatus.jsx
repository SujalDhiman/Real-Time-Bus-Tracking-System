import {useCallback, useEffect, useState} from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import {axiosConfig, SERVER_URL} from "../../Constants/config"
import { toast,ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { toastPayload } from "../../Context/Assets";

function BusStatus()
{

    const navigate=useNavigate()
    const {id}=useParams()
    const [name,setName]=useState("")
    const [status,setStatus]=useState("")
    const [route, setRoute]=useState("")
    const [busRoutes, setBusRoutes]=useState([]);

    const changeStatus=useCallback(function (e)
    {
        if(e.target.id === "a")
            setStatus("active")
        else
            setStatus("notactive")
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
        <>
            <div className="mt-10 flex flex-col justify-center items-center">
                <h1 className="text-white text-3xl font-bold text-center">Bus Details</h1>
                <div className="rounded-lg bg-gray-700 w-[500px] flex flex-col justify-center items-center space-y-14">
    
                    <input type="text" value={name}  onChange={(e)=>setName(e.target.value)} placeholder="Enter Name"/>
    
                    <div>
                        <h1>Bus Status :- {status.toUpperCase()}</h1>
                        <button id="a" onClick={changeStatus}  className="px-2 py-2 bg-blue-600 text-white">Active</button>
                        <button id="na" onClick={changeStatus} className="px-2 py-2 bg-blue-600 text-white">Not Active</button>
                    </div>

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
        </>
        )
}


export default BusStatus;