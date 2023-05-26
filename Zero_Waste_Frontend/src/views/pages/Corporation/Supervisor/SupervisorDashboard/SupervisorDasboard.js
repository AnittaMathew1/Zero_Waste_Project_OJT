import { useState, useEffect } from 'react'
import CIcon from '@coreui/icons-react'
import DataTable from 'react-data-table-component'
import { CWidgetStatsD, CRow, CCol, CBadge } from '@coreui/react'
import { cilCalendarCheck, cilMoney, cilCalendar, cilTrash } from '@coreui/icons'
import PropTypes from 'prop-types'
import WasteType from '../../../../../enums/WasteType'
import { postRequest } from '../../../../../components/Commonhttp/Commonhttp'

const SupervisorDashboard = ({ withCharts }) => {
  const [plasticCollected, setPlasticCollected] = useState(0)
  const [foodCollected, setFoodCollected] = useState(0)
  const [ewasteCollected, setEwasteCollected] = useState(0)
  const [metalCollected, setMetalCollected] = useState(0)
  const [statusData, setStatusData] = useState([])
  useEffect(() => {
    getData()
    getStatusData()
  }, [])

  // function for getting data for supervisor dashboard
  const getData = () => {
    let supervisorDashboardData = { supervisor_id: sessionStorage.getItem('employee_id') }
    postRequest('corporation/supervisordashboard', supervisorDashboardData)
      .then((data) => {
        setPlasticCollected(data.data.plasticCollected)
        setFoodCollected(data.data.foodCollected)
        setEwasteCollected(data.data.ewasteCollected)
        setMetalCollected(data.data.metalCollected)
        setStatusData(data.data.collection_status)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const getStatusData = () => {
    let supervisorId = sessionStorage.getItem('employee_id')
    let colectionStatusData = { supervisor_id: supervisorId }
    postRequest('corporation/supervisordashboard-status', colectionStatusData).then((res) => {
      setStatusData(res.data)
    })
  }
  const columns = [
    {
      name: 'Houseowner Name',
      selector: (row) => row.houseownerName,
    },
    {
      name: 'Collection Date',
      selector: (row) => row.collectionDate,
    },
    {
      name: 'Waste Type',
      selector: (row) => {
        if (row.wasteType === WasteType.PLASTIC) {
          return 'Plastic Plastic'
        } else if (row.wasteType === WasteType.FOOD) {
          return 'Food Waste'
        } else if (row.wasteType === WasteType.EWASTE) {
          return 'E-Waste'
        } else if (row.wasteType === WasteType.METAL) {
          return 'Metal'
        } else {
          return 'Paper'
        }
      },
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
    <div className="h-100">
      <CRow>
        <CCol>
          <CWidgetStatsD
            className="mb-4"
            icon={<CIcon icon={cilCalendarCheck} height={52} className="my-4 text-white" />}
            values={[{ title: 'Plastic Waste Collected', value: plasticCollected }]}
            style={{
              '--cui-card-cap-bg': '#3b5998',
            }}
          />
        </CCol>

        <CCol>
          <CWidgetStatsD
            className="mb-4"
            icon={<CIcon icon={cilMoney} height={52} className="my-4 text-white" />}
            values={[{ title: 'Food Waste Collected', value: foodCollected }]}
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
            values={[{ title: 'E-Waste Collected', value: ewasteCollected }]}
          />
        </CCol>
        <CCol>
          <CWidgetStatsD
            className="mb-4"
            color="success"
            icon={<CIcon icon={cilTrash} height={52} className="my-4 text-white" />}
            values={[{ title: 'Metal Waste Collected', value: metalCollected }]}
          />
        </CCol>
      </CRow>
      <CRow>
        <DataTable
          class="table table-striped"
          highlightOnHover
          data={statusData}
          columns={columns}
          pagination
        />
      </CRow>
    </div>
  )
}
SupervisorDashboard.propTypes = {
  withCharts: PropTypes.bool,
}
const textstyle = {
  color: 'black',
  textAlign: 'center',
  textdecoration: 'none',
}

export default SupervisorDashboard
