import theme from "./theme";
import { SnackbarProvider } from 'notistack'
import { ThemeProvider } from '@mui/material'
import { unregister } from './serviceWorker'

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

unregister()
