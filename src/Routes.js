import React from "react";
import {Switch, Redirect, Route} from "react-router-dom";

import {RouteWithLayout} from "./components";
import {Main as MainLayout, Minimal as MinimalLayout} from "./layouts";

import {Password} from "./views/Account/components";

import {
    Dashboard as DashboardView,
    Settings as SettingsView,
    SignUp as SignUpView,
    SignIn as SignInView,
    NotFound as NotFoundView,
    Devices as DevicesView,
    Rules as RulesView,
    ResetPassword as ResetPasswordView,
    Account as AccountView,
} from "./views";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";

const Routes = ({history}) => {
    return (
        <Switch>
            <Redirect exact from="/" to="/dashboard"/>
            <PrivateRoute path="/dashboard">
                <RouteWithLayout
                    component={DashboardView}
                    exact
                    history={history}
                    layout={MainLayout}
                />
            </PrivateRoute>
            <PrivateRoute path="/devices">
                <RouteWithLayout
                    component={DevicesView}
                    exact
                    history={history}
                    layout={MainLayout}
                />
            </PrivateRoute>
            <PrivateRoute path="/rules">
                <RouteWithLayout
                    component={RulesView}
                    exact
                    history={history}
                    layout={MainLayout}
                />
            </PrivateRoute>
            <PrivateRoute path="/settings">
                <RouteWithLayout
                    component={SettingsView}
                    exact
                    history={history}
                    layout={MainLayout}
                />
            </PrivateRoute>
            <PrivateRoute path="/account">
                <RouteWithLayout
                    component={AccountView}
                    exact
                    history={history}
                    layout={MainLayout}
                />
            </PrivateRoute>
            <Route
                component={SignUpView}
                exact
                layout={MinimalLayout}
                path="/sign-up"
            />
            <Route
                component={SignInView}
                exact
                layout={MinimalLayout}
                path="/sign-in"
            />
            <Route
                component={Password}
                exact
                layout={MainLayout}
                path="/password"
            />
            <Route
                component={ResetPasswordView}
                exact
                layout={MinimalLayout}
                path="/reset-password"
            />
            <Route
                component={NotFoundView}
                exact
                layout={MinimalLayout}
                path="/not-found"
            />
            <Redirect to="/not-found"/>
        </Switch>
    );
};

export default Routes;
