import DataTable from 'react-data-table-component'
import React, { useEffect, useState } from 'react'
import { CBadge } from '@coreui/react'
import { postRequest } from '../../../../components/Commonhttp/Commonhttp'
import '../BookingHistory/BookingHistory.css'

const BookingStatus = () => {
  let userId = { userid: sessionStorage.getItem('userid') }
  const [data, setData] = useState([])
  useEffect(() => {
    postRequest('houseowner/bookingstatus', userId).then((res) => {
      setData(res.data)
    })
  }, [])
  const columns = [
    {
      name: 'Booked Date',
      selector: (row) => row.bookingdate,
    },
    {
      name: 'Collection Date',
      selector: (row) => row.collectiondate,
    },
    {
      name: 'Waste Type',
      selector: (row) => row.wastetype,
    },
    {
      name: 'Supervisor Name',
      selector: (row) => row.supervisorname,
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
      <div>
        <DataTable
          class="table table-striped"
          highlightOnHover
          data={data}
          columns={columns}
          pagination
        />
      </div>
    </div>
  )
}
export default BookingStatus
