import React from 'react'
import { useState } from 'react'
import { Form } from 'react-bootstrap'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'
import { postRequest } from '../../../../../components/Commonhttp/Commonhttp'
import './WasteCollectionUpdate.css'
import Toast from 'src/components/Toast/Toast'
import Title_Status from '../../../../../enums/ToastTitle'

const WasteCollectionUpdate = () => {
  const [status, setStatus] = useState('')
  const [validated, setValidated] = useState(false)
  const [toast, setToast] = useState()
  const [collectionDate, setCollectiondate] = useState()
  let employeeId = parseInt(sessionStorage.getItem('employee_id'))

  //function for setting collection date
  const handleCollectionDate = (e) => {
    e.preventDefault()
    setCollectiondate(e.target.value)
  }

  //function for setting collection status
  const handleStatus = (e) => {
    e.preventDefault()
    setStatus(e.target.value)
  }
  //function for form submit and API call
  const handleSubmit = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      setValidated(false)
      event.preventDefault()
      event.stopPropagation()
    }
    setValidated(true)
    if (collectionDate && status) {
      const collectionUpdate = {
        employee_id: employeeId,
        collection_date: collectionDate,
        status: status,
      }
      postRequest('corporation/collectionstatusupdate', collectionUpdate)
        .then((resJson) => {
          let toastData
          if (resJson.message) {
            toastData = { title: Title_Status['TITLE_SUCCESS'], description: resJson.message }
          } else {
            toastData = { title: Title_Status['TITLE_FAILED'], description: resJson.errorMessage }
          }
          setToast(toastData)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  return (
    <div className="bg-white min-vh-80 d-flex flex-row align-items-center">
      <Toast toastMessage={toast} />
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm
                    md={8}
                    className="row g-3 needs-validation"
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit}
                  >
                    <h3>Update Collection details</h3>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilTrash} />
                      </CInputGroupText>
                      <CFormSelect
                        type="select"
                        placeholder="Select Waste Type"
                        aria-label="Default select example"
                        className="mb-.5"
                        feedbackInvalid="Please select Waste type."
                        id="validationCustom01"
                        required
                        onChange={(e) => handleStatus(e)}
                      >
                        <option>Select Status</option>
                        <option value="Collected">Collected</option>
                        <option value="Pending">Pending</option>
                      </CFormSelect>
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilTrash} />
                      </CInputGroupText>
                      <Form.Group controlId="dob" className="formgroup">
                        <Form.Control
                          className="mb-.5 "
                          type="date"
                          name="date"
                          placeholder="Select date"
                          onChange={(e) => handleCollectionDate(e)}
                          style={{ borderRadius: '0', width: '300%' }}
                        />
                      </Form.Group>
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4">
                          Submit
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default WasteCollectionUpdate
