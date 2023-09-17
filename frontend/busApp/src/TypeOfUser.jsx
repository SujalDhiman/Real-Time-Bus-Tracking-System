import {Link} from "react-router-dom";
import busStop from "../public/bus-stop.png";

function ChatBot(){
    return  (
     <df-messenger
        intent="WELCOME"
     agent-id="d4bf08d1-af6b-47bc-af2d-953093470fab"
     language-code="en"
     placeholder-text="Ask something"
     bot-writing-text="Just a minute"
     chat-title="NAMSKARAM-Vehicle Tracking Chatbot Assistant"
     chat-icon={busStop}
     ></df-messenger>
   )
}

function TypeOfUser()
{
    return (
        <>
                <h1 style={{color: "white"}}><Link to={"/driver/RegisterDriver/"}>DRIVER</Link></h1>
                <h1 style={{color: "white"}}><Link to={"/user/lookupVehicle/"}>USER</Link></h1>
                <ChatBot/>
        </>
    )
}

export default TypeOfUser;