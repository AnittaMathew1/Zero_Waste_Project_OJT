import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { createMemoryHistory } from 'history'
const AllTheProviders = ({ children }) => {
  const history = createMemoryHistory()
  return <BrowserRouter history={history}>{children}</BrowserRouter>
}
const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options })
export * from '@testing-library/react'
export { customRender as render }
