import React, {useState, useEffect} from "react";
import {makeStyles} from "@material-ui/styles";
import {Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import {Others} from "./components";
import {MaterialTableDemo, Pricing} from "./components";
import Container from "@material-ui/core/Container";

import _ from "lodash";

import axios from "axios";
import {useUser} from "../../context";
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

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {"Copyright © "}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

const Settings = () => {
    const classes = useStyles();
    const [plans, setPlans] = useState(null);
    const [users, setUsers] = useState(null);

    const {user} = useUser();

    useEffect(() => {
        const getPlans = () => {
            const endPoint = process.env.REACT_APP_API_BASE;
            const token = `Token ${user.signInUserSession.accessToken.jwtToken}`;

            axios({
                url: `${endPoint}plans/`,
                method: "get",
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            })
                .then((response) => {
                    setPlans(_.sortBy(response.data.results, ["index"]));
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        const getUsers = () => {
            const endPoint = process.env.REACT_APP_API_BASE;
            const token = `Token ${user.signInUserSession.accessToken.jwtToken}`;

            axios({
                url: `${endPoint}users/`,
                method: "get",
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            })
                .then((response) => {
                    setUsers(response.data.results);
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        if (user) {
            (async () => {
                await getUsers();
                await getPlans();
            })();
        }
    }, [user]);

    return (users && plans) ? (
        <Container>
            <div className={classes.root}>
                <Grid container spacing={4} align="center">
                    <Typography gutterBottom variant="h1" className={classes.root2}>
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
    )

};
export default Settings;
