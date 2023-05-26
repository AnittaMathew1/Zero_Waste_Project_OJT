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
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilLockLocked,
  cilUser,
  cilAddressBook,
  cilLocationPin,
  cilBuilding,
  cilPhone,
} from '@coreui/icons'
import { postRequest, getRequest } from '../../../components/Commonhttp/Commonhttp'

const Register = () => {
  const navigate = useNavigate()
  const [validated, setValidated] = useState(false)
  const [firstName, setFirstname] = useState('')
  const [lastName, setLastname] = useState('')
  const [address, setAddress] = useState('')
  const [pincode, setPincode] = useState('')
  const [ward, setWard] = useState('')
  const [phoneno, setPhoneno] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailValidationErrorr, setEmailValidationErrorr] = useState('')
  const [phoneNoValidationErrorr, setPhoneNoValidationErrorr] = useState('')
  const [wardData, setWardData] = useState()

  useEffect(() => {
    getWardData()
  }, [])

  //function for getting ward list
  const getWardData = () => {
    getRequest('corporation/warddata')
      .then((res) => {
        setWardData(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  //function for setting first name
  const handleFirstname = (e) => {
    e.preventDefault()
    setFirstname(e.target.value)
  }

  //function for setting last name
  const handleLastname = (e) => {
    e.preventDefault()
    setLastname(e.target.value)
  }

  //function for setting address
  const handleAddress = (e) => {
    e.preventDefault()
    setAddress(e.target.value)
  }

  //function for setting pincode
  const handlePincode = (e) => {
    e.preventDefault()
    setPincode(e.target.value)
  }

  //function for setting ward number
  const handleWard = (e) => {
    e.preventDefault()
    setWard(e.target.value)
  }

  //function for setting phone number
  const handlePhoneno = (e) => {
    e.preventDefault()
    setPhoneno(e.target.value)
    setPhoneNoValidationErrorr('')
  }

  //function for setting email
  const handleEmail = (e) => {
    e.preventDefault()
    setEmail(e.target.value)
    setEmailValidationErrorr('')
  }
  //function for setting password
  const handlePassword = (e) => {
    e.preventDefault()
    setPassword(e.target.value)
  }

  //function for form submit and API call for user registration functionality
  const handleSubmit = (event) => {
    event.preventDefault()
    console.log("handlesubmit")
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    setValidated(true)
    console.log("beforepostreq",firstName,lastName,address,pincode,ward,phoneno,email,password)
    if (firstName && lastName && address && pincode && ward && phoneno && email && password) {
      console.log("beforepostreq1")
      const signupdata = {
        firstName,
        lastName,
        address,
        pincode,
        wardno: ward,
        phoneno,
        email,
        password,
      }
      postRequest('houseowner/registerhouseowner', signupdata).then((res) => {
        console.log("beforenav")
        if (res.message) {
          console.log("login")
          navigate('/login')
        } else {
          setEmailValidationErrorr(res.error_email)
          setPhoneNoValidationErrorr(res.error_phoneno)
        }
      })
    }
  }
  return (
    <div data-testid="register-component" className="bg-white min-vh-100 d-flex flex-row align-items-center">
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
                  <h1>Register</h1>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      data-testid="firstname"
                      type="text"
                      aria-describedby="validationCustom03Feedback"
                      feedbackInvalid="Please enter First Name."
                      placeholder="First Name"
                      required
                      onChange={(e) => handleFirstname(e)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                    data-testid="lastname"
                      placeholder="Last Name"
                      type="text"
                      aria-describedby="validationCustom03Feedback"
                      feedbackInvalid="Please enter Last Name."
                      required
                      onChange={(e) => handleLastname(e)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                    data-testid="email"
                      placeholder="Email"
                      aria-describedby="validationCustom03Feedback"
                      feedbackInvalid="Please enter valid Email."
                      type="email"
                      required
                      onChange={(e) => handleEmail(e)}
                    />
                    {emailValidationErrorr && (
                      <div className="text-danger">{emailValidationErrorr}</div>
                    )}
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilPhone} />
                    </CInputGroupText>
                    <CFormInput
                    data-testid="phoneno"
                      placeholder="Phoneno"
                      type="tel"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      minLength={10}
                      aria-describedby="validationCustom03Feedback"
                      feedbackInvalid="Please enter Phone valid number."
                      required
                      onChange={(e) => handlePhoneno(e)}
                    />
                    {phoneNoValidationErrorr && (
                      <p className="text-danger">{phoneNoValidationErrorr}</p>
                    )}
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilAddressBook} />
                    </CInputGroupText>
                    <CFormInput
                      data-testid="address"
                      placeholder="Address"
                      type="text"
                      aria-describedby="validationCustom03Feedback"
                      feedbackInvalid="Please enter Address."
                      required
                      onChange={(e) => handleAddress(e)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLocationPin} />
                    </CInputGroupText>
                    <CFormInput
                      data-testid="pincode"
                      placeholder="Pincode"
                      type="text"
                      aria-describedby="validationCustom03Feedback"
                      feedbackInvalid="Please enter valid Pincode."
                      pattern="[0-9]{6}"
                      minLength={6}
                      maxLength={6}
                      required
                      onChange={(e) => handlePincode(e)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilBuilding} />
                    </CInputGroupText>
                    <CFormSelect
                      data-testid="ward"
                      placeholder="Select Ward"
                      aria-label="Default select example"
                      className="mb-.5"
                      feedbackInvalid="Please select Wardname."
                      required
                      onChange={(e) => handleWard(e)}
                    >
                      {wardData?.map((ward) => {
                        return (
                          <option key={ward.wardNo} value={ward.wardNo}>
                            {ward.wardName}
                          </option>
                        )
                      })}
                    </CFormSelect>
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                    data-testid="password"
                      type="password"
                      aria-describedby="validationCustom03Feedback"
                      feedbackInvalid="Please enter Password."
                      placeholder="Password"
                      required
                      onChange={(e) => handlePassword(e)}
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton data-testid="signup-button" color="success" type="submit">
                      Create Account
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

export default Register
