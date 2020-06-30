import React, {useEffect, useState} from 'react';
import {Auth} from 'aws-amplify';

// Create a context that will hold the values that we are going to expose to our components.
// Don't worry about the `null` value. It's gonna be *instantly* overriden by the component below
export const UserContext = React.createContext(null);

// Create a "controller" component that will calculate all the data that we need to give to our
// components bellow via the `UserContext.Provider` component. This is where the Amplify will be
// mapped to a different interface, the one that we are going to expose to the rest of the app.
export const UserProvider = ({children}) => {
    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const [isAuthenticated, userHasAuthenticated] = useState(false);

    useEffect(() => {
        const initState = async () => {
            try {
                const currentSession = await Auth.currentSession();
                const credentials = await Auth.currentUserCredentials();

                userHasAuthenticated(true);

                localStorage.setItem("idToken", currentSession.idToken.jwtToken);
                localStorage.setItem("accessToken", currentSession.accessToken.jwtToken);
                localStorage.setItem("refreshToken", currentSession.refreshToken.token);

                localStorage.setItem("accessKeyId", credentials.accessKeyId);
                localStorage.setItem("secretAccessKey", credentials.secretAccessKey);
                localStorage.setItem("identityId", credentials.identityId);
                localStorage.setItem("sessionToken", credentials.sessionToken);

            }catch (e) {
            }

            setIsAuthenticating(false);
        };

        initState()
    }, [])


    // React.useEffect(async () => {
    //
    //     // Configure the keys needed for the Auth module. Essentially this is
    //     // like calling `Amplify.configure` but only for `Auth`.
    //     // Auth.configure({
    //     //     // ...
    //     // });
    //
    //     // attempt to fetch the info of the user that was already logged in
    //     try {
    //         const res = await Auth.currentAuthenticatedUser();
    //         const token = res.signInUserSession.idToken.jwtToken;
    //         setUser(res);
    //         setTokenId(token)
    //     }
    //     catch {
    //         setUser(null);
    //     }
    // }, []);

    // We make sure to handle the user update here, but return the resolve value in order for our components to be
    // able to chain additional `.then()` logic. Additionally, we `.catch` the error and "enhance it" by providing
    // a message that our React components can use.
    // const login = (usernameOrEmail, password) =>
    //     Auth.signIn(usernameOrEmail, password)
    //         .then(cognitoUser => {
    //             setUser(cognitoUser);
    //             return cognitoUser;
    //         })
    //         .catch((err) => {
    //             if (err.code === 'UserNotFoundException') {
    //                 err.message = 'Invalid username or password';
    //             }
    //
    //             // ... (other checks)
    //
    //             throw err;
    //         });

    // same thing here
    // const logout = () =>
    //     Auth.signOut().then(data => {
    //         setUser(null);
    //         return data;
    //     });

    // Make sure to not force a re-render on the components that are reading these values,
    // unless the `user` value has changed. This is an optimisation that is mostly needed in cases
    // where the parent of the current component re-renders and thus the current component is forced
    // to re-render as well. If it does, we want to make sure to give the `UserContext.Provider` the
    // same value as long as the user data is the same. If you have multiple other "controller"
    // components or Providers above this component, then this will be a performance booster.
    // const values = React.useMemo(() => ({ user, login, logout, tokenId }), [user, tokenId]);

    // Finally, return the interface that we want to expose to our other components
    return <UserContext.Provider value={{isAuthenticating, isAuthenticated, userHasAuthenticated}}>{children}</UserContext.Provider>;
};

// We also create a simple custom hook to read these values from. We want our React components
// to know as little as possible on how everything is handled, so we are not only abtracting them from
// the fact that we are using React's context, but we also skip some imports.
export const useUser = () => {
    const context = React.useContext(UserContext);

    if (context === undefined) {
        throw new Error('`useUser` hook must be used within a `UserProvider` component');
    }
    return context;
};