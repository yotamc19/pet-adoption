import { useState } from "react";
import { createContext, useContext } from "react";

export const ModalsContext = createContext();

export const useModalsContext = () => {
    return useContext(ModalsContext);
}

const ModalsContextProvider = ({ children }) => {
    const [showSignup, setShowSignup] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [userDetails, setUserDetails] = useState({
        email: '',
        password: '',
        repassword: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
    });
    const [errors, setErrors] = useState({
        email: {
            error: false,
            helperText: '',
        },
        password: {
            error: false,
            helperText: '',
        },
        repassword: {
            error: false,
        },
        firstName: {
            error: false,
            helperText: '',
        },
        lastName: {
            error: false,
            helperText: '',
        },
        phoneNumber: {
            error: false,
            helperText: '',
        },
    });

    const toggleSignup = (flag) => {
        if (!flag) {
            setUserDetails({
                email: '',
                password: '',
                repassword: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
            });
            setErrors({
                email: {
                    error: false,
                    helperText: '',
                },
                password: {
                    error: false,
                    helperText: '',
                },
                repassword: {
                    error: false,
                },
                firstName: {
                    error: false,
                    helperText: '',
                },
                lastName: {
                    error: false,
                    helperText: '',
                },
                phoneNumber: {
                    error: false,
                    helperText: '',
                },
            });
        }
        setShowSignup(flag);
    }

    const toggleLogin = (flag) => {
        if (!flag) {
            setUserDetails({
                email: '',
                password: '',
                repassword: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
            });
            setErrors({
                email: {
                    error: false,
                    helperText: '',
                },
                password: {
                    error: false,
                    helperText: '',
                },
                repassword: {
                    error: false,
                },
                firstName: {
                    error: false,
                    helperText: '',
                },
                lastName: {
                    error: false,
                    helperText: '',
                },
                phoneNumber: {
                    error: false,
                    helperText: '',
                },
            });
        }
        setShowLogin(flag);
    }

    return (
        <ModalsContext.Provider value={{ showSignup, toggleSignup, showLogin, toggleLogin, userDetails, setUserDetails, errors, setErrors }} >
            {children}
        </ModalsContext.Provider >
    )
}

export default ModalsContextProvider;