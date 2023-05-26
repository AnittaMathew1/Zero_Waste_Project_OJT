import React, { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import {
  CButton,
  CAlert,
  CForm,
  CFormInput,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormLabel,
} from '@coreui/react'
import { postRequest, getRequest } from '../../../../components/Commonhttp/Commonhttp'
import Toast from 'src/components/Toast/Toast'
import Title_Status from '../../../../enums/ToastTitle'
import './UpdateSupervisor.css'

const SupervisorTable = () => {
  const [tableData, setTableData] = useState()
  const [firstName, setFirstName] = useState()
  const [lastName, setLastName] = useState()
  const [phoneno, setPhoneno] = useState()
  const [wardNo, setWardNo] = useState()
  const [supervisorEmail, setSupervisorEmail] = useState()
  const [wardName, setWardName] = useState()
  const [visible, setVisible] = useState(false)
  const [formVisible, setFormVisible] = useState(false)
  const [toast, setToast] = useState({})
  const [errorMessage, setErrorMessage] = useState('')
  const [validated, setValidated] = useState(false)
  const [errorAlert, setErrorAlert] = useState('')

  useEffect(() => {
    getSupervisorData()
  }, [])

  //function for setting firstname
  const handleFirstName = (event) => {
    event.preventDefault()
    setFirstName(event.target.value)
    setErrorMessage(null)
  }

  //function for setting lastname
  const handleLastName = (event) => {
    event.preventDefault()
    setLastName(event.target.value)
    setErrorMessage(null)
  }

  //function for setting phone number
  const handlePhoneNo = (event) => {
    event.preventDefault()
    setPhoneno(event.target.value)
    setErrorMessage(null)
  }

  //function for setting ward name
  const handleWardName = (event) => {
    event.preventDefault()
    setWardName(event.target.value)
    setErrorMessage(null)
  }

  //function for setting ward number
  const handleWardNumber = (event) => {
    event.preventDefault()
    setWardNo(event.target.value)
    setErrorMessage(null)
  }

  //Function for setting email id
  const handleEmail = (event) => {
    event.preventDefault()
    setSupervisorEmail(event.target.value)
    setErrorMessage(null)
  }
  //Function for making the form for adding new ward visible
  const handleAddWard = () => {
    setWardNo(null)
    setFirstName(null)
    setLastName(null)
    setPhoneno(null)
    setWardName(null)
    setWardNo(null)
    setSupervisorEmail(null)
    setFormVisible(!formVisible)
  }

  //Function for the API call for adding new ward and supervisor
  const handleUpdateWardData = () => {
    let addWardData = {
      wardName: wardName,
      wardNumber: wardNo,
      supervisorFirstName: firstName,
      supervisorLastName: lastName,
      supervisorPhoneNo: phoneno,
      supervisorEmail: supervisorEmail,
    }
    setValidated(true)
    if (wardName && wardNo && firstName && lastName && supervisorEmail && phoneno) {
      postRequest('corporation/add-ward', addWardData)
        .then((response) => {
          setValidated(false)
          setFirstName(null)
          setLastName(null)
          setPhoneno(null)
          setFormVisible(false)
          let toastData
          if (response.message) {
            getSupervisorData()
            toastData = { title: Title_Status['TITLE_SUCCESS'], description: response.message }
          } else {
            toastData = { title: Title_Status['TITLE_FAILED'], description: response.errorMessage }
          }
          setToast(toastData)
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      setErrorAlert('Something went wrong')
    }
  }

  //Function for getting ward-wise supervisor details
  const getSupervisorData = () => {
    getRequest('corporation/wardwise-supervisorlist')
      .then((response) => {
        setTableData(response.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  //Function for making form visible for updating supervisor of a ward
  const handleSupervisorNameChange = (
    wardNumber,
    supervisorFirstName,
    supervisorLastName,
    phoneNo,
  ) => {
    setVisible(!visible)
    setWardNo(wardNumber)
    setFirstName(supervisorFirstName)
    setLastName(supervisorLastName)
    setPhoneno(phoneNo)
  }

  //Function for API call for updating supervisor of a ward
  const updateSupervisor = () => {
    let supervisorUpdateData = {
      wardno: wardNo,
      supervisor_firstname: firstName,
      supervisor_lastname: lastName,
      supervisor_phoneno: phoneno,
    }
    setValidated(true)
    if (firstName && lastName && phoneno) {
      postRequest('corporation/supervisor-update', supervisorUpdateData)
        .then((response) => {
          setValidated(false)
          setFirstName(null)
          setLastName(null)
          setPhoneno(null)
          setFormVisible(false)
          setVisible(false)
          let toastData
          if (response.message) {
            getSupervisorData()
            toastData = { title: Title_Status['TITLE_SUCCESS'], description: response.message }
          } else {
            toastData = { title: Title_Status['TITLE_FAILED'], description: response.errorMessage }
          }
          setToast(toastData)
          setFirstName(null)
          setLastName(null)
          setPhoneno(null)
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      setErrorAlert('Something went wrong')
    }
  }

  const columns = [
    {
      name: 'Ward Name',
      selector: (row) => row.wardName,
    },
    {
      name: 'Supervisor Name',
      selector: (row) => row.firstName + ' ' + row.lastName,
    },
    {
      name: 'Phone Number',
      selector: (row) => row.phoneNo,
    },
    {
      name: 'Action',
      cell: (row) => (
        <button
          type="button"
          className="btn btn-primary btn-sm"
          color="primary"
          onClick={() =>
            handleSupervisorNameChange(row.wardNo, row.firstName, row.lastName, row.phoneNo)
          }
        >
          Update
        </button>
      ),
      button: true,
    },
  ]
  return (
    <div>
      <center>
        <div className="w-80">
          <Toast toastMessage={toast} />
          <div className="d-flex justify-content-end">
            <CButton
              type="button"
              color="primary"
              className="align-self-end  px-4"
              onClick={handleAddWard}
            >
              Add Ward
            </CButton>
          </div>
          <DataTable
            className="table table-striped"
            columns={columns}
            data={tableData}
            pagination
            highlightOnHover
            pointerOnHover
          />
          {errorAlert && <div className="errormessage">{errorAlert}</div>}
        </div>
      </center>

      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader onClose={() => setVisible(false)}>
          <CModalTitle>Update Supervisor</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm noValidate validated={validated}>
            {errorMessage && (
              <CAlert color="danger" className="mt-3">
                {errorMessage}
              </CAlert>
            )}
            <CFormLabel>First Name</CFormLabel>
            <CFormInput
              type="first_name"
              name="first_name"
              className="mb-2"
              feedbackInvalid="Please enter First Name."
              required
              value={firstName}
              onChange={(event) => {
                handleFirstName(event)
              }}
            />
            <CFormLabel>Last Name</CFormLabel>
            <CFormInput
              type="last_name"
              name="last_name"
              className="mb-2"
              feedbackInvalid="Please enter Last Name."
              required
              value={lastName}
              onChange={(event) => {
                handleLastName(event)
              }}
            />
            <CFormLabel>Phone Number</CFormLabel>
            <CFormInput
              type="tel"
              name="phoneno"
              className="mb-2"
              pattern="[0-9]{10}"
              maxLength={10}
              minLength={10}
              feedbackInvalid="Please enter Phone number."
              required
              value={phoneno}
              onChange={(event) => {
                handlePhoneNo(event)
              }}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={() => updateSupervisor()}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={formVisible} onClose={() => setFormVisible(false)}>
        <CModalHeader onClose={() => setFormVisible(false)}>
          <CModalTitle>Add Ward</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm noValidate validated={validated}>
            {errorMessage && (
              <CAlert color="danger" className="mt-3">
                {errorMessage}
              </CAlert>
            )}
            <CFormLabel>Ward Name</CFormLabel>
            <CFormInput
              type="wardName"
              name="wardName"
              className="mb-2"
              feedbackInvalid="Please enter Ward Name."
              required
              value={wardName}
              onChange={(event) => {
                handleWardName(event)
              }}
            />
            <CFormLabel>Ward Number</CFormLabel>
            <CFormInput
              type="wardno"
              name="wardno"
              className="mb-2"
              feedbackInvalid="Please enter Ward Number"
              required
              value={wardNo}
              onChange={(event) => {
                handleWardNumber(event)
              }}
            />
            <CFormLabel>First Name</CFormLabel>
            <CFormInput
              type="first_name"
              name="first_name"
              className="mb-2"
              feedbackInvalid="Please enter First Name."
              required
              value={firstName}
              onChange={(event) => {
                handleFirstName(event)
              }}
            />
            <CFormLabel>Last Name</CFormLabel>
            <CFormInput
              type="last_name"
              name="last_name"
              className="mb-2"
              feedbackInvalid="Please enter Last Name."
              required
              value={lastName}
              onChange={(event) => {
                handleLastName(event)
              }}
            />
            <CFormLabel>Phone Number</CFormLabel>
            <CFormInput
              type="tel"
              name="phoneno"
              className="mb-2"
              pattern="[0-9]{10}"
              maxLength={10}
              minLength={10}
              feedbackInvalid="Please enter Phone number."
              required
              value={phoneno}
              onChange={(event) => {
                handlePhoneNo(event)
              }}
            />
            <CFormLabel>Email</CFormLabel>
            <CFormInput
              type="email"
              name="email"
              className="mb-2"
              feedbackInvalid="Please enter Email"
              required
              value={supervisorEmail}
              onChange={(event) => {
                handleEmail(event)
              }}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={() => handleUpdateWardData()}>
            ADD
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default SupervisorTable
