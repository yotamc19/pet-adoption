import { useState } from "react";
import { createContext, useContext } from "react";

export const DashboardContext = createContext();

export const useDashboardContext = () => {
    return useContext(DashboardContext);
}

const DashboardContextProvider = ({ children }) => {
    const [showPetsList, setShowPetsList] = useState(false);
    const [usersList, setUsersList] = useState([]);

    return (
        <DashboardContext.Provider value={{ showPetsList, setShowPetsList, usersList, setUsersList }} >
            {children}
        </DashboardContext.Provider >
    )
}

export default DashboardContextProvider;