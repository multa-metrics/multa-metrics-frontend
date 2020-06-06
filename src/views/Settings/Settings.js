import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import {Others} from './components';
import {MaterialTableDemo, Pricing } from './components';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0)
  },
  root2: {
    maxWidth: 500,
    padding: theme.spacing(4),
    align : "center",
    
  },
}));


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
  
 
  return (
    <Container>
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
            <Box mt={5}>
              <Copyright />
            </Box>

          </Grid>
          
        </Grid>
      </div>
    </Container>
  );
};
export default Settings;
