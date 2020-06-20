import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { Grid } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import { useUser } from "../../context";
import { AccountProfile, AccountDetails } from "./components";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
  },
}));

const Account = () => {
  const classes = useStyles();
  const [isFetching, setIsFetching] = useState(true);
  const { isLoading } = useUser();

  useEffect(() => {
    if (!isLoading) {
      setIsFetching(false);
    }
  }, [isLoading]);

  return !isFetching ? (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item lg={4} md={6} xl={4} xs={12}>
          <AccountProfile />
        </Grid>
        <Grid item lg={8} md={6} xl={8} xs={12}>
          <AccountDetails />
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
