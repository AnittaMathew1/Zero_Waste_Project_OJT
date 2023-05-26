import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { useNavigate } from 'react-router-dom'
import { postRequest } from '../../../../components/Commonhttp/Commonhttp'
import './Invoice.css'

const Bill = () => {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [totalAmount, setTotalAmount] = useState('')

  //function for submit button click for proceeding to payment
  const submitHandler = (event) => {
    navigate('/payment')
  }
  useEffect(() => {
    getInvoice()
  }, [])

  //funtion for getting pending payment bill
  const getInvoice = () => {
    let billGenerationData = { userid: parseInt(sessionStorage.getItem('userid')) }
    postRequest('houseowner/billgeneration', billGenerationData)
      .then((response) => {
        setTotalAmount(response.grandTotal)
        setData(response.bill)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const columns = [
    {
      name: 'Waste Type',
      selector: (row) => row.waste_type,
    },
    {
      name: 'Quantity',
      selector: (row) => row.quantity,
    },
    {
      name: 'Unit Price',
      selector: (row) => row.unit_price,
    },
    {
      name: 'Total',
      selector: (row) => row.total,
    },
  ]
  if (totalAmount === 0 || totalAmount === null) {
    return (
      <div>
        <center>
          <div className="card text-center" style={{ width: '18rem' }}>
            <div className="card-body">
              <p className="card-text">No Payment Due</p>
              <a href="/houseowner-dashboard" className="btn btn-primary">
                Dashboard
              </a>
            </div>
          </div>
        </center>
      </div>
    )
  } else {
    return (
      <div>
        <DataTable
          className="table table-striped"
          highlightOnHover
          columns={columns}
          data={data}
          pagination
        />
        <center>
          <div className="card text-center" style={{ width: '18rem' }}>
            <div className="card-body">
              <h5 className="card-title">Total Amount: {totalAmount}</h5>
              <button type="submit" onClick={submitHandler} className="btn btn-primary">
                Pay Now
              </button>
            </div>
          </div>
        </center>
      </div>
    )
  }
}

export default Bill
