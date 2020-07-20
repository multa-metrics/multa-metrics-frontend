import React, {useEffect, useState} from 'react';
import {Auth} from 'aws-amplify';
import * as axios from "axios";

export const StateContext = React.createContext(null);

export const AppStateProvider = ({children}) => {
    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [organizationInfo, setOrganizationInfo] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

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

    useEffect(() => {
        const getCurrentInfo = async () => {
            const endPoint = process.env.REACT_APP_API_BASE;
            const token = `Token ${localStorage.accessToken}`;

            try {
                const res = await axios({
                    url: `${endPoint}current-info/`,
                    method: "get",
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                });

                setOrganizationInfo(res.data.results.data.organizationInfo);
                setUserInfo(res.data.results.data.userInfo);

            } catch (error) {
                console.log(error);
            }

            setIsAuthenticating(false);
        };

        if(isAuthenticated){
            getCurrentInfo();
        }

    }, [isAuthenticated]);


    return <StateContext.Provider value={{isAuthenticating, isAuthenticated, setIsAuthenticated, organizationInfo, userInfo}}>{children}</StateContext.Provider>;
};

export const useAppState = () => {
    const context = React.useContext(StateContext);

    if (context === undefined) {
        throw new Error('`useAppState` hook must be used within a `appStateProvider` component');
    }
    return context;
};