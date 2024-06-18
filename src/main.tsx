import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from './App.tsx';
import LinksProvider from './contexts/LinksContext/LinksProvider.tsx';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ThemeProvider theme={theme}>
    <QueryClientProvider client={queryClient}>
      <LinksProvider>
        <CssBaseline />
        <App />
      </LinksProvider>
    </QueryClientProvider>
  </ThemeProvider>,
);