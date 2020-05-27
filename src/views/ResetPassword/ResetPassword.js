import React, {useState, useEffect} from 'react';
import {Link as RouterLink, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import {makeStyles} from '@material-ui/styles';
import {
    Grid,
    Button,
    TextField,
    Typography, Link
} from '@material-ui/core';
import {Auth} from 'aws-amplify';
import Alert from "@material-ui/lab/Alert/Alert";
import InputAdornment from "@material-ui/core/InputAdornment/InputAdornment";
import IconButton from "@material-ui/core/IconButton/IconButton";
import {Visibility, VisibilityOff} from "@material-ui/icons";

const schema = {
    password: {
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
        equality: "password"
    },
    code: {
        presence: {allowEmpty: false, message: 'is required'},
        length: {
            minimum: 6,
            maximum: 6,
            message: "must be 6 numbers"
        }
    },
    email: {
        presence: {allowEmpty: false, message: 'is required'},
        email: true,
        length: {
            maximum: 64
        }
    },
};

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

const ResetPassword = props => {
    const {history} = props;
    const classes = useStyles();
    // const [email, setEmail] = useState('');
    const [sentCode, setSentCode] = useState(false);
    const [formState, setFormState] = useState({
        isValid: false,
        values: {},
        touched: {},
        errors: {}
    });
    const [errorMessage, setErrorMessage] = useState(null);
    const [message, setMessage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    const sendVerification = async event => {
        event.preventDefault();
        const { email } = formState.values;

        try {
            await Auth.forgotPassword(email);
            setErrorMessage(null);
            setMessage(null);
            setSentCode(true);
        } catch (e) {
            setErrorMessage(e.message);
            setMessage(null);
        }
    };

    const resetPassword = async event => {
        event.preventDefault();
        const {password, code, email} = formState.values;

        try {
            await Auth.forgotPasswordSubmit(
                email,
                code,
                password
            );
            history.push('/sign-in');
            setMessage(null);
            setErrorMessage(null);
        } catch (e) {
            setErrorMessage(e.message);
            setMessage(null);
        }
    };

    const back = event => {
        event.preventDefault();
        setSentCode(false);
        setFormState({
            isValid: false,
            values: {},
            touched: {},
            errors: {}
        })
        setErrorMessage(null);
    }

    const hasError = field =>
        formState.touched[field] && formState.errors[field] ? true : false;

    return (
        <div className={classes.root}>
            <Grid
                className={classes.grid}
                container
            >
                {!sentCode && <Grid
                    className={classes.content}
                    item
                    lg={12}
                    xs={12}
                >
                    <div className={classes.content}>
                        <div className={classes.contentBody}>
                            <form
                                className={classes.form}
                            >
                                <Typography
                                    className={classes.title}
                                    variant="h2"
                                >
                                    Reset Password
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
                                    error={hasError('email')}
                                    fullWidth
                                    helperText={
                                        hasError('email') ? formState.errors.email[0] : null
                                    }
                                    label="Email address"
                                    name="email"
                                    onChange={handleChange}
                                    type="text"
                                    value={formState.values.email || ''}
                                    variant="outlined"
                                />
                                <Button
                                    className={classes.button}
                                    color="primary"
                                    disabled={!formState.values.email}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    onClick={sendVerification}
                                >
                                    Send confirmation
                                </Button>
                                <Grid container>
                                    <Grid item xs>
                                        <Link
                                            component={RouterLink}
                                            to="/sign-in"
                                            variant="h6"
                                        >
                                            Back
                                        </Link>
                                    </Grid>
                                </Grid>
                            </form>
                        </div>
                    </div>
                </Grid>}
                {sentCode && <Grid
                    className={classes.content}
                    item
                    lg={12}
                    xs={12}
                >
                    <div className={classes.content}>
                        <div className={classes.contentBody}>
                            <form
                                className={classes.form}
                            >
                                <Typography
                                    className={classes.title}
                                    variant="h2"
                                >
                                    Reset Password
                                </Typography>
                                <Typography
                                    color="textSecondary"
                                    gutterBottom
                                >
                                    Please check your email {formState.values.email} for the confirmation code.
                                </Typography>
                                {errorMessage &&
                                <Alert className={classes.errorMessage} variant="outlined" severity="error">
                                    {errorMessage}
                                </Alert>}
                                <TextField
                                    className={classes.textField}
                                    error={hasError('code')}
                                    fullWidth
                                    helperText={
                                        hasError('code') ? formState.errors.code[0] : null
                                    }
                                    label="Confirmation Code"
                                    name="code"
                                    onChange={handleChange}
                                    type="text"
                                    value={formState.values.code || ''}
                                    variant="outlined"
                                />
                                <TextField
                                    className={classes.textField}
                                    error={hasError('password')}
                                    fullWidth
                                    helperText={
                                        hasError('password') ? formState.errors.password[0] : null
                                    }
                                    label="New Password"
                                    name="password"
                                    onChange={handleChange}
                                    type={showPassword ? "text" : "password"}
                                    value={formState.values.password || ''}
                                    variant="outlined"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {!showPassword ? <Visibility/> : <VisibilityOff/>}
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
                                    onClick={resetPassword}
                                >
                                    Reset password
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
                    </div>
                </Grid>}
            </Grid>
        </div>
    );
};

ResetPassword.propTypes = {
    history: PropTypes.object
};

export default withRouter(ResetPassword);
