import React, {useState, useEffect} from 'react';
import {Link as RouterLink, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import {makeStyles} from '@material-ui/styles';
import {
    Grid,
    Button,
    TextField,
    Link,
    FormHelperText,
    Checkbox,
    Typography
} from '@material-ui/core';
import {Auth} from 'aws-amplify';
import Alert from "@material-ui/lab/Alert/Alert";
import InputAdornment from "@material-ui/core/InputAdornment/InputAdornment";
import IconButton from "@material-ui/core/IconButton/IconButton";
import {Visibility, VisibilityOff} from "@material-ui/icons";

const schema = {
    firstName: {
        presence: {allowEmpty: false, message: 'is required'},
        length: {
            maximum: 32
        }
    },
    lastName: {
        presence: {allowEmpty: false, message: 'is required'},
        length: {
            maximum: 32
        }
    },
    email: {
        presence: {allowEmpty: false, message: 'is required'},
        email: true,
        length: {
            maximum: 64
        }
    },
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
    policy: {
        presence: {allowEmpty: false, message: 'is required'},
        checked: true
    },
    organization: {
        presence: {allowEmpty: false, message: 'is required'},
        length: {
            maximum: 32
        }
    },
    phoneNumber: {
        presence: {allowEmpty: false, message: 'is required'},
        length: {
            maximum: 32
        }
        // format: {
        //     pattern: /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/,
        //     message: 'in not valid'
        // }
    }
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
    signUpButton: {
        margin: theme.spacing(2, 0)
    },
    resendCode: {
        justifyContent: 'flex-end',
        alignItems: 'center'
    }
}));

