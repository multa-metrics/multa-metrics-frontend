import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardActions,
  Divider,
  Typography,
  Button
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: { 
 
  },
  item: {
    padding: '0 15px', 
  }
}));
const Plan = (props) => {
  const { className,BoxPlans,...rest } = props;
  const classes = useStyles();
  const listex =  BoxPlans.text;

   return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader title={BoxPlans.title} />
      <Divider />
      <div className={classes.item} >
        {listex.map((item,index)=>
         <div key={index}>
           <Typography variant="h2" gutterBottom>
              {item}
           </Typography>
          </div>
        ) }
      </div>
      <Divider />  
      <CardActions style={{justifyContent: 'center'}}>
        <Button 
          variant="contained" 
          color="primary" 
          disabled={BoxPlans.UpgradePlan}
          href="https://devias.io/products/devias-kit-pro"
        >
          Upgrade
        </Button>
      </CardActions>  
    </Card>
  );
};

Plan.propTypes = {
  className: PropTypes.string
};
export default Plan;
