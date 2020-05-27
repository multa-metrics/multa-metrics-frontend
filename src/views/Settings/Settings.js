import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';

import axios from "axios";
import {Others} from './components';
import {Plan, MaterialTableDemo, Pricing } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  root2: {
    maxWidth: 500,
    padding: theme.spacing(1),
    
  },
}));

const LeftBox = {
  title:'Plan1',
  text:['Condicion #1','Condicion #2','Condicion #3'],
  UpgradePlan: true
}
const RightBox = {
  title:'Plan2',
  text:['Condicion #4','Condicion #5','Condicion #6'],
  UpgradePlan:false
}


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const Settings = () => {
  const classes = useStyles();
  
  React.useEffect( ()=> {
      getPlans()
  },[])

  const getPlans = () =>{
    //const endPoint = process.env.REACT_APP_API_BASE ;
    axios({
      //url:'https://2qoob0tpqb.execute-api.us-east-1.amazonaws.com/prod/plans/',
      //url: `${endPoint}plans/`,
      method:'get',
      headers: {
        'Authorization': 'Token Test',
        'Content-Type': 'application/json'
      }
    }).then(response => {
      return response.data
    }).then(data => {
      //AddConditionsPlansApi(data.results)
      //console.log(data);  
    }).catch(err => {     
      console.log(err)
    });
  }
  //const AddConditionsPlansApi=(conditions)=>{
//
  //  conditions.map((item)=>{
  //    const data =
  //  }
  //  
  //  ))
//
  //}
  return (
    <div  className={classes.root}>
      <Grid 
        container
        spacing={4}
        align="center"       
      >
        <Typography gutterBottom   variant='h1' className={classes.root2}>
          Plans
          
        </Typography>
        <Grid
          item
          md={12}
          xs={12}
        >
          <Pricing/>
        </Grid>
        <Grid
          item
          md={12}
          xs={12}
        >
          <MaterialTableDemo />
        </Grid>
        <Grid
          item
          md={12}
          xs={12}
       >  
          <Others/> 
        </Grid >
        <Grid >
          <Box align = "center" mt={5}>
            <Copyright />
          </Box>

        </Grid>
        
      </Grid>
    </div>
  );
};
export default Settings;
