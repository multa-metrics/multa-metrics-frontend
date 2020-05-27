import React, {useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/styles';
import {AppBar, Toolbar, Badge, Hidden, IconButton} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import InputIcon from '@material-ui/icons/Input';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import {Auth} from 'aws-amplify';

const useStyles = makeStyles(theme => ({
    root: {
        boxShadow: 'none'
    },
    flexGrow: {
        flexGrow: 1
    },
    signOutButton: {
        marginLeft: theme.spacing(1)
    }
}));

const Topbar = props => {
    const {className, onSidebarOpen, history, ...rest} = props;
    const classes = useStyles();
    const [notifications] = useState([]);

    const handleSignOut = async event => {
        event.preventDefault();

        Auth.signOut()
            .then(() => history.push('sign-in'))
            .catch(error => console.log(error));
    };

    const handleAccount = event => {
        event.preventDefault();

        Auth.currentAuthenticatedUser()
            .then(res => console.log(res))
            .catch(err => console.log(err));
    };

    return (
        <AppBar
            {...rest}
            className={clsx(classes.root, className)}
        >
            <Toolbar>
                <div className={classes.flexGrow}/>
                <Hidden mdDown>
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
                </Hidden>
                <Hidden lgUp>
                    <IconButton
                        color="inherit"
                        onClick={onSidebarOpen}
                    >
                        <MenuIcon/>
                    </IconButton>
                </Hidden>
            </Toolbar>
        </AppBar>
    );
};

Topbar.propTypes = {
    className: PropTypes.string,
    onSidebarOpen: PropTypes.func
};

export default Topbar;
