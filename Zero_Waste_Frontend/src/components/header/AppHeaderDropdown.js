import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import AuthContext from '../../views/pages/login/Authcontext'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const authCtx = useContext(AuthContext)

  //function for handling logout functionality
  const HandleLogout = () => {
    sessionStorage.removeItem('jwt')
    sessionStorage.removeItem('userid')
    sessionStorage.removeItem('role')
    sessionStorage.removeItem('employee_id')
    authCtx.isLoggedIn = false
    navigate('/login')
  }
  //function for navigating to user profile page
  const HandleUserProfile = () => {
    navigate('/userprofile')
  }
  return (
    <div className="d-flex justify-content-end">
      <CDropdown variant="nav-item" className="justify-content-end">
        <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
          <CAvatar color="secondary">User</CAvatar>
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownHeader className="bg-light fw-semibold py-2">Account</CDropdownHeader>
          <CDropdownDivider />
          <CDropdownItem type="button" onClick={HandleUserProfile}>
            <CIcon icon={cilUser} className="me-2" />
            My Profile
          </CDropdownItem>
          <CDropdownItem type="button" onClick={HandleLogout}>
            <CIcon icon={cilLockLocked} className="me-2" />
            Logout
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
    </div>
  )
}
export default AppHeaderDropdown
