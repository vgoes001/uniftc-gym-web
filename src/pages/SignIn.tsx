import React, { useState } from 'react';
import {
  Grid,
  Card,
  TextField,
  CardContent,
  Button,
  InputAdornment,
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import { Person, Lock } from '@material-ui/icons/';
import NumberFormat from 'react-number-format';
import Snackbar from '@material-ui/core/Snackbar';
import { useAuth } from '../hooks/AuthContext';
import background from '../assets/signin-background.jpg';

interface alertProps {
  open: boolean;
  message: string;
  backgroundColor: string;
}

const schema = yup.object().shape({
  enrollment: yup
    .number()
    .typeError('O campo matricula deve ser um número')
    .required('O campo matrícula é obrigatório'),
  password: yup
    .string()
    .required('A senha é obrigatória')
    .min(6, 'A senha deve conter no mínimo 8 dígitos'),
});

const SignIn: React.FC = () => {
  const { signIn } = useAuth();
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    backgroundColor: '',
  });

  const theme = useTheme();
  const matchesXS = useMediaQuery(theme.breakpoints.down('xs'));
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });
  return (
    <form
      onSubmit={handleSubmit(data => {
        signIn({ enrollment: data.enrollment, password: data.password }).then(
          response => {
            if (!response) {
              setAlert({
                open: true,
                message: 'Falha na autenticação, tente novamente!',
                backgroundColor: '#FF3232',
              });
            }
          },
        );
      })}
    >
      <Snackbar
        open={alert.open}
        message={alert.message}
        ContentProps={{ style: { backgroundColor: alert.backgroundColor } }}
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        onClose={() => setAlert({ ...alert, open: false })}
        autoHideDuration={4000}
      />
      <Grid
        container
        style={{
          height: '100vh',
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
        }}
        justify="center"
        alignItems="center"
      >
        <Grid item>
          <Card style={{ padding: matchesXS ? '1em' : '3em' }}>
            <CardContent>
              <Grid container direction="column" spacing={3}>
                <Grid item>
                  <NumberFormat
                    label="Matricula"
                    customInput={TextField}
                    name="enrollment"
                    inputRef={register}
                    type="text"
                    helperText={errors.enrollment?.message}
                    error={errors.enrollment && true}
                    isNumericString
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Senha"
                    inputRef={register}
                    name="password"
                    type="password"
                    error={errors.password && true}
                    helperText={errors.password?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item container justify="center">
                  <Grid item>
                    <Button variant="contained" color="primary" type="submit">
                      Entrar
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </form>
  );
};

export default SignIn;
