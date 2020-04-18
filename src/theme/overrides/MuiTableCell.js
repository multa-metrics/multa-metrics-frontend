import palette from '../palette';
import typography from '../typography';
// se utiliza el operador de propagacion para traer todas as caracteristicas
//del body1 y pasarsela a root
export default {
  root: {
    ...typography.body1,
    borderBottom: `1px solid ${palette.divider}`
  
  }
};
// $ se usa para convertir una props en string
//no encuentro divider
//border-bottom(grosor, estilo y color del borde inferior de un elemento)