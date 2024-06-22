import HistoryIcon from '@mui/icons-material/History';
import HomeIcon from '@mui/icons-material/Home';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { AppRoutes } from '../constants/router';
import useAuthContext from '../contexts/AuthContext/useAuthContext';

type NavigationDrawerProps = {
  open: boolean;
  onClose: () => void;
};

const NavigationDrawer = ({ open, onClose }: NavigationDrawerProps) => {
  const { user } = useAuthContext();

  const menuItems = () => (
    <Box sx={{ width: 250 }} role="presentation" onClick={onClose} onKeyDown={onClose}>
      <List>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to={AppRoutes.HOME}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        {user && (
          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to={AppRoutes.HISTORY}>
              <ListItemIcon>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText primary="History" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <Drawer open={open} onClose={onClose}>
      {menuItems()}
    </Drawer>
  );
};

export default NavigationDrawer;
