import DataTable from 'react-data-table-component'
import React, { useEffect, useState } from 'react'
import { CButton } from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import { getRequest } from '../../../../components/Commonhttp/Commonhttp'

const SupervisorList = () => {
  const [supervisorData, setSupervisorData] = useState([])
  const navigate = useNavigate()
  useEffect(() => {
    getSupervsiorData()
  }, [])

  //Function for getting supervisor data
  const getSupervsiorData = () => {
    getRequest('corporation/wardwise-supervisorlist').then((res) => {
      setSupervisorData(res.data)
    })
  }

  //Function for nagivate to update supervisor page
  const handleUpdate = () => {
    navigate('/update-supervisor')
  }
  const columns = [
    {
      name: 'Name',
      selector: (row) => row.firstName + ' ' + row.lastName,
    },
    {
      name: 'Phone Number',
      selector: (row) => row.phoneNo,
    },
    {
      name: 'Ward',
      selector: (row) => row.wardName,
    },
  ]
  return (
    <div>
      <div className="d-flex justify-content-end">
        <CButton type="button" color="primary" className="mt-n5 px-4 mb-2" onClick={handleUpdate}>
          Update
        </CButton>
      </div>
      <div>
        <DataTable
          class="table table-striped"
          highlightOnHover
          data={supervisorData}
          columns={columns}
          pagination
        />
      </div>
    </div>
  )
}
export default SupervisorList
