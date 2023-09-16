import {useState,useEffect,useContext} from "react"
import { SocketContext } from "../../Context/SocketContext";
import { Link } from "react-router-dom";

function BusDashboard()
{

    const {socket,busId,setBusId}=useContext(SocketContext)
    console.log(busId)
    return (
        <div className="mt-20 flex items-center justify-center space-x-20 text-white text-3xl">
            <Link to="/driver/dashboard">Home</Link>
            <Link to={`/driver/sendLocation/${busId}`}>Monitor Location</Link>
            <Link to="#">Update Status</Link>
        </div>
    )
}


export default BusDashboard;