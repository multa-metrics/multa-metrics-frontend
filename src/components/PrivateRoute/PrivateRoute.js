import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import {useAppState} from "../../state/stateContext";

const PrivateRoute = props => {
    const {children, ...rest} = props;
    const { isAuthenticating, isAuthenticated } = useAppState();

    return !isAuthenticating && (isAuthenticated ? <Route
        {...rest}
        render={() => (
            children
        )}
    /> : <Redirect to="/sign-in"/>)
};

export default PrivateRoute;
