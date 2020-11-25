import { createMuiTheme } from '@material-ui/core/styles';

const mainBlue = '#0093FF';
const mainRed = '#FF1273';

export default createMuiTheme({
  palette: {
    primary: {
      main: mainRed,
    },
    secondary: {
      main: mainBlue,
    },
  },
});
