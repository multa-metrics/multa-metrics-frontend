import React, { useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import PhoneInput from "react-phone-input-2";
import "material-ui-phone-number";
import material from "../../../../css/material.css";

import {
  Card,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: { overflow: "inherit" },
  button: {
    marginRight: theme.spacing(4),
    marginLeft: theme.spacing(2),
  },
  textField: {
    "& .MuiInputBase-input": {
      height: "30px",
    },
  },
}));

const AccountDetails = (props) => {
  const { className, value, ...rest } = props;
  const [user] = useState(value);
  const { history } = props;

  const classes = useStyles();

  const [values, setValues] = useState({
    firstName: user.attributes.given_name,
    lastName: user.attributes.family_name,
    email: user.attributes.email,
    phone: user.attributes.phone_number,
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.phone]: event.target.value,
    });
  };

  const handleChangePhoneNumber = (value) => {
    setValues({
      ...values,
      [values.phone]: value,
    });
  };

  const handlePassword = (event) => {
    event.preventDefault();
    history.push("password");
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <form>
        <CardContent>
          <Grid className={classes.textField} container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                helperText="Please specify the first name"
                label="First name"
                margin="dense"
                name="firstName"
                onChange={handleChange}
                required
                value={values.firstName}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Last name"
                margin="dense"
                name="lastName"
                onChange={handleChange}
                required
                value={values.lastName}
                variant="outlined"
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                margin="dense"
                name="email"
                onChange={handleChange}
                required
                value={values.email}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <PhoneInput
                className={classes.phoneNumber}
                defaultCountry="us"
                name="phone"
                required
                value={values.phone}
                onChange={handleChangePhoneNumber}
                variant="outlined"
                regiones={" europa "}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            className={classes.button}
            color="primary"
            variant="contained"
          >
            Save details
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

AccountDetails.propTypes = {
  className: PropTypes.string,
};

export default AccountDetails;
