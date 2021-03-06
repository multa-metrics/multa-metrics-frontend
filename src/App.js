// package.json=Informcion importante sobre el nombre y version de nuestro proyecto,dependencias ke usa y script
//package-lock.json=funcionamientointerno escoje ke modulos utilizar
import React, {Component} from 'react';
import {Router} from 'react-router-dom'; //importa enrutadores para simular navegacion en la pagina
import {createBrowserHistory} from 'history';//dependencia de reac routers.Nos brinda el esatado de ubicacion
import {Chart} from 'react-chartjs-2';//componente de la dependencia para crear graficos
import {ThemeProvider} from '@material-ui/styles';//aplicar temas a los hijos o a lo ke encierra
import validate from 'validate.js';

import {chartjs} from './helpers';//
import theme from './theme';// importo el theme que cree (no es mas ke el css de la aplicacion)
import 'react-perfect-scrollbar/dist/css/styles.css';
import './assets/scss/index.scss';
import validators from './common/validators';
import Routes from './Routes';
import Amplify from 'aws-amplify';
import {AppStateProvider} from "./state/stateContext";

Amplify.configure({
    Auth: {
        identityPoolId: process.env.REACT_APP_AWS_IDENTITY_POOL_ID,
        region: process.env.REACT_APP_AWS_COGNITO_REGION,
        userPoolId: process.env.REACT_APP_AWS_USER_POOLS_ID,
        userPoolWebClientId: process.env.REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID,
        mandatorySignIn: true,
    }
});

const browserHistory = createBrowserHistory();

Chart.helpers.extend(Chart.elements.Rectangle.prototype, {
    draw: chartjs.draw
});

validate.validators = {
    ...validate.validators,
    ...validators
};

// el ThemeProvider le da estilo a todo lo ke contiene en este caso a toda la paginas
export default class App extends Component {  //esto se puede escribir mediante una funcion flecha,mediante un funcion normal y mediante una clases ke extienda react.component
    render() {
        return (
            <ThemeProvider theme={theme}>
                <Router history={browserHistory}>
                    <AppStateProvider>
                        <Routes/>
                    </AppStateProvider>
                </Router>
            </ThemeProvider>
        );
    }
}

