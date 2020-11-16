import React, { useState, useEffect, useCallback } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import { makeStyles, Typography, IconButton } from '@material-ui/core';
import { PowerSettingsNew } from '@material-ui/icons';
import { useAuth } from '../hooks/AuthContext';

interface Props {
  children: React.ReactElement;
}

function ElevationScroll(props: Props): React.ReactElement {
  const { children } = props;

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

const useStyles = makeStyles(theme => ({
  toolbarMargin: {
    ...theme.mixins.toolbar,
  },
  typographPosition: {
    marginLeft: 'auto',
  },
}));

const Header: React.FC = () => {
  const { user, signOut } = useAuth();

  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleSingOut = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      signOut();
    },
    [signOut],
  );

  useEffect(() => {
    if (window.location.pathname === '/' && value !== 0) {
      setValue(0);
    } else if (window.location.pathname === '/signin' && value !== 1) {
      setValue(1);
    }
  }, [value]);
  return (
    <>
      <ElevationScroll>
        <AppBar position="fixed">
          <Toolbar>
            <Typography className={classes.typographPosition}>
              Olá,
              {user.name}
            </Typography>
            <IconButton onClick={handleSingOut}>
              <PowerSettingsNew />
            </IconButton>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <div className={classes.toolbarMargin} />
    </>
  );
};

export default Header;
