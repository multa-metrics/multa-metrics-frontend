import React, {useState} from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import StarIcon from '@material-ui/icons/StarBorder';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';



import axios from "axios";
import {useUser} from "../../../../context";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";


const useStyles = makeStyles((theme) => ({
  
  root: {
    width: '100%',
    maxWidth: 500,
  },

  cardHeader: {
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
  },

}));


const Pricing = () => {

  const [currentPlan] = React.useState('Professional');
  const [state, setState] = React.useState([]);
    const { user, isLoading } = useUser();
    const [ isFetching, setIsFetching ] = useState(false);
  
  React.useEffect( ()=> {
      if(!isLoading) {
          getPlans()
      }
  },[isLoading])
  
  const getPlans = () =>{
    setIsFetching(true);
  const endPoint = process.env.REACT_APP_API_BASE;
  const token = `Token ${user.signInUserSession.idToken.jwtToken}`;
  axios({
    url: `${endPoint}plans/`,
    method:'get',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    }
  }).then(response => {
      setIsFetching(false);
    setState(response.data.results)
  }).catch(err => {
      setIsFetching(false);
    console.log(err)
  });
  }
 
  const classes = useStyles();

  return (
      (!isFetching ? <React.Fragment>
      <CssBaseline />      
      <Grid container spacing={2} alignItems="flex-end" justify="space-between">      
        {state && state.map((tier,item) => (      
          <Grid item key={item} xs={12} sm={6} md={3}>
            <Card>
              <CardHeader
                title={tier.name}
                titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{ align: 'center' }}
                action={tier.name === currentPlan ? <StarIcon /> : null}
                className={classes.cardHeader}
              />
              <CardContent>
                <div className={classes.cardPricing}>
                  <Typography variant="h4" color="textPrimary">
                    ${tier.price.monthly}
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    /mo
                  </Typography>
                </div>
                <div className={classes.cardPricing}>
                  <Typography  variant="h4" color="textPrimary">
                    ${tier.price.yearly}
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    /year
                  </Typography>
                </div>
                <div >

                  <Typography variant="h6" component="li" gutterBottom >
                    Number of Agents: {tier.conditions.numberOfAgents}
                  </Typography>
                  <Typography variant="h6" component="li" gutterBottom >
                  Maximum Data Storage Days: {tier.conditions.maximumDataStorageDays}
                  </Typography>
                  <Typography variant="h6" component="li" gutterBottom >
                  Number of Users: {tier.conditions.numberOfUsers}
                  </Typography>
                  <Typography variant="h6" component="li" gutterBottom >
                  Number of Queries: {tier.conditions.numberOfQueries}
                  </Typography>
                </div>
              </CardContent>
              <CardActions>
                <Button 
                  fullWidth 
                  disabled={tier.name === currentPlan }
                  variant = 'contained' 
                  color="primary">
                  {'Change'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </React.Fragment>: <CircularProgress />)
  );
}
export default Pricing ;