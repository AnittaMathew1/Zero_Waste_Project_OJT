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
import { postRequest, getRequest } from '../../../../../components/Commonhttp/Commonhttp'
import Toast from 'src/components/Toast/Toast'
import Title_Status from '../../../../../enums/ToastTitle'

const WasteDataTable = () => {
  const [tableData, setTableData] = useState()
  const [wasteId, setWasteId] = useState()
  const [charge, setCharge] = useState()
  const [visible, setVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [toast, setToast] = useState({})
  const [validated, setValidated] = useState(false)
  const [errorAlert, setErrorAlert] = useState('')

  useEffect(() => {
    getWasteData()
  }, [])

  //Function for getting waste list
  const getWasteData = () => {
    getRequest('corporation/wastedata')
      .then((response) => {
        setTableData(response.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  //Function for setting new charge
  const handleNewCharge = (event) => {
    setCharge(event.target.value)
    setErrorMessage(null)
  }

  //Function for setting waste charge and waste id
  const handleChargeUpdate = (id, charge) => {
    setVisible(!visible)
    setWasteId(id)
    setCharge(charge)
  }

  //Function for API call for updating waste charge
  const updateCharge = () => {
    let wasteDetailsUpdateData = {
      waste_id: wasteId,
      waste_rate: charge,
    }
    setValidated(true)
    if (charge) {
      postRequest('corporation/wastedetails-update', wasteDetailsUpdateData)
        .then((response) => {
          setCharge(null)
          setVisible(false)
          let toastData
          if (response.message) {
            getWasteData()
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
  const columns = [
    {
      name: 'Waste Type',
      selector: (row) => row.wasteType,
    },
    {
      name: 'Collection Charge',
      selector: (row) => row.charge,
    },
    {
      name: 'Action',
      cell: (row) => (
        <button
          type="button"
          className="btn btn-primary btn-sm"
          color="primary"
          onClick={() => handleChargeUpdate(row.id, row.charge)}
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
        <div className="w-85">
          <Toast toastMessage={toast} />
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
            <CFormLabel>Charge</CFormLabel>
            <CFormInput
              type="rupees"
              name="charge"
              className="mb-2"
              feedbackInvalid="Please enter charge."
              required
              value={charge}
              onChange={(event) => {
                handleNewCharge(event)
              }}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={() => updateCharge()}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}
export default WasteDataTable
