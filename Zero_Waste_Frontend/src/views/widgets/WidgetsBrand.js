import DonutChart from 'react-donut-chart'
import React from 'react'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { CWidgetStatsD, CRow, CCol } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCalendarCheck, cilMoney, cilCalendar } from '@coreui/icons'
import { CCard, CCardBody } from '@coreui/react'
import { postRequest } from 'src/components/Commonhttp/Commonhttp'
import { Chart, ArcElement } from 'chart.js'
Chart.register(ArcElement)

const WidgetsBrand = ({ withCharts }) => {
  const [totalAmount, setTotalAmount] = useState(0)
  const [slotCount, setSlotCount] = useState(0)
  const [pendingSlots, setPendingSlots] = useState(0)
  const [plasticWasteData, setPlasticWasteData] = useState()
  const [foodWasteData, setFoodWasteData] = useState()
  const [metalWasteData, setMetalWasteData] = useState()
  const [ewasteData, setEwasteData] = useState()
  let userId = parseInt(sessionStorage.getItem('userid'))
  let widgetData = { userid: userId }

  const reactDonutChartdata = [
    {
      label: 'Plastic Waste',
      value: plasticWasteData,
    },
    {
      label: 'Food Waste',
      value: foodWasteData,
    },
    {
      label: 'E-Waste',
      value: ewasteData,
    },
    {
      label: 'Metal Waste',
      value: metalWasteData,
    },
  ]
  const reactDonutChartBackgroundColor = ['#00E396', '#FEB019', '#FF4560', '#775DD0']
  const reactDonutChartInnerRadius = 0.5
  const reactDonutChartSelectedOffset = 0.04
  let reactDonutChartStrokeColor = '#FFFFFF'
  const reactDonutChartOnMouseEnter = (item) => {
    let color = reactDonutChartdata.find((q) => q.label === item.label).color
    reactDonutChartStrokeColor = color
  }
  useEffect(() => {
    getData()
  }, [])

  //function for getting data for dashboard
  const getData = () => {
    postRequest('houseowner/billgeneration', widgetData)
      .then((data) => {
        setTotalAmount(data.grandTotal)
      })
      .catch((err) => {
        console.log(err)
      })
    postRequest('houseowner/houseownerdashboard', widgetData)
      .then((data) => {
        setSlotCount(data.data.slotCount)
        setPendingSlots(data.data.pendingSlots)
      })
      .catch((err) => {
        console.log(err)
      })
    postRequest('houseowner/houseownerdashboardgraph', widgetData)
      .then((data) => {
        setPlasticWasteData(data.data.plastic)
        setFoodWasteData(data.data.food)
        setEwasteData(data.data.ewaste)
        setMetalWasteData(data.data.metal)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div data-testid="widget">
      <CRow>
        <CCol>
          <CWidgetStatsD
            className="mb-4"
            icon={<CIcon icon={cilCalendarCheck} height={52} className="my-4 text-white" />}
            values={[{ title: 'Slot Booked', value: slotCount }]}
            style={{
              '--cui-card-cap-bg': '#3b5998',
            }}
          />
        </CCol>

        <CCol>
          <CWidgetStatsD
            className="mb-4"
            icon={<CIcon icon={cilMoney} height={52} className="my-4 text-white" />}
            values={[{ title: 'Pending Payments', value: totalAmount }]}
            style={{
              '--cui-card-cap-bg': '#00aced',
            }}
          />
        </CCol>

        <CCol>
          <CWidgetStatsD
            className="mb-4"
            color="warning"
            icon={<CIcon icon={cilCalendar} height={52} className="my-4 text-white" />}
            values={[{ title: 'Pending Slots', value: pendingSlots }]}
          />
        </CCol>
      </CRow>
      <CCard>
        <CCardBody>
          <center>
            {plasticWasteData && (
              <DonutChart
                width={750}
                onMouseEnter={(item) => reactDonutChartOnMouseEnter(item)}
                strokeColor={reactDonutChartStrokeColor}
                data={reactDonutChartdata}
                colors={reactDonutChartBackgroundColor}
                innerRadius={reactDonutChartInnerRadius}
                selectedOffset={reactDonutChartSelectedOffset}
              />
            )}
          </center>
        </CCardBody>
      </CCard>
    </div>
  )
}

WidgetsBrand.propTypes = {
  withCharts: PropTypes.bool,
}

export default WidgetsBrand
