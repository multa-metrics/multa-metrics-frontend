import React, {useState} from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/styles";
import {AppBar, Toolbar, Badge, Hidden, IconButton} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import InputIcon from "@material-ui/icons/Input";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import {Auth} from "aws-amplify";

const useStyles = makeStyles((theme) => ({
    root: {
        boxShadow: "none",
    },
    flexGrow: {
        flexGrow: 1,
    },
    signOutButton: {
        marginLeft: theme.spacing(1),
    },
}));

const Topbar = (props) => {
    const {className, onSidebarOpen, history, ...rest} = props;
    const classes = useStyles();
    const [notifications] = useState([]);

    const handleSignOut = async (event) => {
        event.preventDefault();

        Auth.signOut({global: true})
            .then(() => {
                localStorage.removeItem("idToken");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("accessKeyId");
                localStorage.removeItem("secretAccessKey");
                localStorage.removeItem("identityId");
                localStorage.removeItem("sessionToken");

                history.push("sign-in");
            })
            .catch((error) => console.log(error));
    };

    const handleAccount = (event) => {
        event.preventDefault();

        history.push("account");
    };

    return (
        <AppBar {...rest} className={clsx(classes.root, className)}>
            <Toolbar>
                <Hidden lgUp>
                    <IconButton color="inherit" onClick={onSidebarOpen}>
                        <MenuIcon/>
                    </IconButton>
                </Hidden>
                <div className={classes.flexGrow}/>
                    <IconButton color="inherit" onClick={handleAccount}>
                        <Badge
                            badgeContent={notifications.length}
                            color="primary"
                            variant="dot"
                        >
                            <AccountCircleOutlinedIcon/>
                        </Badge>
                    </IconButton>
                    <IconButton
                        className={classes.signOutButton}
                        color="inherit"
                        onClick={handleSignOut}
                    >
                        <InputIcon/>
                    </IconButton>
            </Toolbar>
        </AppBar>
    );
};

Topbar.propTypes = {
    className: PropTypes.string,
    onSidebarOpen: PropTypes.func,
};

export default Topbar;
