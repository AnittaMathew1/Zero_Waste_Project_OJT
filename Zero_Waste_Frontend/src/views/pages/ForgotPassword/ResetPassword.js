import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked } from '@coreui/icons'
import { postRequest } from '../../../components/Commonhttp/Commonhttp'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [validated, setValidated] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    sessionStorage.setItem('jwt', token)
  }, [])

  //function for setting new password
  const handleNewPassword = (e) => {
    e.preventDefault()
    setNewPassword(e.target.value)
  }

  //function for setting confirm password
  const handleConfirmPassword = (e) => {
    e.preventDefault()
    setConfirmPassword(e.target.value)
  }

  //function for submitting for and API call for reset password functionality
  const handleSubmit = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    setValidated(true)
    if (newPassword && confirmPassword && newPassword === confirmPassword) {
      const forgotPasswordData = {
        password: newPassword,
      }
      postRequest('mailing/reset_password', forgotPasswordData).then((res) => {
        if (res.status === 200) {
          navigate('/login')
        }
        if (res.status !== 200) {
          setErrorMessage('Something went wrong... Try again after some time')
        }
      })
    }
  }
  return (
    <div className="bg-white min-vh-70 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm
                  className="row g-3 needs-validation"
                  noValidate
                  validated={validated}
                  onSubmit={handleSubmit}
                >
                  <h3>Reset Password</h3>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      aria-describedby="validationCustom03Feedback"
                      feedbackInvalid="Please enter Firstname."
                      placeholder="New Password"
                      id="validationCustom01"
                      required
                      onChange={(e) => handleNewPassword(e)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Confirm Password"
                      type="password"
                      aria-describedby="validationCustom03Feedback"
                      feedbackInvalid="Please enter Lastname."
                      id="validationCustom01"
                      required
                      onChange={(e) => handleConfirmPassword(e)}
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton color="success" type="submit">
                      Submit
                    </CButton>
                  </div>
                  {errorMessage && <div className="errormessage">{errorMessage}</div>}
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default ForgotPassword
