import {Link} from "react-router-dom";


function TypeOfUser()
{
    return (
        <>
                <h1 style={{color: "white"}}><Link to={"/driver/registerDriver/"}>DRIVER</Link></h1>
                <h1 style={{color: "white"}}><Link to={"/user/lookupVehicle/"}>USER</Link></h1>
        </>
    )
}

export default TypeOfUser;