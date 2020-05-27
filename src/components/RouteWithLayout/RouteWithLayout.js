import React, {useEffect, useState} from 'react';
import {Redirect, Route} from 'react-router-dom';
import PropTypes from 'prop-types';
import {Auth} from 'aws-amplify'

const RouteWithLayout = props => {
    const {layout: Layout, component: Component, ...rest} = props;
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        Auth.currentAuthenticatedUser().then(() => {
            setIsAuthenticated(true);
            setIsLoading(false);
        }).catch(() => {
            setIsLoading(false);
        })
    }, [])

    if (isLoading) {
        return <div>Loading...</div>
    }
    if (!isAuthenticated) {
        return <Redirect to="/sign-in"/>
    }
    return <Route
        {...rest}
        render={matchProps => (
            <Layout>
                <Component {...matchProps} />
            </Layout>
        )}
    />
};

RouteWithLayout.propTypes = {
    component: PropTypes.any.isRequired,
    layout: PropTypes.any.isRequired,
    path: PropTypes.string
};

export default RouteWithLayout;
