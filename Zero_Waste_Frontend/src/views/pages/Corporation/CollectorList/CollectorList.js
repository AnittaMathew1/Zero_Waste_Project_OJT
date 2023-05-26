import DataTable from 'react-data-table-component'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CButton } from '@coreui/react'
import { postRequest } from '../../../../components/Commonhttp/Commonhttp'
const CollectorList = () => {
  const [data, setData] = useState([])
  const navigate = useNavigate()
  let collectorListData = { supervisor_id: sessionStorage.getItem('employee_id') }
  useEffect(() => {
    postRequest('corporation/collectorlist', collectorListData).then((res) => {
      setData(res.data)
    })
  }, [])

  const handleUpdate = () => {
    navigate('/update-collector-list')
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
      name: 'Phone number',
      selector: (row) => row.phoneNo,
    },
    {
      name: 'Email',
      selector: (row) => row.email,
    },
  ]
  return (
    <div>
      <div className="d-flex justify-content-end">
        <CButton type="button" color="primary" className="mb-2  px-4" onClick={handleUpdate}>
          Update Collector List
        </CButton>
      </div>
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
export default CollectorList
