/* eslint-disable react/jsx-wrap-multilines */
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Button,
  Card,
  CardContent,
  Grid,
  Hidden,
  IconButton,
  Typography,
  Dialog,
  DialogContent,
  FormGroup,
  FormControlLabel,
  Switch,
  Checkbox,
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ptBR from 'date-fns/locale/pt-BR';

import {
  parseISO,
  format,
  addDays,
  isBefore,
  isAfter,
  setHours,
  setMinutes,
  setSeconds,
  isSameDay,
  isSameHour,
} from 'date-fns';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

import {
  QueryBuilder,
  ArrowForwardIos,
  ArrowBackIos,
} from '@material-ui/icons';
import { useForm } from 'react-hook-form';
import bodyWeightIcon from '../assets/gym/001-body-weight.svg';
import ringsIcon from '../assets/gym/005-rings.svg';
import dumbbellIcon from '../assets/gym/008-dumbbell-3.svg';
import machineIcon from '../assets/gym/025-machine-4.svg';
import benchIcon from '../assets/gym/035-bench-1.svg';
import treadmillIcon from '../assets/gym/040-treadmill.svg';
import bycicleIcon from '../assets/gym/042-bicycle.svg';
import gymBallIcon from '../assets/gym/046-gym-ball.svg';

import { useAuth } from '../hooks/AuthContext';
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
  user_id: string;
}

