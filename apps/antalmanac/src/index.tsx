import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import theme from "./theme";
import { SnackbarProvider } from 'notistack'
import { ThemeProvider } from '@mui/material'
import { unregister } from './serviceWorker'
import App from '$components/App'

createRoot(document.getElementById('app') as HTMLElement).render(
  <StrictMode>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
            <App />
        </SnackbarProvider>
    </ThemeProvider>
  </StrictMode>
)

unregister()
