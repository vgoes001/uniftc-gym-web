import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Button,
  Card,
  CardContent,
  Grid,
  Hidden,
  IconButton,
  Typography,
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ptBR from 'date-fns/locale/pt-BR';

import { parseISO, format, addDays, isBefore, isAfter } from 'date-fns';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

import {
  QueryBuilder,
  ArrowForwardIos,
  ArrowBackIos,
} from '@material-ui/icons';
import api from '../services/api';
import Header from '../components/Header';
import StudentCard from '../components/StudentCard';

interface AvailabilityProps {
  hour: string;
  status: string;
  available: boolean;
  key: string;
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
  id: string;
}

const useStyles = makeStyles(theme => ({
  mainContainer: {
    marginBottom: '5em',
    [theme.breakpoints.down('xs')]: {
      marginTop: '0.5em',
      marginBottom: '0.5em',
    },
  },
  appointmentContainer: {
    marginTop: '5em',
    [theme.breakpoints.down('xs')]: {
      marginTop: '3em',
      marginBottom: '3em',
    },
  },
  statusWorkoutText: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    lineHeight: 1.5,
    color: theme.palette.secondary.main,
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem',
    },
  },
  scheduleButton: {
    borderRadius: 50,
    height: 45,
    width: 100,
    fontSize: '1rem',
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
    '&:hover': {
      backgroundColor: theme.palette.secondary.light,
    },
    [theme.breakpoints.down('sm')]: {
      height: 40,
    },
    [theme.breakpoints.down('xs')]: {
      height: 35,
      width: 80,
      fontSize: '0.75rem',
    },
  },

  clientsContainer: {
    marginTop: '0.75em',
  },
  ClientCard: {
    marginRight: '2em',
    marginTop: '2em',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  ClientName: {
    fontSize: '1.25rem',
    color: theme.palette.primary.main,
  },
  ClientInfo: {
    fontSize: '1rem',
    color: theme.palette.text.primary,
  },
}));

const Dashboard: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const matchesMD = useMediaQuery(theme.breakpoints.down('md'));

  const [alert, setAlert] = useState({ open: false, message: '' });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availability, setAvailability] = useState<AvailabilityProps[]>([]);
  const [appointments, setAppointments] = useState<Appointments[]>([]);

  useEffect(() => {
    api
      .get('/availability', {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(response => {
        setAvailability(response.data);
      });
  }, [selectedDate]);

  useEffect(() => {
    api
      .get('/appointments', {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(response => setAppointments(response.data));
  }, [selectedDate]);

  const incrementDate = useCallback(() => {
    setSelectedDate(addDays(selectedDate, 1));
  }, [selectedDate]);

  const decrementDate = useCallback(() => {
    setSelectedDate(addDays(selectedDate, -1));
  }, [selectedDate]);

  const handleAppointment = useCallback(
    async hour => {
      try {
        const newDate = new Date();
        const year = newDate.getFullYear();
        const month = newDate.getMonth();
        const day = newDate.getDate();
        const response = await api.post('appointments', {
          date: new Date(year, month, day, hour),
        });
        const appointment = response.data;

        setAppointments([...appointments, appointment]);
      } catch (err) {
        const { message } = err.response.data;
        setAlert({ open: true, message });
      }
    },
    [appointments],
  );

  const isDateBefore = useMemo(() => {
    const today = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
    );
    const selectedOnlyDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
    );

    return isBefore(selectedOnlyDate, addDays(today, 1));
  }, [selectedDate]);

  const formattedDate = useMemo(
    () => format(selectedDate, "dd 'de' MMMM',' yyyy", { locale: ptBR }),
    [selectedDate],
  );
  return (
    <>
      <Header />
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert
          severity="error"
          onClose={() => setAlert({ ...alert, open: false })}
        >
          {alert.message}
        </Alert>
      </Snackbar>

      <Grid container justify="center" alignItems="center">
        <Grid item className={classes.mainContainer} sm={8} xl={9} xs={10}>
          <Grid
            container
            justify="center"
            alignItems="center"
            style={{ marginTop: '2em' }}
          >
            {!isDateBefore && (
              <Grid item>
                <IconButton onClick={decrementDate} disabled={isDateBefore}>
                  <ArrowBackIos color="primary" />
                </IconButton>
              </Grid>
            )}

            <Grid item>
              <Typography>{formattedDate}</Typography>
            </Grid>

            <Grid item>
              <IconButton onClick={incrementDate}>
                <ArrowForwardIos color="primary" />
              </IconButton>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item />
          </Grid>
          <Grid item>
            {availability.map(appointmentContainer => {
              const parsedDate = new Date();
              const year = parsedDate.getFullYear();
              const month = parsedDate.getMonth();
              const day = parsedDate.getDate();
              const { hour } = appointmentContainer;
              const formattedHour = format(
                new Date(year, month, day, Number(hour)),
                'HH:mm',
              );

              return (
                <Grid
                  container
                  direction="column"
                  className={classes.appointmentContainer}
                  key={appointmentContainer.key}
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
                        <Grid item container>
                          <Typography
                            className={classes.statusWorkoutText}
                            variant="h1"
                          >
                            Treinando agora
                          </Typography>
                          <span>&nbsp;</span>
                          <Typography
                            className={classes.statusWorkoutText}
                            variant="h1"
                          >
                            |
                          </Typography>
                          <span>&nbsp;</span>

                          <Typography
                            className={classes.statusWorkoutText}
                            variant="h1"
                          >
                            {appointmentContainer.status}
                          </Typography>
                        </Grid>
                        <Grid item container>
                          <Grid container alignItems="center">
                            <Grid item>
                              <QueryBuilder
                                color="primary"
                                style={{ marginRight: '0.25em' }}
                              />
                            </Grid>
                            <Grid item>
                              <Typography
                                color="textSecondary"
                                variant="subtitle2"
                              >
                                {formattedHour}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Button
                        disabled={!appointmentContainer.available}
                        className={classes.scheduleButton}
                        onClick={() =>
                          handleAppointment(appointmentContainer.hour)
                        }
                      >
                        Agendar
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid item container className={classes.clientsContainer}>
                    {appointments.filter(
                      app =>
                        JSON.stringify(parseISO(app.date).getHours()) ===
                        JSON.stringify(appointmentContainer.hour),
                    ).length === 0 && (
                      <Typography variant="subtitle1" color="textSecondary">
                        Nenhum agendamento para esse horário
                      </Typography>
                    )}
                    {appointments
                      .filter(
                        app =>
                          JSON.stringify(parseISO(app.date).getHours()) ===
                          JSON.stringify(appointmentContainer.hour),
                      )
                      .map(appointment => (
                        <Grid
                          item
                          key={appointment.id}
                          xs={12}
                          md={4}
                          className={classes.ClientCard}
                        >
                          <Card>
                            <CardContent>
                              <Typography
                                variant="h2"
                                className={classes.ClientName}
                              >
                                {appointment.user.name}
                              </Typography>
                              <Typography className={classes.ClientInfo}>
                                {appointment.user.course}
                              </Typography>
                              <Typography className={classes.ClientInfo}>
                                {appointment.user.enrollment}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
