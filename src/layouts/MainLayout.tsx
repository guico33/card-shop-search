import { AppBar, Box, Toolbar, Typography } from '@mui/material';

import LogoutButton from '../components/LogoutButton';
import SignInButton from '../components/SignInButton';
import useAuthContext from '../contexts/AuthContext/useAuthContext';

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user } = useAuthContext();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Card Shop Search
          </Typography>
          {user ? (
            <Box display="flex" alignItems={'center'} gap={1}>
              <Typography variant="body1" sx={{ marginRight: 2 }}>
                {user.email}
              </Typography>
              <LogoutButton />
            </Box>
          ) : (
            <SignInButton />
          )}
        </Toolbar>
      </AppBar>
      {children}
    </Box>
  );
};

export default MainLayout;
