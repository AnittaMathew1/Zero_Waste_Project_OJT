import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CRow,
  CModal,
  CModalHeader,
  CCardHeader,
  CCardTitle,
  CFormLabel,
  CAlert,
  CFormInput,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CCallout } from '@coreui/react'
import { postRequest } from '../../../components/Commonhttp/Commonhttp'
import Role from '../../../enums/Roles'
import Toast from 'src/components/Toast/Toast'
import Title_Status from '../../../enums/ToastTitle'

const UserProfile = () => {
  const navigate = useNavigate()
  let employeeId = parseInt(sessionStorage.getItem('employee_id'))
  let roleId = parseInt(sessionStorage.getItem('role'))
  let userId = parseInt(sessionStorage.getItem('userid'))
  const [firstname, setFirstname] = useState()
  const [lastname, setLastname] = useState()
  const [email, setEmail] = useState()
  const [address, setAddress] = useState()
  const [phoneno, setPhoneno] = useState()
  const [wardname, setWardname] = useState()
  const [visible, setVisible] = useState(false)
  const [oldPassword, setOldPassword] = useState()
  const [newPassword, setNewPassword] = useState()
  const [confirmPassword, setConfirmPassword] = useState()
  const [toast, setToast] = useState({})
  const [errorMessage, setErrorMessage] = useState(null)
  const [validated, setValidated] = useState(false)
  const [role, setRole] = useState()
  const [avatar, setAvatar] = useState()

  useEffect(() => {
    getProfileData()
  }, [])

  const getProfileData = () => {
    if (roleId == Role.HOUSEOWNER) {
      let houseownerProfileData = { userid: userId }
      postRequest('houseowner/userprofile', houseownerProfileData)
        .then((data) => {
          setFirstname(data.data[0].firstName)
          setLastname(data.data[0].lastName)
          setEmail(data.data[0].email)
          setPhoneno(data.data[0].phoneNo)
          setAddress(data.data[0].address)
          setWardname(data.data[0].wardName)
          setAvatar(data.data[0].firstName[0] + data.data[0].lastName[0])
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      let corporationProfileData = { userId: employeeId, roleId: roleId }
      postRequest('corporation/userprofile', corporationProfileData)
        .then((data) => {
          if (roleId === Role.SUPERVISOR) {
            setFirstname(data.data[0].firstName)
            setLastname(data.data[0].lastName)
            setWardname(data.data[0].wardName)
          }
          setRole(data.data[0].role)
          setEmail(data.data[0].email)
          setPhoneno(data.data[0].phoneNo)
          setAvatar(data.data[0].role[0])
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  //function for making cmodal form visible
  const handlePasswordChange = () => {
    setVisible(true)
  }
  //function for setting old password
  const handleOldPassword = (event) => {
    event.preventDefault()
    setOldPassword(event.target.value)
    setErrorMessage(null)
  }

  //function for setting new password
  const handleNewPassword = (event) => {
    event.preventDefault()
    setNewPassword(event.target.value)
    setErrorMessage(null)
  }

  //function for setting confirm password
  const handleConfirmPassword = (event) => {
    event.preventDefault()
    setConfirmPassword(event.target.value)
    setErrorMessage(null)
  }

  //function for API call for update password functionality
  const updatePassword = () => {
    setValidated(true)
    if (oldPassword && newPassword && confirmPassword) {
      if (oldPassword === newPassword) {
        setErrorMessage('Dont use old password. Give a new one')
      }
      if (!newPassword || !confirmPassword || newPassword != confirmPassword) {
        setErrorMessage('New password and confirm password do not match')
      }
      let data = {
        userid: userId,
        old_password: oldPassword,
        new_password: newPassword,
      }

      postRequest('login/changepassword', data).then((response) => {
        setValidated(false)
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setVisible(false)
        let toastData
        if (response.errorMessage) {
          toastData = { title: Title_Status['TITLE_SUCCESS'], description: response.message }
        } else {
          toastData = { title: Title_Status['TITLE_FAILED'], description: response.errorMessage }
        }
        setToast(toastData)
      })
    }
  }

  //funtion for handling button click and navigate to dashboard
  const handleButton = () => {
    navigate('/houseowner-dashboard')
  }
  if (roleId === Role.HOUSEOWNER || roleId === Role.SUPERVISOR) {
    return (
      <div>
        <Toast toastMessage={toast} />
        <CCard>
          <CCardHeader>My Profile</CCardHeader>
          <CCardBody>
            <center>
              <CRow className="align-items-center">
                <CCol className="align-self-center">
                  <CCardTitle>
                    <div className="avatar avatar-lg bg-secondary">{avatar}</div>
                  </CCardTitle>
                </CCol>
              </CRow>
              <CCardTitle>
                {firstname}&nbsp;{lastname}
              </CCardTitle>
            </center>
            <CForm className="row g-3">
              <CCol md={6}>
                <CCallout color="success" id="inputEmail4">
                  <b>Email:</b>&nbsp; {email}
                </CCallout>
              </CCol>
              <CCol md={6}>
                <CCallout color="success" id="inputEmail4">
                  <b>Phone No:</b>&nbsp; {phoneno}
                </CCallout>
              </CCol>
              {roleId === Role.HOUSEOWNER ? (
                <CCol xs={12}>
                  <CCallout color="success" id="inputAddress">
                    <b>Address:</b>&nbsp; {address}
                  </CCallout>
                </CCol>
              ) : null}
              <CCol xs={12}>
                <CCallout color="success" id="inputAddress">
                  <b>Ward Name:</b>&nbsp; {wardname}
                </CCallout>
              </CCol>
              <CCol md={6}>
                <CCallout color="success" id="inputCity">
                  <b>City:</b>&nbsp; Trivandrum
                </CCallout>
              </CCol>
              <CCol md={4}>
                <CCallout color="success" id="inputState">
                  <b>State:</b>&nbsp; Kerala
                </CCallout>
              </CCol>
            </CForm>
            <div className="d-flex justify-content-between mt-3">
              <CButton type="button" onClick={handleButton}>
                Back to Dashboard
              </CButton>
              <CButton type="button" className="ml-3 mt-3" onClick={handlePasswordChange}>
                Change Password
              </CButton>
            </div>
          </CCardBody>
        </CCard>
        <CModal size="lg" visible={visible} onClose={() => setVisible(false)}>
          <CModalHeader>
            <CModalTitle>Update password of {email}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm noValidate validated={validated}>
              {errorMessage && (
                <CAlert color="danger" className="mt-3">
                  {errorMessage}
                </CAlert>
              )}
              <CFormLabel htmlFor="old_password">Old Password</CFormLabel>
              <CFormInput
                type="password"
                name="old_password"
                className="mb-2"
                feedbackInvalid="Please give old password."
                required
                onChange={(event) => {
                  handleOldPassword(event)
                }}
              />
              <CFormLabel htmlFor="new_password">New Password</CFormLabel>
              <CFormInput
                type="password"
                name="new_password"
                className="mb-2"
                feedbackInvalid="Please give new password."
                required
                onChange={(event) => {
                  handleNewPassword(event)
                }}
              />
              <CFormLabel htmlFor="confirmPassword">Confirm Password</CFormLabel>
              <CFormInput
                type="password"
                name="confirmPassword"
                className="mb-2"
                feedbackInvalid="Please confirm new password."
                required
                onChange={(event) => {
                  handleConfirmPassword(event)
                }}
              />
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton
              type="submit"
              onClick={(event) => {
                event.preventDefault()
                updatePassword()
              }}
            >
              Update
            </CButton>

            <CButton color="secondary" onClick={() => setVisible(false)}>
              Close
            </CButton>
          </CModalFooter>
        </CModal>
      </div>
    )
  } else {
    return (
      <div>
        <Toast toastMessage={toast} />
        <CCard>
          <CCardHeader>My Profile</CCardHeader>
          <CCardBody>
            <center>
              <CRow className="align-items-center">
                <CCol className="align-self-center">
                  <CCardTitle>
                    <div className="avatar avatar-lg bg-secondary">{avatar}</div>
                  </CCardTitle>
                </CCol>
              </CRow>
              <CCardTitle>{role}</CCardTitle>
            </center>
            <CForm className="row g-3">
              <CCol md={6}>
                <CCallout color="success" id="inputEmail4">
                  <b>Email:</b>&nbsp; {email}
                </CCallout>
              </CCol>
              <CCol md={6}>
                <CCallout color="success" id="inputEmail4">
                  <b>Phone No:</b>&nbsp; {phoneno}
                </CCallout>
              </CCol>
              <CCol md={6}>
                <CCallout color="success" id="inputCity">
                  <b>City:</b>&nbsp; Trivandrum
                </CCallout>
              </CCol>
              <CCol md={4}>
                <CCallout color="success" id="inputState">
                  <b>State:</b>&nbsp; Kerala
                </CCallout>
              </CCol>
            </CForm>
            <div className="d-flex justify-content-between mt-3">
              <CButton type="button" onClick={handleButton}>
                Back to Dashboard
              </CButton>
              <CButton type="button" className="ml-3 mt-3" onClick={handlePasswordChange}>
                Change Password
              </CButton>
            </div>
          </CCardBody>
        </CCard>
        <CModal size="lg" visible={visible} onClose={() => setVisible(false)}>
          <CModalHeader>
            <CModalTitle>Update password of {email}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm noValidate validated={validated}>
              {errorMessage && (
                <CAlert color="danger" className="mt-3">
                  {errorMessage}
                </CAlert>
              )}
              <CFormLabel htmlFor="old_password">Old Password</CFormLabel>
              <CFormInput
                type="password"
                name="old_password"
                className="mb-2"
                feedbackInvalid="Please give old password."
                required
                onChange={(event) => {
                  handleOldPassword(event)
                }}
              />
              <CFormLabel htmlFor="new_password">New Password</CFormLabel>
              <CFormInput
                type="password"
                name="new_password"
                className="mb-2"
                feedbackInvalid="Please give new password."
                required
                onChange={(event) => {
                  handleNewPassword(event)
                }}
              />
              <CFormLabel htmlFor="confirmPassword">Confirm Password</CFormLabel>
              <CFormInput
                type="password"
                name="confirmPassword"
                className="mb-2"
                feedbackInvalid="Please confirm new password."
                required
                onChange={(event) => {
                  handleConfirmPassword(event)
                }}
              />
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton
              type="submit"
              onClick={(event) => {
                event.preventDefault()
                updatePassword()
              }}
            >
              Update
            </CButton>

            <CButton color="secondary" onClick={() => setVisible(false)}>
              Close
            </CButton>
          </CModalFooter>
        </CModal>
      </div>
    )
  }
}
export default UserProfile
