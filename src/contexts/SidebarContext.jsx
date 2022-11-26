import { useState } from "react";
import { createContext, useContext } from "react";

export const SidebarContext = createContext();

export const useSidebarContext = () => {
    return useContext(SidebarContext);
}

const SidebarContextProvider = ({ children }) => {
    const [sidebarStatus, setSidebarStatus] = useState(false);

    const toggleSidebar = (flag) => {
        setSidebarStatus(flag);
    }

    return (
        <SidebarContext.Provider value={{ sidebarStatus, toggleSidebar }} >
            {children}
        </SidebarContext.Provider >
    )
}

export default SidebarContextProvider;