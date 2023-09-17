import { Header } from "./Header.jsx";
import {Link, Outlet} from "react-router-dom";
import SocketProvider from "./Context/SocketContext";
import PageContextProvider from "./utilityFunctions/PageContext.jsx";


function App()
{
    return (
      <>
      <SocketProvider>
        <PageContextProvider>
          <Outlet />
        </PageContextProvider>
      </SocketProvider>
      </>
    )
}

export default App;