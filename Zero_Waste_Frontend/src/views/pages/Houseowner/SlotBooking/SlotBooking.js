import React from 'react'
import { useState, useEffect } from 'react'
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
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLineWeight, cilTrash } from '@coreui/icons'
import { postRequest, getRequest } from '../../../../components/Commonhttp/Commonhttp'
import Toast from 'src/components/Toast/Toast'
import Title_Status from '../../../../enums/ToastTitle'

const SlotBooking = () => {
  const current = new Date()
  const booking_date = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`
  const [waste, setWaste] = useState()
  const [quantity, setQuantity] = useState()
  const [wasteData, setWasteData] = useState()
  const [validated, setValidated] = useState(false)
  const [toast, setToast] = useState({})
  let userId = parseInt(sessionStorage.getItem('userid'))

  useEffect(() => {
    getWasteData()
  }, [])

  //function for getting waste list
  const getWasteData = () => {
    getRequest('corporation/wastedata')
      .then((response) => {
        setWasteData(response.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  //function for setting waste type
  const handleWaste = (e) => {
    e.preventDefault()
    setWaste(e.target.value)
  }

  //function for setting waste quantity
  const handleQuantity = (e) => {
    e.preventDefault()
    setQuantity(e.target.value)
  }

  //function for submitting the for and API call
  const handleSubmit = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      setValidated(false)
      event.preventDefault()
      event.stopPropagation()
    }
    setValidated(true)
    if (waste && quantity) {
      const slotbookingdata = { waste_id: waste, quantity, booking_date, userId }
      postRequest('houseowner/slotbooking', slotbookingdata)
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
                    <h1>Book Your Slot!</h1>
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
                        onChange={(e) => handleWaste(e)}
                      >
                        <option>Select Waste type</option>
                        {wasteData?.map((waste) => {
                          return (
                            <option key={waste.id} value={waste.id}>
                              {waste.wasteType}
                            </option>
                          )
                        })}
                      </CFormSelect>
                    </CInputGroup>

                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLineWeight} />
                      </CInputGroupText>
                      <CFormInput
                        type="number"
                        min="1"
                        placeholder="Quantity(in Kg)"
                        aria-describedby="validationCustom03Feedback"
                        feedbackInvalid="Please enter quantity."
                        onChange={(e) => handleQuantity(e)}
                        required
                      />
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

export default SlotBooking
