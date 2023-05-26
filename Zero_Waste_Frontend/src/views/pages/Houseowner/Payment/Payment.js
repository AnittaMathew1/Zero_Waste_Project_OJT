import React, { useState } from 'react'
import mainbg from '../../../../assets/images/HouseOwner/RazorPay/main-bg.png'
import icons from '../../../../assets/images/HouseOwner/RazorPay/icons.png'
import { useNavigate } from 'react-router-dom'
import { postRequest } from '../../../../components/Commonhttp/Commonhttp'
import { CButton, CCard, CCardBody, CForm, CFormInput, CInputGroup } from '@coreui/react'
import Status from 'src/enums/Status'
import Payments from '../../../../enums/Payments'
const Payment = () => {
  const current = new Date()
  const paydate = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`
  const navigate = useNavigate()
  const [totalAmount, setTotalAmount] = useState('')
  let billGenerationData = { userid: parseInt(sessionStorage.getItem('userid')) }
  postRequest('houseowner/billgeneration', billGenerationData).then((res) => {
    setTotalAmount(res.grandTotal)
  })

  //function for completing payment through razor pay
  const handlesubmit = (e) => {
    e.preventDefault()
    let options = {
      key: Payments.KEY,
      key_secret: Payments.KEY_SECRET,
      amount: totalAmount * 100,
      currenty: 'INR',
      name: 'Zero_Waste',
      description: 'Zero Waste Project',
      handler: (response) => {
        const billPaymentData = {
          userid: parseInt(sessionStorage.getItem('userid')),
          paydate,
          grandtotal: totalAmount,
          status: Status.STATUS_PAID,
        }
        postRequest('houseowner/billpayment', billPaymentData).then((resJson) => {
          if (resJson.message) {
            navigate('/houseowner-dashboard')
          }
        })
      },
      prefill: {
        name: '',
        email: '',
        contact: '',
      },
      notes: {
        address: '',
      },
      theme: {
        color: '#000',
      },
    }
    let pay = new window.Razorpay(options)
    pay.open()
  }
  return (
    <section className="main">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="column-wrap justify-content-between">
              <div className="banner-img">
                <img src={mainbg} alt="Razorpay demo reacjs" />
              </div>
              <div className="title">
                <div className="title-content">
                  <h1>Razorpay Payment</h1>
                </div>
              </div>
              <div className="technology">
                <div className="tech-logo">
                  <img src={icons} alt="Razorpay test payment" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="column-wrap justify-content-center">
              <div className="fxt-form">
                <CCard className="p-4">
                  <CCardBody>
                    <h3 className="mb-3">
                      <center>Pay Now</center>
                    </h3>
                    <CForm className="row g-2 needs-validation">
                      <CInputGroup>
                        <CFormInput type="text" value={totalAmount} placeholder={totalAmount} />
                      </CInputGroup>
                      <CButton type="submit" color="primary" onClick={handlesubmit}>
                        Continue
                      </CButton>
                    </CForm>
                  </CCardBody>
                </CCard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Payment
