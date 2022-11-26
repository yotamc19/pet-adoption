import { useState } from "react";
import { createContext, useContext } from "react";

export const SearchContext = createContext();

export const useSearchContext = () => {
    return useContext(SearchContext);
}

const SearchContextProvider = ({ children }) => {
    const [search, setSearch] = useState({
        type: '', 
        name: '', 
        adopStatus: '', 
        minHeight: '', 
        minWeight: '', 
    });

    const changeSearch = (newObj) => {
        setSearch(newObj);
    }

    return (
        <SearchContext.Provider value={{ search, changeSearch }} >
            {children}
        </SearchContext.Provider >
    )
}

export default SearchContextProvider;