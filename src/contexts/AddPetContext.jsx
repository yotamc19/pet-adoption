import { useState } from "react";
import { createContext, useContext } from "react";

export const AddPetContext = createContext();

export const useAddPetContext = () => {
    return useContext(AddPetContext);
}

const AddPetContextProvider = ({ children }) => {
    const [values, setValues] = useState({
        name: '',
        type: '',
        color: '',
        breed: '',
        weight: '',
        height: '',
        hypo: '',
        dietery: '',
        bio: '',
    });
    const [updateMode, setUpdateMode] = useState(false);
    const [petImage, setPetImage] = useState(null);
    const [updatedPetId, setUpdatedPetId] = useState('');

    return (
        <AddPetContext.Provider value={{ values, setValues, updateMode, setUpdateMode, petImage, setPetImage, updatedPetId, setUpdatedPetId }} >
            {children}
        </AddPetContext.Provider >
    )
}

export default AddPetContextProvider;