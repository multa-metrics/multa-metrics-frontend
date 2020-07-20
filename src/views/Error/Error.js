import React from 'react';
import { Grid } from '@material-ui/core';
import Alert from "@material-ui/lab/Alert/Alert";

const Error = (props) => {

    return <Grid container>
        <Grid item xs={12}>
            <Alert variant="outlined" severity="error">
                {`${props.message} ${props.error}`}
            </Alert>
        </Grid>
    </Grid>
};

export default Error;
