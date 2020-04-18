import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  content: {
    paddingTop: 150,
    textAlign: 'center'
  },
  image: {
    marginTop: 50,
    display: 'inline-block',
    maxWidth: '100%',
    width: 560
  }
}));

const Rules = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid
        container
        justify="center"
        spacing={4}
      >
        <Grid
          item
          lg={6}
          xs={12}
        >
          <div className={classes.content}>
            <Typography variant="h1">
              La_37: Here are the different Rules
            </Typography>
            <Typography variant="subtitle2">
              Rules
            </Typography>
            <img
              alt="Under development"
              className={classes.image}
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSm1COSFZ8f0HlN_k6TiBxHmxlKI4iEZQIZDzx4A2wueLQUarYU226PdRRnnC1mZ8k-68_rnx-X&usqp=CAc"
            />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Rules;
