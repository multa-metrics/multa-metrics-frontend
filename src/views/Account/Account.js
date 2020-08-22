import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { Grid } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import { AccountDetails, Password } from "./components";
import { Auth } from "aws-amplify";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
  },
}));

const Account = (props) => {
  const classes = useStyles();
  const [isFetching, setIsFetching] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await Auth.currentAuthenticatedUser();
        setUser(res);
      } catch (e) {}

      setIsFetching(false);
    };

    fetchUser();
  }, []);

  return !isFetching ? (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item lg={7} md={6} xl={7} xs={12}>
          <AccountDetails history={props.history} value={user} />
        </Grid>
        <Grid item lg={5} md={6} xl={5} xs={12}>
          <Password value={user} />
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
