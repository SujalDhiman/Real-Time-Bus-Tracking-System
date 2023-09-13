import { Header } from "./Header.jsx";
import {Link, Outlet} from "react-router-dom";
import SocketProvider from "./Context/SocketContext";


function App()
{
    return (
      <>
      <SocketProvider>
        <Header />
          <Outlet />
      </SocketProvider>
      </>
    )
}

export default App;