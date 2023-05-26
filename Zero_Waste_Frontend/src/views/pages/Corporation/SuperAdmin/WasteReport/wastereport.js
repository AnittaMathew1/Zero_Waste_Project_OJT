import { CChart } from '@coreui/react-chartjs'
import { useState, useEffect } from 'react'
import CIcon from '@coreui/icons-react'
import { CWidgetStatsD, CRow, CCol } from '@coreui/react'
import { cilCalendarCheck, cilMoney, cilCalendar } from '@coreui/icons'
import { CInputGroup, CFormSelect, CCard, CCardBody } from '@coreui/react'
import PropTypes from 'prop-types'
import './WasteReport.css'
import { postRequest, getRequest } from '../../../../../components/Commonhttp/Commonhttp'

const WasteReport = ({ withCharts }) => {
  const [wasteData, setWasteData] = useState()
  const [graphLabel, setGraphLabel] = useState()
  const [graphValue, setGraphValue] = useState()
  const [highestCopllectedWard, setHighestCopllectedWard] = useState(0)
  const [lowestCopllectedWard, setLowestCopllectedWard] = useState(0)
  const [totalSlotBooked, setTotalSlotBooked] = useState(0)
  const [wasteid, setWasteid] = useState('1')
  useEffect(() => {
    getWasteData()
    getData()
  }, [])

  //function for getting dashboard data for corporation page
  const getData = () => {
    getRequest('corporation/corporationdashboard')
      .then((data) => {
        setHighestCopllectedWard(data.data[0].highestCollectedWard[0])
        setLowestCopllectedWard(data.data[0].lowestCollectedWard[0])
        setTotalSlotBooked(data.data[0].totalSlotBooked)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  //function for getting waste type list
  const getWasteData = () => {
    fetchGraphdata()
    getRequest('corporation/wastedata')
      .then((data) => {
        setWasteData(data.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  //function for setting waste id
  const handleWaste = (e) => {
    e.preventDefault()
    setWasteid(e.target.value)
    fetchGraphdata()
  }

  //function for fetching wardwise- waste report data
  const fetchGraphdata = () => {
    let wasteReportData = { wasteid: wasteid }
    postRequest('corporation/wastereport', wasteReportData)
      .then((data) => {
        getGraphData(data.data[0])
      })
      .catch((err) => {
        console.log(err)
      })
  }

  //function for setting waste report graph
  const getGraphData = (data) => {
    let labels = []
    let values = []
    Object.keys(data).forEach((key) => {
      labels.push(key)
      values.push(data[key])
    })
    setGraphLabel(labels)
    setGraphValue(values)
  }
  const chartOptions = {
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      },
    },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
  }

  return (
    <div>
      <CRow>
        <CCol>
          <CWidgetStatsD
            className="mb-4"
            icon={<CIcon icon={cilCalendarCheck} height={52} className="my-4 text-white" />}
            values={[{ title: 'Highest Slot Booked Ward', value: highestCopllectedWard }]}
            style={{
              '--cui-card-cap-bg': '#3b5998',
            }}
          />
        </CCol>

        <CCol>
          <CWidgetStatsD
            className="mb-4"
            icon={<CIcon icon={cilMoney} height={52} className="my-4 text-white" />}
            values={[{ title: 'Lowest Slot Booked Ward', value: lowestCopllectedWard }]}
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
            values={[{ title: 'Total Slots Booked', value: totalSlotBooked }]}
          />
        </CCol>
      </CRow>
      <CCard>
        <CCardBody>
          <CInputGroup className="mb-3">
            <CFormSelect
              placeholder="Select Waste name"
              aria-label="Default select example"
              className="mb-1"
              feedbackInvalid="Please select Waste name."
              id="validationCustom01"
              required
              onChange={(e) => handleWaste(e)}
            >
              {wasteData?.map((waste) => {
                return (
                  <option key={waste.id} value={waste.id}>
                    {waste.waste_type}
                  </option>
                )
              })}
            </CFormSelect>
          </CInputGroup>

          <CChart
            type="bar"
            data={{
              labels: graphLabel,
              datasets: [
                {
                  label: 'Waste quantity',
                  backgroundColor: '#f87979',
                  data: graphValue,
                },
              ],
            }}
          />
        </CCardBody>
      </CCard>
    </div>
  )
}
WasteReport.propTypes = {
  withCharts: PropTypes.bool,
}
const textstyle = {
  color: 'black',
  textAlign: 'center',
  textdecoration: 'none',
}

export default WasteReport
