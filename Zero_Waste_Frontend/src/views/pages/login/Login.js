import React from 'react'
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import AuthContext from './Authcontext'
import './Login.css'
import Roles from 'src/enums/Roles'
import Toast from 'src/components/Toast/Toast'
import Title_Status from 'src/enums/ToastTitle'
import { postRequest } from '../../../components/Commonhttp/Commonhttp'

const Login = () => {
  const navigate = useNavigate()
  const authCtx = useContext(AuthContext)
  const [validated, setValidated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userValidationErrorr, setUserValidationErrorr] = useState('')
  const [toast, setToast] = useState({})

  //function for setting email
  const handleEmail = (e) => {
    e.preventDefault()
    setEmail(e.target.value)
  }

  //function for setting password
  const handlePassword = (e) => {
    e.preventDefault()
    setPassword(e.target.value)
    setUserValidationErrorr('')
  }

  //function for navigating to password changing page
  const handleForgotPassword = () => {
    navigate('/forgotpassword')
  }

  //function for form submit and API call for login functionality
  const handleSubmit = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      setValidated(false)
      event.stopPropagation()
    }
    setValidated(true)
    if (email && password && form.checkValidity() === true) {
      let logindata = { email, password }
      postRequest('login/', logindata)
        .then((resJson) => {
          sessionStorage.setItem('jwt', resJson.token)
          sessionStorage.setItem('role', resJson.role)
          sessionStorage.setItem('userid', resJson.userid)
          if (resJson.role === Roles.HOUSEOWNER) {
            authCtx.isLoggedIn = true
            authCtx.login(resJson.token)
            navigate('/houseowner-dashboard')
            authCtx.isLoggedIn = resJson.token
          } else if (resJson.role === Roles.SUPERADMIN || resJson.role === Roles.ADMIN) {
            sessionStorage.setItem('employee_id', resJson.employee_id)
            authCtx.isLoggedIn = true
            authCtx.login(resJson.token)
            navigate('/wastereport')
            authCtx.isLoggedIn = resJson.token
          } else if (resJson.role === Roles.SUPERVISOR) {
            sessionStorage.setItem('employee_id', resJson.employee_id)
            authCtx.isLoggedIn = true
            authCtx.login(resJson.token)
            navigate('/supervisor-dashboard')
          } else {
            setUserValidationErrorr(resJson.errorMessage)
            setValidated(false)
          }
        })
        .catch((err) => {
          setToast({ title: Title_Status['TITLE_ERROR'], description: 'Error Occured' })
        })
    }
  }

  return (
    <div
      className="bg-white max-vh-70 d-flex flex-row align-items-center"
      data-testid="login-component"
    >
      <Toast toastMessage={toast} />
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={10}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm
                    data-testid="form"
                    className="row g-3 needs-validation"
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit}
                  >
                    <h1>Signin</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        data-testid="email"
                        type="email"
                        aria-describedby="validationCustom03Feedback"
                        feedbackInvalid="Please enter email."
                        placeholder="Email"
                        required
                        onChange={(e) => handleEmail(e)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        data-testid="password"
                        type="password"
                        aria-describedby="validationCustom03Feedback"
                        feedbackInvalid="Please enter password."
                        placeholder="Password"
                        required
                        onChange={(e) => handlePassword(e)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={4}>
                        <CButton data-testid="Login" type="submit" color="primary" className="px-4">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={8}>
                        <CButton
                          color="link"
                          className="forgotpassword"
                          size="sm"
                          onClick={handleForgotPassword}
                        >
                          Forgot password?
                        </CButton>
                      </CCol>
                      {userValidationErrorr && (
                        <div data-testid="user-validation-error" className="errormessage">
                          {userValidationErrorr}
                        </div>
                      )}
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5">
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
