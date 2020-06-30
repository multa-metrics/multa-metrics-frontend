import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { Grid } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import { AccountProfile, AccountDetails } from "./components";
import {Auth} from 'aws-amplify';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
  },
}));

const Account = () => {
  const classes = useStyles();
  const [isFetching, setIsFetching] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
        try {
            const res = await Auth.currentAuthenticatedUser();
            setUser(res);

        }catch (e) {

        }

        setIsFetching(false);
    };

    fetchUser();
  }, []);


  return (!isFetching) ? (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item lg={4} md={6} xl={4} xs={12}>
          <AccountProfile value={user}/>
        </Grid>
        <Grid item lg={8} md={6} xl={8} xs={12}>
          <AccountDetails value={user}/>
        </Grid>
      </Grid>
    </div>
  ) : (
    <div className={classes.root2}>
      <LinearProgress />
    </div>
  );
};

export default Account;
