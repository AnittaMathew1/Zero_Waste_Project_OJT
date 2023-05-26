import React from 'react'
import { render, waitFor, fireEvent } from './customRender'
import { screen, act } from '@testing-library/react'
import Login from 'src/views/pages/login/Login'
import * as api from '../components/Commonhttp/Commonhttp'

jest.mock('../components/Commonhttp/Commonhttp')

describe('Login Component', () => {
  beforeEach(() => jest.clearAllMocks())

  test('should show input validation messages for invalid email field', async () => {
    api.postRequest.mockResolvedValueOnce({
      message: 'Login successful',
      role: 1,
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODQyMzI1NTUsIml',
      userid: 1,
    })
    await act(async () => {
      render(<Login />)
    })
    await waitFor(() => {
      const emailInput = screen.getByTestId('email')
      const password = screen.getByTestId('password')

      fireEvent.change(emailInput, { target: { value: 'anitta@gmail.com' } })
      fireEvent.change(password, { target: { value: 'hhhhhhhhh' } })

      const submitButton = screen.getByText('Login')
      fireEvent.click(submitButton)
    })
    const emailValidationMessage = screen.getByText('Please enter email.')
    expect(emailValidationMessage).toHaveStyle({ display: 'block' })
  })

  test('should show input validation messages for null password field', async () => {
    api.postRequest.mockResolvedValueOnce({
      message: 'Login successful',
      role: 1,
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODQyMzI1NTUsIml',
      userid: 1,
    })
    await act(async () => {
      render(<Login />)
    })
    await waitFor(() => {
      const emailInput = screen.getByTestId('email')
      const passwordNullInput = screen.getByTestId('password')
      fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } })
      fireEvent.change(passwordNullInput, { target: { value: 'dhfj' } })
      const submitButton = screen.getByText('Login')
      fireEvent.click(submitButton)
    })
    const passwordValidationMessage = screen.getByText('Please enter password.')
    expect(passwordValidationMessage).toHaveStyle({ display: 'block' })
  })

  test('should show input validation messages for null email field', async () => {
    api.postRequest.mockResolvedValueOnce({
      message: 'Login successful',
      role: 1,
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODQyMzI1NTUsIml',
      userid: 1,
    })
    await act(async () => {
      render(<Login />)
    })
    await waitFor(() => {
      const emailInput = screen.getByTestId('email')
      const passwordNullInput = screen.getByTestId('password')

      fireEvent.change(emailInput, { target: { value: '' } })
      fireEvent.change(passwordNullInput, { target: { value: 'test' } })

      const submitButton = screen.getByText('Login')
      fireEvent.click(submitButton)
    })
    const emailValidationMessage = screen.getByText('Please enter email.')
    expect(emailValidationMessage).toBeVisible()
  })

  test('Should redirect to dashboard on successful login ', async () => {
    api.postRequest.mockResolvedValueOnce({
      message: 'Login Successful',
    })
    await act(async () => {
      render(<Login />)
    })
    await waitFor(() => {
      const email = screen.getByTestId('email')
      const password = screen.getByTestId('password')
      fireEvent.change(email, { target: { value: 'anju@gmail.com' } })
      fireEvent.change(password, { target: { value: 'anjusha' } })
      fireEvent.click(screen.getByText('Login'))
    })
    expect(window.location.pathname).toBe('/houseowner-dashboard')
  })

  test('should store jwt token at the time of login', async () => {
    api.postRequest.mockResolvedValueOnce({
      role: 1,
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODQyMzI1NTUsIml',
      userid: 1,
    })
    await act(async () => {
      render(<Login />)
    })
    await waitFor(() => {
      const email = screen.getByTestId('email')
      const password = screen.getByTestId('password')
      const submit = screen.getByRole('button', { name: 'Login' })
      fireEvent.change(email, { target: { value: 'anju@gmail.com' } })
      fireEvent.change(password, { target: { value: 'anjusha' } })
      fireEvent.click(submit)
    })
    expect(window.sessionStorage.getItem('jwt')).toEqual(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODQyMzI1NTUsIml',
    )
    expect(window.sessionStorage.getItem('role')).toEqual('1')
    expect(window.sessionStorage.getItem('userid')).toEqual('1')
  })

  test('displays toast on error', async () => {
    api.postRequest.mockRejectedValueOnce(new Error('API Error'))
    await act(async () => {
      render(<Login />)
    })
    await waitFor(() => {
      fireEvent.change(screen.getByTestId('email'), { target: { value: 'test@example.com' } })
      fireEvent.change(screen.getByTestId('password'), { target: { value: 'password123' } })
      const submitButton = screen.getByText('Login')
      fireEvent.click(submitButton)
    })
    await new Promise((resolve) => setTimeout(resolve, 300))
    expect(screen.getByText('Error Occured')).toBeVisible()
  })

  test('should display error message if user is invalid', async () => {
    api.postRequest.mockResolvedValueOnce({
      errorMessage: 'Invalid email or password',
    })
    await waitFor(() => {
      render(<Login />)
    })
    await waitFor(() => {
      const email = screen.getByTestId('email')
      const password = screen.getByTestId('password')
      const submit = screen.getByRole('button', { name: 'Login' })
      fireEvent.change(email, { target: { value: 'invalid@gmail.com' } })
      fireEvent.change(password, { target: { value: 'invalid password' } })
      fireEvent.click(submit)
    })
    // await new Promise(process.nextTick) 
    await new Promise((resolve) => setTimeout(resolve, 300))
    // await waitFor(() => {
    const userValidationError = screen.getByTestId('user-validation-error')
    expect(userValidationError.textContent).toBe('Invalid email or password')
  // })
  })
})