const SignUp = props => {
    const url = new URLSearchParams(props.location.search);
    const {history} = props;
    const classes = useStyles();
    const [code, setCode] = useState('');
    const [signedUp, setSignedUp] = useState(url.get('signup') || false);
    const [formState, setFormState] = useState({
        isValid: false,
        values: {
            'email': url.get('username') || ''
        },
        touched: {},
        errors: {}
    });
    const [errorMessage, setErrorMessage] = useState(null);
    const [message, setMessage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

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
                [event.target.name]:
                    event.target.type === 'checkbox'
                        ? event.target.checked
                        : event.target.value
            },
            touched: {
                ...formState.touched,
                [event.target.name]: true
            }
        }));
    };

    const handleChangeCode = event => {
        event.persist();
        setCode(event.target.value)
    };

    const signUp = async event => {
        event.preventDefault();
        const {password, email, firstName, lastName, phoneNumber} = formState.values;

        try {
            await Auth.signUp({
                username: email,
                password: password,
                attributes: {
                    email: email,
                    given_name: firstName,
                    family_name: lastName,
                    phone_number: phoneNumber,
                    updated_at: Date.now().toString()
                }
            });
            setSignedUp(true);
        } catch (e) {
            setErrorMessage(e.message);
            setMessage(null);
        }
    };

    const confirmSingUp = async event => {
        event.preventDefault();
        const {email, organization} = formState.values;

        try {
            await Auth.confirmSignUp(email, code, {clientMetadata: {'organization_name': organization}});
            history.push('/sign-in');
            setMessage(null);
            setErrorMessage(null);
        } catch (e) {
            setErrorMessage(e.message)
        }
    }

    const resendCode = async event => {
        event.preventDefault();
        const {email} = formState.values;

        try {
            await Auth.resendSignUp(email);
            setMessage("Code has been sent");
            setErrorMessage(null);
        }catch (e) {
            setMessage(null);
            setErrorMessage(e.message);
        }
    }

    const hasError = field =>
        formState.touched[field] && formState.errors[field] ? true : false;

    return (
        <div className={classes.root}>
            <Grid
                className={classes.grid}
                container
            >
                {!signedUp && <Grid
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
                                    Create new account
                                </Typography>
                                <Typography
                                    color="textSecondary"
                                    gutterBottom
                                >
                                    Use your email to create new account
                                </Typography>
                                {errorMessage &&
                                <Alert className={classes.errorMessage} variant="outlined" severity="error">
                                    {errorMessage}
                                </Alert>}
                                <TextField
                                    className={classes.textField}
                                    error={hasError('firstName')}
                                    fullWidth
                                    helperText={
                                        hasError('firstName') ? formState.errors.firstName[0] : null
                                    }
                                    label="First name"
                                    name="firstName"
                                    onChange={handleChange}
                                    type="text"
                                    value={formState.values.firstName || ''}
                                    variant="outlined"
                                />
                                <TextField
                                    className={classes.textField}
                                    error={hasError('lastName')}
                                    fullWidth
                                    helperText={
                                        hasError('lastName') ? formState.errors.lastName[0] : null
                                    }
                                    label="Last name"
                                    name="lastName"
                                    onChange={handleChange}
                                    type="text"
                                    value={formState.values.lastName || ''}
                                    variant="outlined"
                                />
                                <TextField
                                    className={classes.textField}
                                    error={hasError('phoneNumber')}
                                    fullWidth
                                    helperText={
                                        hasError('phoneNumber') ? formState.errors.phoneNumber[0] : null
                                    }
                                    label="Phone Number"
                                    name="phoneNumber"
                                    onChange={handleChange}
                                    type="text"
                                    value={formState.values.phoneNumber || ''}
                                    variant="outlined"
                                >
                                </TextField>
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
                                <TextField
                                    className={classes.textField}
                                    error={hasError('password')}
                                    fullWidth
                                    helperText={
                                        hasError('password') ? formState.errors.password[0] : null
                                    }
                                    label="Password"
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
                                    error={hasError('organization')}
                                    fullWidth
                                    helperText={
                                        hasError('organization') ? formState.errors.organization[0] : null
                                    }
                                    label="Organization"
                                    name="organization"
                                    onChange={handleChange}
                                    type="text"
                                    value={formState.values.organization || ''}
                                    variant="outlined"
                                >
                                </TextField>
                                <div className={classes.policy}>
                                    <Checkbox
                                        checked={formState.values.policy || false}
                                        className={classes.policyCheckbox}
                                        color="primary"
                                        name="policy"
                                        onChange={handleChange}
                                    />
                                    <Typography
                                        className={classes.policyText}
                                        color="textSecondary"
                                        variant="body1"
                                    >
                                        I have read the{' '}
                                        <Link
                                            color="primary"
                                            component={RouterLink}
                                            to="#"
                                            underline="always"
                                            variant="h6"
                                        >
                                            Terms and Conditions
                                        </Link>
                                    </Typography>
                                </div>
                                {hasError('policy') && (
                                    <FormHelperText error>
                                        {formState.errors.policy[0]}
                                    </FormHelperText>
                                )}
                                <Button
                                    className={classes.signUpButton}
                                    color="primary"
                                    disabled={!formState.isValid}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    onClick={signUp}
                                >
                                    Sign up now
                                </Button>
                                <Typography
                                    color="textSecondary"
                                    variant="body1"
                                >
                                    Have an account?{' '}
                                    <Link
                                        component={RouterLink}
                                        to="/sign-in"
                                        variant="h6"
                                    >
                                        Sign in
                                    </Link>
                                </Typography>
                            </form>
                        </div>
                    </div>
                </Grid>}
                {signedUp && <Grid
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
                                    Verification account
                                </Typography>
                                <Typography
                                    color="textSecondary"
                                    gutterBottom
                                >
                                    Code has been sent to {formState.values.email}
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
                                    fullWidth
                                    label="Confirmation Code"
                                    name="code"
                                    onChange={handleChangeCode}
                                    type="code"
                                    value={code || ''}
                                    variant="outlined"
                                />
                                <Button
                                    className={classes.signUpButton}
                                    color="primary"
                                    disabled={!code}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    onClick={confirmSingUp}
                                >
                                    Send code
                                </Button>
                                <Grid container spacing={1}>
                                    <Grid container item xs={6} justify="space-between">
                                        <Typography
                                            color="textSecondary"
                                            variant="body1"
                                        >
                                            Have an account?{' '}
                                            <Link
                                                component={RouterLink}
                                                to="/sign-in"
                                                variant="h6"
                                            >
                                                Sign in
                                            </Link>
                                        </Typography>
                                    </Grid>
                                    <Grid container item xs={6} spacing={3} className={classes.resendCode}>
                                        <Link
                                            component="button"
                                            variant="h6"
                                            onClick={resendCode}
                                        >
                                            Resend Code
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

SignUp.propTypes = {
    history: PropTypes.object
};

export default withRouter(SignUp);
