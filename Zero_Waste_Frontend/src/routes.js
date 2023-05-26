import React from 'react'
import Home from './views/pages/Home/Home'
import Type from './views/pages/Home/Type'
import Register from './views/pages/register/Register'
import Login from './views/pages/login/Login'
import About from './views/pages/About/About'
import PaymentHistory from './views/pages/Houseowner/PaymentHistory/PaymentHistory'
import CollectorList from './views/pages/Corporation/CollectorList/CollectorList'
import UpdateCollectorList from './views/pages/Corporation/CollectorList/UpdateCollectorList'
import WasteDataTable from './views/pages/Corporation/SuperAdmin/UpdateWasteDetails/UpdateWasteDetails'
import Bill from './views/pages/Houseowner/Payment/Invoice'
import SupervisorTable from './views/pages/Corporation/UpdateSupervisor/UpdateSupervisor'
import Payment from './views/pages/Houseowner/Payment/Payment'
import BookingHistory from './views/pages/Houseowner/BookingHistory/BookingHistory'
import BookingStatus from './views/pages/Houseowner/BookingStatus/BookingStatus'
import SlotBooking from './views/pages/Houseowner/SlotBooking/SlotBooking'
import UserProfile from './views/pages/UserProfile/UserProfile'
import SupervisorList from './views/pages/Corporation/SupervisorList/SupervisorList'
import HouseownerList from './views/pages/Corporation/HouseownerList/HouseownerList'
import WasteCollectionUpdate from './views/pages/Corporation/Supervisor/WasteCollectionUpdate/WasteCollectionUpdate'
import WasteReport from './views/pages/Corporation/SuperAdmin/WasteReport/wastereport'
import Homeservices from './views/pages/Houseowner/HouseownerLandingPage/HouseownerLandingPage'
import SupervisorDashboard from './views/pages/Corporation/Supervisor/SupervisorDashboard/SupervisorDasboard'
import AllocateCollector from './views/pages/Corporation/CollectorAllocation/AllocateCollector'
import WasteCollectionStatus from './views/pages/Corporation/WasteCollectionStatus/WasteCollectionStatus'

const routes = [
  { path: '/', element: Home, name: 'Home' },
  { path: '/Home', name: 'Home', element: Home },
  { path: '/Type', name: 'Type', element: Type },
  { path: '/register', name: 'Register', element: Register },
  { path: '/login', name: 'Login', element: Login },
  { path: '/about', name: 'About', element: About },
  { path: '/invoice', name: 'Payment', element: Bill },
  { path: '/payment', name: 'Payment', element: Payment },
  { path: '/houseowner-dashboard', name: 'Dashboard', element: Homeservices },
  { path: '/bookingstatus', name: 'Booking Status', element: BookingStatus },
  { path: '/bookinghistory', name: 'Booking History', element: BookingHistory },
  { path: '/slotbooking', name: 'Book Slot', element: SlotBooking },
  { path: '/userprofile', name: 'My Profile', element: UserProfile },
  { path: '/allocatecollector', name: 'Allocate Collection Date', element: AllocateCollector },
  { path: '/wastereport', name: 'Dashboard', element: WasteReport },
  { path: '/collector-list', name: 'Collectors List', element: CollectorList },
  { path: '/update-collector-list', name: 'Update Collectors', element: UpdateCollectorList },
  { path: '/supervisor-dashboard', name: 'Dashboard', element: SupervisorDashboard },
  { path: '/houseowner-list', name: 'User List', element: HouseownerList },
  { path: '/supervisor-list', name: 'Supervisor List', element: SupervisorList },
  { path: '/paymenthistory', name: 'Payment History', element: PaymentHistory },
  { path: '/update-wastecharge', name: 'Waste Charge List', element: WasteDataTable },
  { path: '/update-supervisor', name: 'Supervisor Update', element: SupervisorTable },
  {
    path: '/wastecollectionstatus',
    name: 'Waste Collection Status',
    element: WasteCollectionStatus,
  },
  {
    path: '/waste-collection-update',
    name: 'Waste Collection Update',
    element: WasteCollectionUpdate,
  },
]

export default routes
