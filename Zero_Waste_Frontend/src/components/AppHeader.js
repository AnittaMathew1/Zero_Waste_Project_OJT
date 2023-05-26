import React from 'react'
import { NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { CContainer, CHeader, CHeaderNav, CNavLink, CNavItem, CHeaderDivider } from '@coreui/react'
import AuthContext from '../views/pages/login/Authcontext'
import Roles from 'src/enums/Roles'
import { AppHeaderDropdown } from './header'
import AppBreadcrumb from './AppBreadcrumb'

const AppHeader = (event) => {
  const navigate = useNavigate()
  const authCtx = useContext(AuthContext)
  let role = parseInt(sessionStorage.getItem('role'))

  //function for handling login functionality
  const handleLogin = () => {
    navigate('/login')
  }
  if (sessionStorage.getItem('jwt')) {
    authCtx.isLoggedIn = true
  }
  if (authCtx.isLoggedIn) {
    if (role === Roles.HOUSEOWNER) {
      return (
        <CHeader position="sticky" className="mb-4">
          <CHeaderNav className="d-md-flex me-auto">
            <CNavItem>
              <CNavLink to="/houseowner-dashboard" component={NavLink} active>
                Dashboard
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink to="/slotbooking" component={NavLink} active>
                Book Slot
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink to="/bookinghistory" component={NavLink} active>
                Booking History
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink to="/invoice" component={NavLink} active>
                Payment
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink to="/paymenthistory" component={NavLink} active>
                Payment History
              </CNavLink>
            </CNavItem>
            <div className="position-absolute end-0">
              <CHeaderNav className="ms-2">
                <AppHeaderDropdown />
              </CHeaderNav>
            </div>
          </CHeaderNav>
          <CHeaderDivider />
          <AppBreadcrumb />
        </CHeader>
      )
    } else if (role === Roles.SUPERADMIN) {
      return (
        <CHeader position="sticky" className="mb-4">
          <CHeaderNav className="d-md-flex me-auto">
            <CNavItem>
              <CNavLink to="/wastereport" component={NavLink} active>
                Dashboard
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink to="/houseowner-list" component={NavLink} active>
                User List
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink to="/update-supervisor" component={NavLink} active>
                Update Supervisors
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink to="/supervisor-list" component={NavLink} active>
                Supervisor List
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink to="/update-wastecharge" component={NavLink} active>
                Waste Collection Charge
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink to="/wastecollectionstatus" component={NavLink} active>
                Waste Collection Status
              </CNavLink>
            </CNavItem>
            <div className="position-absolute end-0">
              <CHeaderNav className="ms-2">
                <AppHeaderDropdown />
              </CHeaderNav>
            </div>
          </CHeaderNav>
          <CHeaderDivider />
          <AppBreadcrumb />
        </CHeader>
      )
    } else if (role === Roles.ADMIN) {
      return (
        <CHeader position="sticky" className="mb-4">
          <CHeaderNav className="d-md-flex me-auto">
            <CNavItem>
              <CNavLink to="/wastereport" component={NavLink} active>
                Dashboard
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink to="/allocatecollector" component={NavLink} active>
                Allocate Collector
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink to="/supervisor-list" component={NavLink} active>
                Supervisor List
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink to="/update-wastecharge" component={NavLink} active>
                Waste Collection Charge
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink to="/wastecollectionstatus" component={NavLink} active>
                Waste Collection Status
              </CNavLink>
            </CNavItem>
            <div className="position-absolute end-0">
              <CHeaderNav className="ms-2">
                <AppHeaderDropdown />
              </CHeaderNav>
            </div>
          </CHeaderNav>
          <CHeaderDivider />
          <AppBreadcrumb />
        </CHeader>
      )
    } else if (role === Roles.SUPERVISOR) {
      return (
        <CHeader position="sticky" className="mb-4">
          <CHeaderNav className="d-md-flex me-auto">
            <CNavItem>
              <CNavLink to="/supervisor-dashboard" component={NavLink} active>
                Dashboard
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink to="/allocatecollector" component={NavLink} active>
                Allocate Collection date
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink to="/waste-collection-update" component={NavLink} active>
                Waste Collection Update
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink to="/collector-list" component={NavLink} active>
                Waste Collectors
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink to="/update-collector-list" component={NavLink} active>
                Update Collectors
              </CNavLink>
            </CNavItem>
            <div className="position-absolute end-0">
              <CHeaderNav className="ms-2">
                <AppHeaderDropdown />
              </CHeaderNav>
            </div>
          </CHeaderNav>
          <CHeaderDivider />
          <AppBreadcrumb />
        </CHeader>
      )
    }
  } else {
    return (
      <CHeader position="sticky" className="mb-4">
        <CContainer fluid>
          <CHeaderNav className="d-md-flex me-auto">
            <CNavItem>
              <CNavLink to="/home" component={NavLink} active>
                Home
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink to="/about" component={NavLink} active>
                About
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink to="/login" component={NavLink} onClick={handleLogin} active>
                Login
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink to="/register" component={NavLink} active>
                Register
              </CNavLink>
            </CNavItem>
          </CHeaderNav>
        </CContainer>
        <CHeaderDivider />
        <AppBreadcrumb />
      </CHeader>
    )
  }
}

export default AppHeader
