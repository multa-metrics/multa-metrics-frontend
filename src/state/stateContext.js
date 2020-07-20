import React, {useEffect, useState} from 'react';
import {Auth} from 'aws-amplify';

export const StateContext = React.createContext(null);

export const AppStateProvider = ({children}) => {
    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const initState = async () => {
            try {
                const currentSession = await Auth.currentSession();
                const credentials = await Auth.currentUserCredentials();

                setIsAuthenticated(true);

                localStorage.setItem("idToken", currentSession.idToken.jwtToken);
                localStorage.setItem("accessToken", currentSession.accessToken.jwtToken);
                localStorage.setItem("refreshToken", currentSession.refreshToken.token);

                localStorage.setItem("accessKeyId", credentials.accessKeyId);
                localStorage.setItem("secretAccessKey", credentials.secretAccessKey);
                localStorage.setItem("identityId", credentials.identityId);
                localStorage.setItem("sessionToken", credentials.sessionToken);

                setIsAuthenticating(false);
            }catch (e) {
                setIsAuthenticating(false);
            }
        };

        initState();
    }, []);


    return <StateContext.Provider value={{isAuthenticating, isAuthenticated, setIsAuthenticated}}>{children}</StateContext.Provider>;
};

export const useAppState = () => {
    const context = React.useContext(StateContext);

    if (context === undefined) {
        throw new Error('`useAppState` hook must be used within a `appStateProvider` component');
    }
    return context;
};