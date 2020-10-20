import React from 'react';
import {
  Grid,
  Card,
  TextField,
  CardContent,
  Button,
  Typography,
} from '@material-ui/core';
import { ArrowLeft, ArrowRight } from '@material-ui/icons';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import StudentCard from './StudentCard';

const useStyles = makeStyles(theme => ({
  statusWorkout: {
    fontSize: '1.5rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.75rem',
    },
  },
}));

const AppointmentContainer: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const matchesMD = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Grid container direction="column" style={{ padding: '2em' }}>
      <Grid item container direction="column" style={{ marginBottom: '2em' }}>
        <Typography
          color="primary"
          variant="h1"
          className={classes.statusWorkout}
        >
          Treinando agora | moderado
        </Typography>
        <Typography color="primary" variant="h5">
          15:00
        </Typography>
      </Grid>
      <Grid item container spacing={2} style={{ border: '1px solid red' }}>
        <StudentCard />
        <StudentCard />
        <StudentCard />
        <StudentCard />
        <StudentCard />
        <StudentCard />
      </Grid>
    </Grid>
  );
};

export default AppointmentContainer;
