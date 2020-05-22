import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: { 
  },
  item: {
    padding: '0 15px'
  }
}));
// clxs construye clasesname condicionalmente
const Others = props => {
  const { className, ...rest } = props;
  const classes = useStyles();
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        title= "Others"
      >
      </CardHeader>
      <CardContent></CardContent>
    </Card> 
  );
};

Others.propTypes = {
  className: PropTypes.string
};
export default Others;
