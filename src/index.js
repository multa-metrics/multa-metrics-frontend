//arranca la aplicacion react 
import React from 'react';
import ReactDOM from 'react-dom';//para usar react en web

import * as serviceWorker from './serviceWorker';// brinda caracteristicas al sitio como si fuera una app(deja cosas en la cache  (Offline))
import App from './App';


ReactDOM.render(<App/>, document.getElementById('root')); // pinta en pantalla con render el componente base que es donde esta todo.Y lo pinta en root

serviceWorker.unregister();
