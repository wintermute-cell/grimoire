import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.tsx'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { theme } from './theme.ts';
import { Notifications } from '@mantine/notifications';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <Notifications limit={5} zIndex={1000} position='bottom-right' />
      <App />
    </MantineProvider>
  </StrictMode>,
)
