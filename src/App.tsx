import { CssBaseline } from '@mui/material';
import createTheme from '@mui/material/styles/createTheme';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Routes } from './constants/router.ts';
import AuthProvider from './contexts/AuthContext/AuthProvider.tsx';
import LinksProvider from './contexts/LinksContext/LinksProvider.tsx';
import History from './pages/History.tsx';
import Home from './pages/Home.tsx';
import ProtectedRoute from './routing/ProtectedRoute.tsx';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: Routes.HOME,
    element: <Home />,
  },
  {
    path: Routes.HISTORY,
    element: <ProtectedRoute element={<History />} />,
  },
]);

const App = () => (
  <ThemeProvider theme={theme}>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <LinksProvider>
          <CssBaseline />
          <RouterProvider router={router} />
        </LinksProvider>
      </QueryClientProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
