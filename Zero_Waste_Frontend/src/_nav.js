import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilHome, cilInfo, cilPuzzle, cibHackhands } from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'
import RolesEnum from 'src/enums/Roles'
export const getNavItems = () => {
  let role = sessionStorage.getItem('role')
  if (role === RolesEnum.SUPERVISOR) {
    const _nav = [
      {
        component: CNavItem,
        name: 'Collection Status Update',
        to: '/collectionstatusupdate',
        icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
      },
    ]
    return _nav
  } else if (role === RolesEnum.HOUSEOWNER) {
    const _nav = [
      {
        component: CNavItem,
        name: 'Slot Booking',
        to: '/slotbooking',
        icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Booking Status',
        to: '/bookingstatus',
        icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Payment',
        to: '/payment',
        icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Booking History',
        to: '/bookinghistory',
        icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Payment History',
        to: '/paymenthistory',
        icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
      },
    ]
    return _nav
  }
  const _nav = [
    {
      component: CNavItem,
      name: 'Allocate Collector',
      to: '/allocatecollector',
      icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Contract Employees',
      to: '/contractemployees',
      icon: <CIcon icon={cilInfo} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Waste Collection Status',
      to: '/wastecollectionstatus',
      icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    },
  ]
  {
    if (sessionStorage.getItem('role') === RolesEnum.SUPERADMIN) {
      _nav.push({
        component: CNavItem,
        name: 'Update Waste details',
        to: '/updatewastedetails',
        icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
      })
    }
  }
  return _nav
}
