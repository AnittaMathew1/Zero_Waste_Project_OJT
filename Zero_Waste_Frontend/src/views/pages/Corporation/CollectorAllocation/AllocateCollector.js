import React, { useState } from 'react'
import { Form } from 'react-bootstrap'
import { CContainer, CButton, CRow, CCol, CCard, CCardBody } from '@coreui/react'
import '../../Houseowner/BookingHistory/BookingHistory.css'
import { postRequest } from '../../../../components/Commonhttp/Commonhttp'
import Toast from 'src/components/Toast/Toast'
import Title_Status from '../../../../enums/ToastTitle'

const AllocateCollector = () => {
  let employeeId = sessionStorage.getItem('employee_id')
  const [collectionDate, setCollectiondate] = useState()
  const [toast, setToast] = useState({})

  //function for form submit and API call
  const handleSubmit = (event) => {
    event.preventDefault()
    let allocationData = {
      supervisor_id: employeeId,
      collection_date: collectionDate,
    }
    postRequest('corporation/collectorallocation', allocationData)
      .then((data) => {
        let toastData
        if (data.message) {
          toastData = { title: Title_Status['TITLE_SUCCESS'], description: data.message }
        } else {
          toastData = { title: Title_Status['TITLE_FAILED'], description: data.errorMessage }
        }
        setToast(toastData)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  //Function for setting collection date
  const handleCollectionDate = (e) => {
    e.preventDefault()
    setCollectiondate(e.target.value)
  }

  return (
    <div className="bg-white min-vh-80 d-flex flex-row align-items-center">
      <Toast toastMessage={toast} />
      <CContainer>
        <CCard>
          <CCardBody>
            <CRow class="container-fluid">
              <CCol className="align-self-start">
                <h6>Select Collection Date: </h6>
                <Form.Group controlId="dob">
                  <Form.Control
                    className="mt-3 mb-3"
                    type="date"
                    name="dob"
                    placeholder="Collection Date"
                    onChange={(e) => handleCollectionDate(e)}
                  />
                </Form.Group>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
        <div className="d-flex justify-content-center mt-3">
          <CButton className="btn btn-primary btn-lg" onClick={handleSubmit}>
            Allocate
          </CButton>
        </div>
      </CContainer>
    </div>
  )
}
export default AllocateCollector
