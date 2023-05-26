import DataTable from 'react-data-table-component'
import React, { useEffect, useState } from 'react'
import { postRequest } from '../../../../components/Commonhttp/Commonhttp'

const PaymentHistory = () => {
  let userId = { userid: sessionStorage.getItem('userid') }
  const [data, setData] = useState([])
  useEffect(() => {
    postRequest('houseowner/paymenthistory', userId).then((res) => {
      setData(res.data)
    })
  }, [])
  const columns = [
    {
      name: 'Total Amount',
      selector: (row) => row.totalAmount,
    },
    {
      name: 'Paid Date',
      selector: (row) => row.payDate,
    },
  ]
  return (
    <div>
      <div className="bookingstatus">
        <DataTable className="statustable" data={data} columns={columns} pagination />
      </div>
    </div>
  )
}

export default PaymentHistory
