import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ApolloProvider } from '@apollo/client/react'
import { store } from './store/index.js'
import { client } from './apollo/client.js'
import { NotificationProvider } from './context/NotificationContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ApolloProvider client={client}>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </ApolloProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
)
