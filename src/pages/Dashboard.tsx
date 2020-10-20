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
import AppointmentContainer from '../components/AppointmentContainer';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  return (
    <Grid container direction="column" style={{ border: '1px solid red' }}>
      <AppointmentContainer />
      <AppointmentContainer />
      <AppointmentContainer />
    </Grid>
  );
};

export default Dashboard;
