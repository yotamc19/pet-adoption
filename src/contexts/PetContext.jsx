import { createContext, useContext, useState } from "react";

export const PetContext = createContext();

export const usePetContext = () => {
    return useContext(PetContext);
}

const PetContextProvider = ({ children }) => {
    const [petsList, setPetsList] = useState([]);
    const [currentPet, setCurrentPet] = useState({
        type: '',
        name: '',
        adopStatus: '',
        height: '',
        weight: '',
        color: '',
        hypo: '',
        dietery: '',
        breed: '',
        bio: '',
    });
    const [savedPets, setSavedPets] = useState([]);
    const [showPetsAtHome, setShowPetsAtHome] = useState(false);
    const [saveButtonTxt, setSaveButtonTxt] = useState('Save');

    return (
        <PetContext.Provider value={{ petsList, setPetsList, currentPet, setCurrentPet, savedPets, setSavedPets, showPetsAtHome, setShowPetsAtHome, saveButtonTxt, setSaveButtonTxt }} >
            {children}
        </PetContext.Provider >
    )
}

export default PetContextProvider;