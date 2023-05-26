import React from 'react'
import { render, screen, fireEvent, waitFor, act } from './customRender'
import { useNavigate } from 'react-router-dom'
import Register from '../views/pages/register/Register'
import { postRequest, getRequest } from '../components/Commonhttp/Commonhttp'


jest.mock('../components/Commonhttp/Commonhttp', () => ({
  postRequest: jest.fn(),
  getRequest: jest.fn(),
}))

beforeEach(() => jest.clearAllMocks())

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),

  useNavigate: jest.fn(),
}))
describe('Register Component', () => {

  test('should return input validation messages for regitration inputs',async () => {
    getRequest.mockResolvedValueOnce({
      wardName: 'KAZHAKKOOTTAM',
      wardNo: 96,
    })
    postRequest.mockResolvedValueOnce({
      message: 'Successfully Saved',
    })
  await act(async () =>{
    render(<Register />)
  })
  await waitFor(() => {
    const firstnameNullInput = screen.getByTestId('firstname')
    const lastnameNullInput = screen.getByTestId('lastname')
    const addressNullInput = screen.getByTestId('address')
    const phonenoNullInput = screen.getByTestId('phoneno')
    const wardNullInput = screen.getByTestId('ward')
    const emailNullInput = screen.getByTestId('email')
    const passwordNullInput = screen.getByTestId('password')
    const submitButton = screen.getByText('Create Account')

    fireEvent.change(firstnameNullInput, { target: { value: 'ANITTA' } })
    fireEvent.change(lastnameNullInput, { target: { value: '' } })
    fireEvent.change(addressNullInput, { target: { value: '' } })
    fireEvent.change(phonenoNullInput, { target: { value: '' } })
    fireEvent.change(wardNullInput, { target: { value: '' } })
    fireEvent.change(emailNullInput, { target: { value: '' } })
    fireEvent.change(passwordNullInput, { target: { value: '' } })
    fireEvent.click(submitButton)
})
    const firstNameValidationMessage = screen.getByText('Please enter First Name.')
    const lastNameValidationMessage = screen.getByText('Please enter Last Name.')
    const addressValidationMessage = screen.getByText('Please enter Address.')
    const phonenoValidationMessage = screen.getByText('Please enter Phone valid number.')
    const wardValidationMessage = screen.getByText('Please select Wardname.')
    const emailValidationMessage = screen.getByText('Please enter valid Email.')
    const passwordValidationMessage = screen.getByText('Please enter Password.')
    expect(firstNameValidationMessage).toBeVisible()
    expect(lastNameValidationMessage).toBeVisible()
    expect(addressValidationMessage).toBeVisible()
    expect(phonenoValidationMessage).toBeVisible()
    expect(wardValidationMessage).toBeVisible()
    expect(emailValidationMessage).toBeVisible()
    expect(passwordValidationMessage).toBeVisible()
  })

  test('Should redirect to login on successful Registration ', async () => {
    const navigate = jest.fn()
    useNavigate.mockReturnValue(navigate)
    const data = [
      { wardName: 'AAKKULAM', wardNo: 98 },
      { wardName: 'AATTIPRA', wardNo: 96 },
    ]
    getRequest.mockResolvedValue({ data: data })

    const mockData = {
      message: 'Successfully Saved',
    }
    postRequest.mockResolvedValueOnce(mockData)
    await act(async () =>{
      render(<Register />)
    })
    await waitFor(() => {
    const firstnameInput = screen.getByTestId('firstname')
    const lastnameInput = screen.getByTestId('lastname')
    const addressInput = screen.getByTestId('address')
    const phonenoInput = screen.getByTestId('phoneno')
    const pincodeInput = screen.getByTestId('pincode')
    const wardInput = screen.getByTestId('ward')
    const emailInput = screen.getByTestId('email')
    const passwordInput = screen.getByTestId('password')
    const submitButton = screen.getByTestId('signup-button')
      fireEvent.change(firstnameInput, { target: { value: 'test' } })
      fireEvent.change(lastnameInput, { target: { value: 'test' } })
      fireEvent.change(addressInput, { target: { value: 'test house' } })
      fireEvent.change(phonenoInput, { target: { value: '9999999999' } })
      fireEvent.change(wardInput, { target: { value: '98' } })
      fireEvent.change(pincodeInput, { target: { value: '666666' } })
      fireEvent.change(emailInput, { target: { value: 'test111@gmail.com' } })
      fireEvent.change(passwordInput, { target: { value: 'test' } })
      fireEvent.click(submitButton)
    })
      expect(screen.getByPlaceholderText('Last Name')).toHaveValue('test');
      expect(screen.getByPlaceholderText('Phoneno')).toHaveValue('9999999999');
      expect(screen.getByPlaceholderText('Email')).toHaveValue('test111@gmail.com');
      expect(screen.getByPlaceholderText('Address')).toHaveValue('test house');
      expect(screen.getByPlaceholderText('Pincode')).toHaveValue('666666');
      expect(screen.getByPlaceholderText('Password')).toHaveValue('test');
      expect(navigate).toHaveBeenCalledWith('/login');
  })

})
