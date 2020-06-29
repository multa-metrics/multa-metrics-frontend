import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import PropTypes from 'prop-types';
import { useUser } from "../../context";

const RouteWithLayout = props => {
    const {layout: Layout, component: Component, ...rest} = props;
    const { isAuthenticating, isAuthenticated } = useUser();

    return !isAuthenticating && (isAuthenticated ? <Route
        {...rest}
        render={matchProps => (
            <Layout>
                <Component {...matchProps} />
            </Layout>
        )}
    /> : <Redirect to="/sign-in"/>)
};

RouteWithLayout.propTypes = {
    component: PropTypes.any.isRequired,
    layout: PropTypes.any.isRequired,
    path: PropTypes.string
};

export default RouteWithLayout;
