import { createMuiTheme } from '@material-ui/core';//para poder customizar el theme

import palette from './palette';// estos archivos son creados modificando los mienbros de theme en material_ui
import typography from './typography';
import overrides from './overrides';
//de index se utilizan pocos elementos por lo ke customiza en el mismo index


const theme = createMuiTheme({// Crea un tema con estos estilos
  palette,
  typography,
  overrides,
  zIndex: {
    appBar: 1200,
    drawer: 1100
  }
});

export default theme;
