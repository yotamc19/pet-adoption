import { useState } from "react";
import { createContext, useContext } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => {
    return useContext(AuthContext);
}

const AuthContextProvider = ({ children }) => {
    const [usersList, setUsersList] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    //loggedUser keeps all the data about the currently logged user
    const [loggedUser, setLoggedUser] = useState({
        id: '', 
        email: '',
        firstName: '',
        lastName: '', 
        phoneNumber: '',
        savedPets: [],
        isAdmin: false,
    });
    //profileDetails is just for the profile page updating values
    const [profileDetails, setProfileDetails] = useState({
        email: '',
        phoneNumber: '',
        firstName: '',
        lastName: '',
    });
    const [showAlert, setShowAlert] = useState(false);

    const addUser = (newUser) => {
        const newList = [newUser, ...usersList];
        setUsersList(newList);
    }

    const toggleLoginState = (flag) => {
        setIsLoggedIn(flag);
    }

    const changeLoggedUser = (newUser) => {
        setLoggedUser(newUser);
    }

    const changeProfileDetails = (newProfile) => {
        setProfileDetails(newProfile);
    }

    const validateEmail = async (email) => {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
    }

    const validatePassword = (password, repassword) => {
        if (password === repassword) {
            if (password.length > 5) {
                return {
                    passwordFlag: true,
                    txtPass: '',
                };
            } else {
                return {
                    passwordFlag: false,
                    txtPass: 'Password must be at leat 6 chars'
                };
            }
        }
        return {
            passwordFlag: false,
            txtPass: 'Passwords do not match'
        };
    }

    const validateFirstName = (firstName) => {
        if (firstName.length > 0) {
            return true;
        }
        return false;
    }

    const validateLastName = (lastName) => {
        if (lastName.length > 0) {
            return true;
        }
        return false;
    }

    const validatePhoneNumber = (phoneNumber) => {
        if (/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/.test(phoneNumber)) {
            return true;
        }
        return false;
    }

    const toggleShowAlert = (flag) => {
        setShowAlert(flag);
    }

    return (
        <AuthContext.Provider value={{ usersList, addUser, isLoggedIn, toggleLoginState, loggedUser, changeLoggedUser, profileDetails, changeProfileDetails, validateEmail, validatePassword, validateFirstName, validateLastName, validatePhoneNumber, showAlert, toggleShowAlert }} >
            {children}
        </AuthContext.Provider >
    )
}

export default AuthContextProvider;