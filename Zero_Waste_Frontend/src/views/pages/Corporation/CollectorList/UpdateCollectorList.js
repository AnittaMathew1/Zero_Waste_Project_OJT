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
import { postRequest } from '../../../../components/Commonhttp/Commonhttp'
import Toast from 'src/components/Toast/Toast'
import Title_Status from '../../../../enums/ToastTitle'

const UpdateCollectorList = () => {
  const [data, setData] = useState()
  const [firstName, setFirstName] = useState()
  const [lastName, setLastName] = useState()
  const [address, setAddress] = useState()
  const [collector_id, setCollector_id] = useState()
  const [phoneno, setPhoneno] = useState()
  const [email, setEmail] = useState()
  const [visible, setVisible] = useState(false)
  const [toast, setToast] = useState({})
  const [errorMessage, setErrorMessage] = useState(null)
  const [validated, setValidated] = useState(false)
  let supervisorId = sessionStorage.getItem('employee_id')
  useEffect(() => {
    getCollectorData()
  }, [])
  const getCollectorData = () => {
    let collectorListData = { supervisor_id: supervisorId }
    postRequest('corporation/collectorlist', collectorListData)
      .then((response) => {
        setData(response.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const handleAddCollector = () => {
    setVisible(!visible)
  }
  const handleDeleteCollector = (id) => {
    let deleteSupervisorData = { collector_id: id }
    postRequest('corporation/delete-collector', deleteSupervisorData)
      .then((response) => {
        let toastData
        if (response.message) {
          getCollectorData()
          toastData = { title: Title_Status['TITLE_SUCCESS'], description: response.message }
        } else {
          toastData = { title: Title_Status['TITLE_FAILED'], description: response.errorMessage }
        }
        setToast(toastData)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const handleSupervisorNameChange = (id, firstname, lastname, address, phoneno, email) => {
    setVisible(!visible)
    setCollector_id(id)
    setFirstName(firstname)
    setLastName(lastname)
    setAddress(address)
    setPhoneno(phoneno)
    setEmail(email)
  }
  const updateSupervisor = () => {
    if (collector_id) {
      let supervisorUpdateData = {
        collector_id: collector_id,
        firstName: firstName,
        lastName: lastName,
        address: address,
        phoneno: phoneno,
        email: email,
      }
      postRequest('corporation/update-collector', supervisorUpdateData)
        .then((response) => {
          let toastData
          if (response.message) {
            getCollectorData()
            toastData = { title: Title_Status['TITLE_SUCCESS'], description: response.message }
          } else {
            toastData = { title: Title_Status['TITLE_FAILED'], description: response.errorMessage }
          }
          setToast(toastData)
          setCollector_id(null)
          setFirstName(null)
          setLastName(null)
          setAddress(null)
          setPhoneno(null)
          setEmail(null)
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      let collectorAddData = {
        supervisor_id: supervisorId,
        firstName: firstName,
        lastName: lastName,
        address: address,
        phoneno: phoneno,
        email: email,
      }
      postRequest('corporation/add-collector', collectorAddData)
        .then((response) => {
          let toastData
          if (response.message) {
            getCollectorData()
            toastData = { title: Title_Status['TITLE_SUCCESS'], description: response.message }
          } else {
            toastData = { title: Title_Status['TITLE_FAILED'], description: response.errorMessage }
          }
          setToast(toastData)
          setFirstName(null)
          setLastName(null)
          setAddress(null)
          setPhoneno(null)
          setEmail(null)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
  const columns = [
    {
      name: 'Name',
      selector: (row) => row.firstName + ' ' + row.lastName,
    },
    {
      name: 'Address',
      selector: (row) => row.address,
    },
    {
      name: 'Phone Number',
      selector: (row) => row.phoneNo,
    },
    {
      name: 'Email',
      selector: (row) => row.email,
    },
    {
      name: 'Action',
      cell: (row) => (
        <button
          type="button"
          className="btn btn-primary btn-sm"
          color="primary"
          onClick={() =>
            handleSupervisorNameChange(
              row.id,
              row.firstname,
              row.lastname,
              row.address,
              row.phoneno,
              row.email,
            )
          }
        >
          Update
        </button>
      ),
      button: true,
    },
    {
      name: '',
      cell: (row) => (
        <button
          type="button"
          className="btn btn-primary btn-sm"
          color="primary"
          onClick={() => handleDeleteCollector(row.id)}
        >
          Delete
        </button>
      ),
      button: true,
    },
  ]
  return (
    <div>
      <center>
        <div className="w-100">
          <Toast toastMessage={toast} />
          <div className="d-flex justify-content-end">
            <CButton
              type="button"
              color="primary"
              className="align-self-end  px-4"
              onClick={handleAddCollector}
            >
              Add Collector
            </CButton>
          </div>
          <DataTable
            className="table table-striped"
            columns={columns}
            data={data}
            pagination
            highlightOnHover
            pointerOnHover
          />
        </div>
      </center>
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader onClose={() => setVisible(false)}>
          <CModalTitle>Update Collector</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm noValidate validated={validated}>
            {errorMessage && (
              <CAlert color="danger" className="mt-3">
                {errorMessage}
              </CAlert>
            )}
            <CFormLabel>Firstname</CFormLabel>
            <CFormInput
              type="first_name"
              name="first_name"
              className="mb-2"
              feedbackInvalid="Please enter first_name."
              required
              value={firstName}
              onChange={(event) => {
                setFirstName(event.target.value)
                setErrorMessage(null)
              }}
            />
            <CFormLabel>Last Name</CFormLabel>
            <CFormInput
              type="last_name"
              name="last_name"
              className="mb-2"
              feedbackInvalid="Please give new password."
              required
              value={lastName}
              onChange={(event) => {
                setLastName(event.target.value)
                setErrorMessage(null)
              }}
            />
            <CFormLabel>Address</CFormLabel>
            <CFormInput
              type="address"
              name="address"
              className="mb-2"
              feedbackInvalid="Please give new password."
              required
              value={address}
              onChange={(event) => {
                setAddress(event.target.value)
                setErrorMessage(null)
              }}
            />
            <CFormLabel>Phone Number</CFormLabel>
            <CFormInput
              type="phoneno"
              name="phoneno"
              className="mb-2"
              feedbackInvalid="Please enter Phone number."
              required
              value={phoneno}
              onChange={(event) => {
                setPhoneno(event.target.value)
                setErrorMessage(null)
              }}
            />
            <CFormLabel>Email</CFormLabel>
            <CFormInput
              type="email"
              name="email"
              className="mb-2"
              feedbackInvalid="Please enter Email."
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                setErrorMessage(null)
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
    </div>
  )
}
export default UpdateCollectorList
