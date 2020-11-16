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

type Users = Array<{
  name: string;
  userId: string;
  course: string;
  enrollment: string;
}>;

const StudentCard: React.FC<Users> = () => {
  const theme = useTheme();
  return (
    <Grid item xs={6} sm={4} md={3} lg={2}>
      <Card>
        <CardContent>
          <Typography>Aluno</Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default StudentCard;
