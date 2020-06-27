import React, {useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Typography,
  Divider,
  Button,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {},
  details: {
    display: "flex",
  },
  avatar: {
    marginLeft: "auto",
    height: 110,
    width: 100,
    flexShrink: 0,
    flexGrow: 0,
  },
  progress: {
    marginTop: theme.spacing(2),
  },
  uploadButton: {
    marginRight: theme.spacing(2),
  },
}));

const AccountProfile = props => {
  const { className, value, ...rest } = props;
    const [ user ] = useState(value);

  const classes = useStyles();

  const userT = {
    avatar: "/images/avatars/avatar_11.png",
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent>
        <div className={classes.details}>
          <div>
            <Typography gutterBottom variant="h2">
              {user.attributes.given_name}, {user.attributes.family_name}
            </Typography>
          </div>
          <Avatar className={classes.avatar} src={userT.avatar} />
        </div>
      </CardContent>
      <Divider />
      <CardActions>
        <Button className={classes.uploadButton} color="primary" variant="text">
          Upload picture
        </Button>
        <Button variant="text">Remove picture</Button>
      </CardActions>
    </Card>
  );
};

AccountProfile.propTypes = {
  className: PropTypes.string,
};

export default AccountProfile;
