import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {makeStyles} from "@material-ui/styles";
import validate from "validate.js";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import axios from "axios";
import {useAppState} from "../../../../../state/stateContext";
import Error from "../../../../Error/Error";

const schema = {
    email: {
        presence: {allowEmpty: false, message: 'is required'},
        email: true,
        length: {
            maximum: 64
        }
    },
    role: {
        presence: {allowEmpty: false, message: 'is required'},
    }
};

const useStyles = makeStyles(theme => ({
    textField: {
        marginTop: theme.spacing(2)
    },
}));

const UserInvite = (props) => {
    const [open, setOpen] = useState(false);
    const classes = useStyles();
    const [formState, setFormState] = useState({
        isValid: false,
        values: {},
        touched: {},
        errors: {}
    });
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState(null);
    const {organizationInfo} = useAppState();
    const endPoint = process.env.REACT_APP_API_BASE;
    const token = `Token ${localStorage.accessToken}`;

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        const getRoles = async () => {
            try {
                const res = await axios({
                    url: `${endPoint}roles/`,
                    method: "get",
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                    cancelToken: source.token
                });
                setRoles(res.data.results.data);
            } catch (error) {
            }
        };

        getRoles();

        return () => {
            source.cancel();
        };
    });

    useEffect(() => {
        const errors = validate(formState.values, schema);

        setFormState(formState => ({
            ...formState,
            isValid: errors ? false : true,
            errors: errors || {}
        }));
    }, [formState.values]);

    useEffect(() => {
        setOpen(props.open);
    },[props.open]);

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

    const handleClose = () => {
        setFormState({
            isValid: false,
            values: {},
            touched: {},
            errors: {}
        });
        setError(null);
        props.onClose();
    };

    const handleInvite = async () => {
      const {email, role} = formState.values;

      try {
          await axios({
              method: 'post',
              url: `${endPoint}user-invite/`,
              headers: {
                  Authorization: token,
                  "Content-Type": "application/json",
              },
              data: {
                  emailAddress: email,
                  roleId: role
              }
          });

          handleClose();
      }catch (error) {
          setError(error.message);
      }
    };

    const hasError = field =>
        formState.touched[field] && formState.errors[field] ? true : false;

    return (
        <div>
            <Dialog fullWidth={true} open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Invite user to <strong>{organizationInfo.name}</strong></DialogTitle>
                {error && <Error error={props.error} message={error}/>}
                <DialogContent>
                    <TextField
                        autoFocus
                        className={classes.textField}
                        error={hasError('email')}
                        fullWidth
                        helperText={
                            hasError('email') ? formState.errors.email[0] : null
                        }
                        label="Email Address"
                        name="email"
                        onChange={handleChange}
                        type="text"
                        value={formState.values.email || ''}
                    />
                    <TextField
                        select
                        className={classes.textField}
                        error={hasError('role')}
                        fullWidth
                        helperText={
                            hasError('role') ? formState.errors.role[0] : null
                        }
                        label="Role"
                        name="role"
                        onChange={handleChange}
                        type="text"
                        value={formState.values.role || ''}
                    >
                        {roles.map((role, item) => (
                            <MenuItem key={item} value={role.id}>{role.name}</MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleInvite} color="primary">
                        Invite
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default UserInvite;
