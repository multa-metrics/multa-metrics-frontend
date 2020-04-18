import palette from '../palette';
//no entiendo creo ke son cadenas indicando accion de usuario
//hover se usa para cuando uno se para encima(CSS)
//
export default {
  root: {
    '&$selected': {
      backgroundColor: palette.background.default
    },
    '&$hover': {
      '&:hover': {
        backgroundColor: palette.background.default
      }
    }
  }
};
