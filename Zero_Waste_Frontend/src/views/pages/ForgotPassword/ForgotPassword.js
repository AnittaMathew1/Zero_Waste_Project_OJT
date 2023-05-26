import React from 'react'
import { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CRow,
  CAlert,
  CAlertHeading,
} from '@coreui/react'
import { postRequest } from '../../../components/Commonhttp/Commonhttp'
import Toast from 'src/components/Toast/Toast'
import Title_Status from 'src/enums/ToastTitle'

const PasswordResetEmail = () => {
  const [validated, setValidated] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [toast, setToast] = useState({})
  const [resetMailSuccessMessage, setResetMailSuccessMessage] = useState(false)
  const [resetMailFailedMessage, setResetMailFailedMessage] = useState(false)

  //Function for setting email for which password need to be reset
  const handleResetEmail = (e) => {
    e.preventDefault()
    setResetEmail(e.target.value)
  }

  //function for submitting form and calling API for reset password
  const handleSubmit = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    const data = { email: resetEmail }
    setValidated(true)
    postRequest('mailing/forgot_password', data).then((response) => {
      let toastData
      if (response.message) {
        toastData = { title: Title_Status['TITLE_SUCCESS'], description: response.message }
      } else {
        toastData = { title: Title_Status['TITLE_FAILED'], description: response.errorMessage }
      }
      setToast(toastData)
    })
  }

  return (
    <div className="bg-white min-vh-70 d-flex flex-row align-items-center">
      <Toast toastMessage={toast} />
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
                  <h3>Forgot Password</h3>
                  {resetMailSuccessMessage && (
                    <CAlert color="success">
                      <CAlertHeading component="h4">Well done!</CAlertHeading>
                      <p>Aww yeah, check your mail to find link for password reset.</p>
                      <hr />
                    </CAlert>
                  )}
                  {resetMailFailedMessage && (
                    <CAlert color="success">
                      <CAlertHeading component="h4">OOPS!</CAlertHeading>
                      <p>The given user is invalid.</p>
                      <hr />
                    </CAlert>
                  )}
                  <CInputGroup className="mb-3">
                    <CFormInput
                      type="text"
                      aria-describedby="validationCustom03Feedback"
                      feedbackInvalid="Please enter your email."
                      placeholder="Your email"
                      id="validationCustom01"
                      required
                      onChange={(e) => handleResetEmail(e)}
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton color="success" type="submit">
                      Continue
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default PasswordResetEmail
