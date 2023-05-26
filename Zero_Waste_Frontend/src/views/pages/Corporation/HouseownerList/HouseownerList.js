import DataTable from 'react-data-table-component'
import React, { useEffect, useState } from 'react'
import { getRequest } from '../../../../components/Commonhttp/Commonhttp'

const HouseownerList = () => {
  const [data, setData] = useState([])
  useEffect(() => {
    getRequest('corporation/houseowners-list').then((res) => {
      setData(res.data)
    })
  }, [])
  const columns = [
    {
      name: 'Name',
      selector: (row) => row.fullName,
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
    {
      name: 'Ward',
      selector: (row) => row.wardName,
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
export default HouseownerList
