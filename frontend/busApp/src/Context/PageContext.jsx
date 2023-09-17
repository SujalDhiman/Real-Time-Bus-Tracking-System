import { createContext,useState } from "react";

export const PageContext=createContext()


const PageContextProvider=({children})=>{

    const [page,setPage]=useState("Register")
    return (
        <PageContext.Provider value={{page,setPage}}>{children}</PageContext.Provider>
    )
}

export default PageContextProvider;