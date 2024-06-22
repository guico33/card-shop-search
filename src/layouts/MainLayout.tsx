import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import { useState } from 'react';

import LogoutButton from '../components/LogoutButton';
import SignInButton from '../components/SignInButton';
import useAuthContext from '../contexts/AuthContext/useAuthContext';
import NavigationDrawer from './NavigationDrawer';

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user } = useAuthContext();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleDrawerOpen}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Card Shop Search
          </Typography>
          {user ? (
            <Box display="flex" alignItems={'center'} gap={1}>
              <Typography
                variant="body1"
                sx={{ marginRight: 2 }}
                display={{
                  xs: 'none',
                  sm: 'block',
                }}
              >
                {user.email}
              </Typography>

              <LogoutButton />
            </Box>
          ) : (
            <SignInButton />
          )}
        </Toolbar>
      </AppBar>
      <NavigationDrawer open={drawerOpen} onClose={handleDrawerClose} />
      {children}
    </Box>
  );
};

export default MainLayout;
