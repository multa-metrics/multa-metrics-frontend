import React, {useState, useEffect} from "react";
import {makeStyles} from "@material-ui/styles";
import {Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {MaterialTableDemo, Pricing} from "./components";
import Container from "@material-ui/core/Container";

import _ from "lodash";
import axios from "axios";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(0),
    },
    root2: {
        maxWidth: 500,
        padding: theme.spacing(4),
        align: "center",
    },
}));

const Settings = () => {
    const classes = useStyles();
    const [plans, setPlans] = useState(null);
    const [users, setUsers] = useState(null);

    useEffect(() => {
        const endPoint = process.env.REACT_APP_API_BASE;
        const token = `Token ${localStorage.accessToken}`;

        const getPlans = async () => {
            try {
                const res = await axios({
                    url: `${endPoint}plans/`,
                    method: "get",
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                });
                setPlans(_.sortBy(res.data.results, ["index"]));
            } catch (error) {
                console.log(error);
            }
        };

        const getUsers = async () => {
            try {
                const res = await axios({
                    url: `${endPoint}users/`,
                    method: "get",
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                });
                setUsers(res.data.results);
            } catch (error) {
                console.log(error);
            }
        };

            getUsers();
            getPlans();
    }, []);

    return users && plans ? (
        <Container>
            <div className={classes.root}>
                <Grid container spacing={4} align="center">
                    <Typography
                        gutterBottom
                        variant="h1"
                        className={classes.root2}>
                    </Typography>
                    <Grid item md={12} xs={12}>
                        <Pricing value={plans}/>
                    </Grid>
                    <Grid item md={12} xs={12}>
                        <MaterialTableDemo value={users}/>
                    </Grid>
                </Grid>
            </div>
        </Container>
    ) : (
        <LinearProgress color="primary"/>
    );
};
export default Settings;
