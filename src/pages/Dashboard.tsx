import React, { useEffect, useState, useMemo } from 'react';
import { Button, Card, CardContent, Grid, Typography } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { getMonth, format, parseISO } from 'date-fns';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Paper from '@material-ui/core/Paper';

import { AppsSharp } from '@material-ui/icons';
import api from '../services/api';
import Header from '../components/Header';
import StudentCard from '../components/StudentCard';

interface AvailabilityProps {
  hour: string;
  status: string;
  available: boolean;
}
type User = {
  name: string;
  userId: string;
  course: string;
  enrollment: string;
};

interface Appointments {
  date: string;
  user: User;
}

const useStyles = makeStyles(theme => ({
  statusWorkout: {
    fontSize: '1.5rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.75rem',
    },
  },
}));

const Dashboard: React.FC = () => {
  const classes = useStyles();

  const theme = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState<AvailabilityProps[]>([]);
  const [appointments, setAppointments] = useState<Appointments[]>([]);

  useEffect(() => {
    console.log(appointments);
  }, [appointments]);

  useEffect(() => {
    api
      .get('/availability', {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
          day: currentMonth.getDate(),
        },
      })
      .then(response => {
        setAvailability(response.data);
      });
  }, [currentMonth]);

  useEffect(() => {
    api
      .get('/appointments', {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
          day: currentMonth.getDate() + 1,
        },
      })
      .then(response => setAppointments(response.data));
  }, [currentMonth]);

  return (
    <>
      <Header />
      <Grid container justify="center">
        <Grid
          item
          style={{
            minWidth: '960px',
            padding: '20px',
          }}
        >
          {availability.map(appointmentContainer => (
            <Grid
              container
              direction="column"
              key={appointmentContainer.hour}
              style={{ marginTop: '4rem' }}
            >
              <Grid
                item
                container
                direction="row"
                alignItems="center"
                justify="space-between"
              >
                <Grid item>
                  <Grid container direction="column">
                    <Grid item>
                      <Typography
                        color="primary"
                        variant="h1"
                        className={classes.statusWorkout}
                      >
                        <span>Treinando agora | </span>
                        <span>{appointmentContainer.status}</span>
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography color="primary" variant="h5">
                        {appointmentContainer.hour}
                        <span> horas</span>
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="secondary">
                    Agendar
                  </Button>
                </Grid>
              </Grid>
              <Grid item container style={{ marginTop: '2rem' }} spacing={2}>
                {appointments
                  .filter(
                    app =>
                      JSON.stringify(parseISO(app.date).getHours()) ===
                      JSON.stringify(appointmentContainer.hour),
                  )
                  .map(appointment => (
                    <Grid
                      item
                      xs={6}
                      sm={4}
                      md={3}
                      lg={2}
                      key={appointment.user.userId}
                    >
                      <Card>
                        <CardContent>
                          <Typography>{appointment.user.name}</Typography>
                          <Typography>{appointment.user.course}</Typography>
                          <Typography>{appointment.user.enrollment}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
