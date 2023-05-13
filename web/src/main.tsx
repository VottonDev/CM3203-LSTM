import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import theme from './theme';
import { CssBaseline, responsiveFontSizes, ThemeProvider } from '@mui/material';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={responsiveFontSizes(theme)}>
      <CssBaseline enableColorScheme />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
