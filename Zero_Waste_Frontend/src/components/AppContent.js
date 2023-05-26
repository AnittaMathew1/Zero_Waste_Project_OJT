import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useContext } from 'react'
import { CContainer } from '@coreui/react'
import SupervisorList from 'src/views/pages/Corporation/SupervisorList/SupervisorList'
import Roles from 'src/enums/Roles'
import AuthContext from '../views/pages/login/Authcontext'
import WasteDataTable from 'src/views/pages/Corporation/SuperAdmin/UpdateWasteDetails/UpdateWasteDetails'
import Bill from 'src/views/pages/Houseowner/Payment/Invoice'
import Payment from 'src/views/pages/Houseowner/Payment/Payment'
import CollectorList from 'src/views/pages/Corporation/CollectorList/CollectorList'
import UpdateCollectorList from 'src/views/pages/Corporation/CollectorList/UpdateCollectorList'
import WasteCollectionUpdate from 'src/views/pages/Corporation/Supervisor/WasteCollectionUpdate/WasteCollectionUpdate'
import WasteCollectionStatus from 'src/views/pages/Corporation/WasteCollectionStatus/WasteCollectionStatus'
import Homeservices from '../views/pages/Houseowner/HouseownerLandingPage/HouseownerLandingPage'
import AllocateCollector from '../views/pages/Corporation/CollectorAllocation/AllocateCollector'
import PaymentHistory from 'src/views/pages/Houseowner/PaymentHistory/PaymentHistory'
import UserProfile from 'src/views/pages/UserProfile/UserProfile'
import SupervisorTable from 'src/views/pages/Corporation/UpdateSupervisor/UpdateSupervisor'
import HouseownerList from 'src/views/pages/Corporation/HouseownerList/HouseownerList'
const SupervisorDashboard = React.lazy(() =>
  import('../views/pages/Corporation/Supervisor/SupervisorDashboard/SupervisorDasboard'),
)
const BookingStatus = React.lazy(() =>
  import('../views/pages/Houseowner/BookingStatus/BookingStatus'),
)
const WasteReport = React.lazy(() =>
  import('../views/pages/Corporation/SuperAdmin/WasteReport/wastereport'),
)
const BookingHistory = React.lazy(() =>
  import('../views/pages/Houseowner/BookingHistory/BookingHistory'),
)
const SlotBooking = React.lazy(() => import('../views/pages/Houseowner/SlotBooking/SlotBooking'))

const AppContent = () => {
  const authCtx = useContext(AuthContext)
  let role = parseInt(sessionStorage.getItem('role'))
  if (sessionStorage.getItem('jwt')) {
    authCtx.isLoggedIn = true
  }
  if (authCtx.isLoggedIn) {
    if (role === Roles.HOUSEOWNER) {
      return (
        <CContainer lg>
          <Routes>
            <Route
              exact
              path="/houseowner-dashboard"
              name="Houseowner Landing Page"
              element={<Homeservices />}
            />
            <Route
              exact
              path="/bookingstatus"
              name="Booking Status Page"
              element={<BookingStatus />}
            />
            <Route
              exact
              path="/bookinghistory"
              name="Booking History Page"
              element={<BookingHistory />}
            />
            <Route exact path="/slotbooking" name="Slotbooking Page" element={<SlotBooking />} />
            <Route exact path="/userprofile" name="User Profile Page" element={<UserProfile />} />
            <Route
              exact
              path="/paymenthistory"
              name="Payment History Page"
              element={<PaymentHistory />}
            />
            <Route exact path="/invoice" name="Payment Invoice page Page" element={<Bill />} />
            <Route exact path="/payment" name="Payment page Page" element={<Payment />} />
          </Routes>
        </CContainer>
      )
    } else if (role === Roles.SUPERADMIN) {
      return (
        <CContainer lg>
          <Routes>
            <Route exact path="/userprofile" name="User Profile Page" element={<UserProfile />} />
            <Route exact path="/wastereport" name="Waste Report Page" element={<WasteReport />} />
            <Route
              exact
              path="/update-supervisor"
              name="Supervisor Update"
              element={<SupervisorTable />}
            />
            <Route
              exact
              path="/supervisor-list"
              name="Supervisor List"
              element={<SupervisorList />}
            />
            <Route
              path="/houseowner-list"
              name="Houseowner List Page"
              element={<HouseownerList />}
            />
            <Route
              exact
              path="/allocatecollector"
              name="Allocate Collector Page"
              element={<AllocateCollector />}
            />
            <Route
              exact
              path="/update-wastecharge"
              name="Waste Charge List"
              element={<WasteDataTable />}
            />
            <Route
              exact
              path="/wastecollectionstatus"
              name="Waste Collection Status Page"
              element={<WasteCollectionStatus />}
            />
          </Routes>
        </CContainer>
      )
    } else if (role === Roles.ADMIN) {
      return (
        <CContainer lg>
          <Routes>
            <Route exact path="/userprofile" name="User Profile Page" element={<UserProfile />} />
            <Route exact path="/wastereport" name="Waste Report Page" element={<WasteReport />} />
            <Route
              exact
              path="/houseowner-list"
              name="Houseowner List Page Page"
              element={<HouseownerList />}
            />
            <Route
              exact
              path="/supervisor-list"
              name="Supervisor List Page"
              element={<SupervisorList />}
            />
            <Route
              exact
              path="/allocatecollector"
              name="Allocate Collector Page"
              element={<AllocateCollector />}
            />
            <Route
              exact
              path="/update-supervisor"
              name="Supervisor List"
              element={<SupervisorTable />}
            />
          </Routes>
        </CContainer>
      )
    } else if (role === Roles.SUPERVISOR) {
      return (
        <CContainer lg>
          <Routes>
            <Route exact path="/userprofile" name="User Profile Page" element={<UserProfile />} />
            <Route
              exact
              path="/supervisor-dashboard"
              name="Supervisor Dashboard Page"
              element={<SupervisorDashboard />}
            />
            <Route
              exact
              path="/collector-list"
              name="Collector List Page"
              element={<CollectorList />}
            />
            <Route
              exact
              path="/update-collector-list"
              name="Update Collector List Page"
              element={<UpdateCollectorList />}
            />
            <Route
              path="/allocatecollector"
              name="Allocate Collector Page"
              element={<AllocateCollector />}
            />
            <Route
              exact
              path="/waste-collection-update"
              name="Waste Collection Update Page"
              element={<WasteCollectionUpdate />}
            />
          </Routes>
        </CContainer>
      )
    }
  } else {
    return <Navigate to="/home" />
  }
}

export default React.memo(AppContent)
