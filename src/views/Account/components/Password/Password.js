import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/styles";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {Auth} from "aws-amplify";
import {Alert} from "@material-ui/lab";

import {
    Grid,
    Button, Typography, TextField, Link,
} from "@material-ui/core";
import validate from "validate.js";

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: '#3f51b5',
        height: '100%'
    },
    grid: {
        height: '100%'
    },
    quoteContainer: {
        [theme.breakpoints.down('md')]: {
            display: 'none'
        }
    },
    quote: {
        backgroundColor: theme.palette.neutral,
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: 'url(/images/auth.jpg)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
    },
    quoteInner: {
        textAlign: 'center',
        flexBasis: '600px'
    },
    quoteText: {
        color: theme.palette.white,
        fontWeight: 300
    },
    name: {
        marginTop: theme.spacing(3),
        color: theme.palette.white
    },
    bio: {
        color: theme.palette.white
    },
    contentContainer: {},
    content: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    contentHeader: {
        display: 'flex',
        alignItems: 'center',
        paddingTop: theme.spacing(5),
        paddingBototm: theme.spacing(2),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2)
    },
    logoImage: {
        marginLeft: theme.spacing(4)
    },
    contentBody: {
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    form: {
        paddingLeft: 25,
        paddingRight: 25,
        paddingBottom: 25,
        paddingTop: 25,
        flexBasis: 500,
        border: '1px solid',
        borderRadius: '5px',
        backgroundColor: theme.palette.background.default,
        [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2)
        }
    },
    title: {
        // marginTop: theme.spacing(3)
    },
    textField: {
        marginTop: theme.spacing(2)
    },
    policy: {
        marginTop: theme.spacing(1),
        display: 'flex',
        alignItems: 'center'
    },
    policyCheckbox: {
        marginLeft: '-14px'
    },
    button: {
        margin: theme.spacing(2, 0)
    },
    resendCode: {
        justifyContent: 'flex-end',
        alignItems: 'center'
    }
}));

const schema = {
    currentPassword: {
        presence: {
            allowEmpty: false,
            message: 'is required'
        },
        length: {
            minimum: 8,
            maximum: 128,
            message: "must be at least 8 characters"
        },
        format: {
            pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,128}$/,
            message: "must contain at least one numeric digit, one uppercase and one lowercase letters"
        }
    },
    newPassword: {
        presence: {
            allowEmpty: false,
            message: 'is required'
        },
        length: {
            minimum: 8,
            maximum: 128,
            message: "must be at least 8 characters"
        },
        format: {
            pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,128}$/,
            message: "must contain at least one numeric digit, one uppercase and one lowercase letters"
        }
    },
    confirmPassword: {
        presence: {allowEmpty: false, message: 'is required'},
        equality: "newPassword"
    }
};

const Password = (props) => {
    const { history } = props;

    const classes = useStyles();
    const [errorMessage, setErrorMessage] = useState(null);
    const [message, setMessage] = useState(null);

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formState, setFormState] = useState({
        isValid: false,
        values: {},
        touched: {},
        errors: {}
    });

    useEffect(() => {
        const errors = validate(formState.values, schema);

        setFormState(formState => ({
            ...formState,
            isValid: errors ? false : true,
            errors: errors || {}
        }));
    }, [formState.values]);

    const handleChange = event => {
        event.persist();

        setFormState(formState => ({
            ...formState,
            values: {
                ...formState.values,
                [event.target.name]: event.target.value
            },
            touched: {
                ...formState.touched,
                [event.target.name]: true
            }
        }));
    };

    async function handleChangeClick(event) {
        event.preventDefault();

        const { currentPassword, newPassword } = formState.values;

        try {
            const currentUser = await Auth.currentAuthenticatedUser();
            await Auth.changePassword(
                currentUser,
                currentPassword,
                newPassword
            );
            setMessage("Password has been changed");
            setFormState({
                isValid: false,
                values: {},
                touched: {},
                errors: {}
            })
            setErrorMessage(null);
        } catch (error) {
            setErrorMessage(error.message);
        }
    }

    const hasError = field =>
        formState.touched[field] && formState.errors[field] ? true : false;

    const back = event => {
        event.preventDefault();
        setFormState({
            isValid: false,
            values: {},
            touched: {},
            errors: {}
        })
        setErrorMessage(null);
        history.push("/account");
    }

    return (
        <Grid className={classes.root}>
            <Grid container className={classes.grid}>
                <Grid item className={classes.content} xs={12} lg={12}>
                    <div className={classes.contentBody}>
                        <form className={classes.form}>
                            <Typography
                                className={classes.title}
                                variant="h2"
                            >
                                Change Password
                            </Typography>
                            {errorMessage &&
                            <Alert className={classes.errorMessage} variant="outlined" severity="error">
                                {errorMessage}
                            </Alert>}
                            {message &&
                            <Alert className={classes.errorMessage} variant="outlined" severity="success">
                                {message}
                            </Alert>}

                            <TextField
                                className={classes.textField}
                                error={hasError('currentPassword')}
                                fullWidth
                                helperText={
                                    hasError('currentPassword') ? formState.errors.currentPassword[0] : null
                                }
                                label="Current Password"
                                name="currentPassword"
                                onChange={handleChange}
                                type={showCurrentPassword ? "text" : "password"}
                                value={formState.values.currentPassword || ''}
                                variant="outlined"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                edge="end"
                                            >
                                                {!showCurrentPassword ? <Visibility/> : <VisibilityOff/>}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <TextField
                                className={classes.textField}
                                error={hasError('newPassword')}
                                fullWidth
                                helperText={
                                    hasError('newPassword') ? formState.errors.newPassword[0] : null
                                }
                                label="New Password"
                                name="newPassword"
                                onChange={handleChange}
                                type={showNewPassword ? "text" : "password"}
                                value={formState.values.newPassword || ''}
                                variant="outlined"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                edge="end"
                                            >
                                                {!showNewPassword ? <Visibility/> : <VisibilityOff/>}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <TextField
                                className={classes.textField}
                                error={hasError('confirmPassword')}
                                fullWidth
                                helperText={
                                    hasError('confirmPassword') ? formState.errors.confirmPassword[0] : null
                                }
                                label="Confirm Password"
                                name="confirmPassword"
                                onChange={handleChange}
                                type={showConfirmPassword ? "text" : "password"}
                                value={formState.values.confirmPassword || ''}
                                variant="outlined"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                edge="end"
                                            >
                                                {!showConfirmPassword ? <Visibility/> : <VisibilityOff/>}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <Button
                                className={classes.button}
                                color="primary"
                                disabled={!formState.isValid}
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                onClick={handleChangeClick}
                            >
                                Change password
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link
                                        component="button"
                                        variant="h6"
                                        onClick={back}
                                    >
                                        Back
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                </Grid>
            </Grid>
        </Grid>
    );
};

Password.propTypes = {
    className: PropTypes.string,
};

export default Password;
