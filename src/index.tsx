import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import { App } from './App'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { handleServerError } from './functions/handle-server-error'

export const queryClient = new QueryClient()

queryClient.setDefaultOptions({
  queries: {
    onError: e => handleServerError()(e as any),
    refetchOnWindowFocus: false
  }
})

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App/>
        <ReactQueryDevtools/>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
//
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
