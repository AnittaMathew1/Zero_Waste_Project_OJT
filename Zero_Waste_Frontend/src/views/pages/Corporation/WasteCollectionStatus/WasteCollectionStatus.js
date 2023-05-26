import DataTable from 'react-data-table-component'
import React, { useState } from 'react'
import { CBadge } from '@coreui/react'
import { Form } from 'react-bootstrap'
import '../../Houseowner/BookingHistory/BookingHistory.css'
import { CContainer, CRow, CCol, CCard, CCardBody } from '@coreui/react'
import { postRequest } from '../../../../components/Commonhttp/Commonhttp'
const WasteCollectionStatus = () => {
  const [data, setData] = useState([])

  //function for getting waste collection data w.r.t the selected date
  const fetchCollectionData = (value) => {
    let wasteCollectionData = { collection_date: value }
    postRequest('corporation/wastecollectionstatus', wasteCollectionData)
      .then((data) => {
        setData(data.data[0])
      })
      .catch((err) => {
        console.log(err)
      })
  }

  //function for setting collection date
  const handleCollectionDate = (e) => {
    e.preventDefault()
    fetchCollectionData(e.target.value)
  }
  const columns = [
    {
      name: 'Ward Name ',
      selector: (row) => row.wardName,
    },
    {
      name: 'Supervisor',
      selector: (row) => row.supervisorName,
    },
    {
      name: 'Status',
      selector: (row) => (
        <CBadge
          color={
            row.status === 'Pending'
              ? 'warning'
              : row.status === 'Collector Allocated'
              ? 'warning'
              : row.status === 'Cancelled'
              ? 'danger'
              : row.status === 'Collected'
              ? 'success'
              : 'primary'
          }
        >
          {row.status}
        </CBadge>
      ),
    },
  ]
  return (
    <div>
      <CContainer>
        <CCard>
          <CCardBody>
            <CRow className="align-items-start">
              <CCol>
                <h6>Select Date</h6>
                <Form.Group controlId="dob">
                  <Form.Control
                    type="date"
                    name="dob"
                    placeholder="Date of Birth"
                    onChange={(e) => handleCollectionDate(e)}
                  />
                </Form.Group>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
        <div>
          <DataTable className="table table-striped" data={data} columns={columns} pagination />
        </div>
      </CContainer>
    </div>
  )
}
export default WasteCollectionStatus