interface IEquipments {
  bodyWeight: {
    isChecked: boolean;
    id: string;
  };
  rings: {
    isChecked: boolean;
    id: string;
  };
  dumbbell: {
    isChecked: boolean;
    id: string;
  };
  machine: {
    isChecked: boolean;
    id: string;
  };
  treadmill: {
    isChecked: boolean;
    id: string;
  };
  bench: {
    isChecked: boolean;
    id: string;
  };
  bycicle: {
    isChecked: boolean;
    id: string;
  };
  ball: {
    isChecked: boolean;
    id: string;
  };
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
  trainingNow: {
    position: 'relative',
    backgroundColor: '#f4ede8',
    padding: '10px',
    borderRadius: '10px',
    // '&::before': {
    //   position: 'absolute',
    //   height: '80%',
    //   width: '1px',
    //   left: 0,
    //   content: '""',
    //   top: '10%',
    //   background: '#ff9000',
    // },
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
  gymEquipmentIcon: {
    maxWidth: '48px',
    marginRight: '1em',
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

type IAlertSeverity = 'success' | 'error' | 'info' | 'warning' | undefined;

interface IAlert {
  open: boolean;
  message: string;
  severity: IAlertSeverity;
}

const Dashboard: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();

  const matchesMD = useMediaQuery(theme.breakpoints.down('md'));
  const matchesSM = useMediaQuery(theme.breakpoints.down('sm'));

  const [open, setOpen] = useState(false);

  const { user } = useAuth();

  const [alert, setAlert] = useState<IAlert>({
    open: false,
    message: '',
    severity: undefined,
  });
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availability, setAvailability] = useState<AvailabilityProps[]>([]);
  const [appointments, setAppointments] = useState<Appointments[]>([]);
  const [checkBoxState, setCheckBoxState] = useState<IEquipments>({
    bodyWeight: {
      isChecked: false,
      id: '645c626a-57ed-4bf1-80c8-533e89356c10',
    },
    rings: {
      isChecked: false,
      id: '4299cb9b-50b7-4a63-9a30-8cd08c79aa5a',
    },
    dumbbell: {
      isChecked: false,
      id: '8e12605d-f38f-4cea-becd-2243e2cb728d',
    },
    machine: {
      isChecked: false,
      id: '07f465bf-dff8-44d4-a6fe-2f587c2dda65',
    },
    treadmill: {
      isChecked: false,
      id: '28c27709-9560-49f2-9802-4fdd3aedf002',
    },
    bench: {
      isChecked: false,
      id: '4ee40f12-e816-4b9f-afa4-0c67fe90da0e',
    },
    bycicle: {
      isChecked: false,
      id: '2a8e7cef-1217-4f38-99d4-b457dddc7f30',
    },
    ball: {
      isChecked: false,
      id: '78c2506d-3554-4719-a6e0-d226b6c7d8ba',
    },
  });

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

  const handleSubmit = useCallback(async () => {
    try {
      const equipments = Object.values(checkBoxState)
        .map<{
          isChecked: boolean;
          id: string;
        }>(key => key)
        .filter(eqp => eqp.isChecked)
        .map(value => value.id);

      if (!selectedHour) {
        throw new Error('Um horário válido deve ser selecionado');
      }

      const response = await api.post('/appointments', {
        date: setHours(selectedDate, selectedHour),
        equipments,
      });

      const appointment = response.data;

      setAppointments([...appointments, appointment]);
      setAlert({
        open: true,
        message: 'Agendamento realizado com sucesso',
        severity: 'success',
      });

      setOpen(false);
    } catch (err) {
      const { message } = err.response?.data || err;
      setAlert({ open: true, message, severity: 'error' });
    }
  }, [appointments, checkBoxState, selectedDate, selectedHour]);

  const openDialog = useCallback(
    hour => {
      setSelectedHour(Number(hour));

      try {
        const checkAppointmentExists = appointments.filter(
          appointment => appointment.user_id === user.id,
        );
        if (checkAppointmentExists.length > 0) {
          throw new Error('Não é possível agendar mais de um treino por dia');
        }
        setOpen(true);
      } catch (err) {
        const { message } = err.response?.data || err;
        setAlert({ open: true, message, severity: 'error' });
      }
    },
    [appointments, user.id],
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

  const workoutStatus = useCallback(
    (hour: string, status: string) => {
      const workoutDate = setHours(selectedDate, Number(hour));

      const compareDate = new Date();

      if (
        isSameDay(workoutDate, compareDate) &&
        isSameHour(workoutDate, compareDate)
      ) {
        return 'Treinando agora';
      }

      if (isBefore(workoutDate, compareDate)) {
        return 'Treino finalizado';
      }

      if (status === 'cheio') {
        return 'Não há vagas';
      }

      return 'Horário disponível';
    },
    [selectedDate],
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCheckBoxState({
        ...checkBoxState,
        [event.target.name]: {
          isChecked: event.target.checked,
          id: event.target.id,
        },
      });
    },
    [checkBoxState],
  );

  const formattedDate = useMemo(
    () => format(selectedDate, "dd 'de' MMMM',' yyyy", { locale: ptBR }),
    [selectedDate],
  );
  return (
    <>
      <Header />
      <Dialog
        open={open}
        fullScreen={matchesSM}
        style={{ zIndex: 1302 }}
        onClose={() => {
          setOpen(false);
        }}
      >
        <DialogContent>
          <Grid container justify="center">
            <Grid item style={{ marginTop: '2em' }}>
              <Typography>
                Selecione os equipamentos que deseja utilizar
              </Typography>
            </Grid>

            <Grid item>
              <FormGroup>
                <Grid
                  container
                  justify="space-around"
                  style={{ marginTop: '2em' }}
                >
                  <Grid item container style={{ marginTop: '2em' }} md={5}>
                    <img
                      src={bodyWeightIcon}
                      alt="Body weight"
                      className={classes.gymEquipmentIcon}
                    />
                    <FormControlLabel
                      label="Colete de peso"
                      control={
                        <Checkbox
                          name="bodyWeight"
                          onChange={handleChange}
                          id="645c626a-57ed-4bf1-80c8-533e89356c10"
                        />
                      }
                    />
                  </Grid>
                  <Grid item container style={{ marginTop: '2em' }} md={5}>
                    <img
                      src={ringsIcon}
                      alt="Rings"
                      className={classes.gymEquipmentIcon}
                    />
                    <FormControlLabel
                      label="Argolas"
                      control={
                        <Checkbox
                          name="rings"
                          onChange={handleChange}
                          id="4299cb9b-50b7-4a63-9a30-8cd08c79aa5a"
                        />
                      }
                    />
                  </Grid>
                  <Grid item container style={{ marginTop: '2em' }} md={5}>
                    <img
                      src={dumbbellIcon}
                      alt="Halteres"
                      className={classes.gymEquipmentIcon}
                    />
                    <FormControlLabel
                      label="Halteres"
                      control={
                        <Checkbox
                          name="dumbbell"
                          onChange={handleChange}
                          id="8e12605d-f38f-4cea-becd-2243e2cb728d"
                        />
                      }
                    />
                  </Grid>
                  <Grid item container style={{ marginTop: '2em' }} md={5}>
                    <img
                      src={machineIcon}
                      alt="Máquina"
                      className={classes.gymEquipmentIcon}
                    />
                    <FormControlLabel
                      label="Máquina"
                      control={
                        <Checkbox
                          name="machine"
                          id="07f465bf-dff8-44d4-a6fe-2f587c2dda65"
                          onChange={handleChange}
                        />
                      }
                    />
                  </Grid>
                  <Grid item container style={{ marginTop: '2em' }} md={5}>
                    <img
                      src={treadmillIcon}
                      alt="Treadmill"
                      className={classes.gymEquipmentIcon}
                    />
                    <FormControlLabel
                      label="Esteira"
                      control={
                        <Checkbox
                          name="treadmill"
                          onChange={handleChange}
                          id="28c27709-9560-49f2-9802-4fdd3aedf002"
                        />
                      }
                    />
                  </Grid>
                  <Grid item container style={{ marginTop: '2em' }} md={5}>
                    <img
                      src={benchIcon}
                      alt="Bench"
                      className={classes.gymEquipmentIcon}
                    />
                    <FormControlLabel
                      label="Supino"
                      control={
                        <Checkbox
                          name="bench"
                          id="4ee40f12-e816-4b9f-afa4-0c67fe90da0e"
                          onChange={handleChange}
                        />
                      }
                    />
                  </Grid>
                  <Grid item container style={{ marginTop: '2em' }} md={5}>
                    <img
                      src={bycicleIcon}
                      alt="Bycicle"
                      className={classes.gymEquipmentIcon}
                    />
                    <FormControlLabel
                      label="Bicicleta"
                      control={
                        <Checkbox
                          name="bycicle"
                          onChange={handleChange}
                          id="2a8e7cef-1217-4f38-99d4-b457dddc7f30"
                        />
                      }
                    />
                  </Grid>
                  <Grid item container style={{ marginTop: '2em' }} md={5}>
                    <img
                      src={gymBallIcon}
                      alt="Balll"
                      className={classes.gymEquipmentIcon}
                    />
                    <FormControlLabel
                      label="Bola"
                      control={
                        <Checkbox
                          name="ball"
                          onChange={handleChange}
                          id="78c2506d-3554-4719-a6e0-d226b6c7d8ba"
                        />
                      }
                    />
                  </Grid>
                </Grid>
              </FormGroup>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSubmit}
                style={{ marginTop: '2em', marginBottom: '2em' }}
              >
                Confirmar
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert
          severity={alert.severity}
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
              const date = new Date();
              const year = date.getFullYear();
              const month = date.getMonth();
              const day = date.getDate();
              const { hour } = appointmentContainer;
              const parsedDate = new Date(year, month, day, Number(hour));
              const formattedHour = format(parsedDate, 'HH:mm');

              return (
                <Grid
                  container
                  direction="column"
                  className={`
                  ${classes.appointmentContainer}
                    ${
                      isSameDay(parsedDate, selectedDate) &&
                      isSameHour(parsedDate, selectedDate)
                        ? `${classes.trainingNow}`
                        : undefined
                    }
                  `}
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
                            {workoutStatus(
                              appointmentContainer.hour,
                              appointmentContainer.status,
                            )}
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
                        onClick={() => openDialog(appointmentContainer.hour)}
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
