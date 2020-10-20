import React from 'react';
import {
  Grid,
  Card,
  TextField,
  CardContent,
  Button,
  InputAdornment,
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Person, Lock } from '@material-ui/icons/';

import background from '../assets/signin-background.jpg';

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
  const theme = useTheme();
  const matchesXS = useMediaQuery(theme.breakpoints.down('xs'));
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });
  return (
    <form onSubmit={handleSubmit(data => alert(JSON.stringify(data)))}>
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
                  <TextField
                    label="Matrícula"
                    name="enrollment"
                    inputRef={register}
                    error={errors.enrollment && true}
                    helperText={errors.enrollment?.message}
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
