import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { CToast, CToastBody, CToastHeader, CToaster } from '@coreui/react'

const Toast = ({ toastMessage }) => {
  const [toast, addToast] = useState(0)
  const toaster = useRef()
  const notificationToast = (
    <CToast data-testid="toast">
      <CToastHeader closeButton>
        <svg
          className="rounded me-2"
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
          role="img"
        >
          <rect width="100%" height="100%" fill="#357a38"></rect>
        </svg>
        <div className="fw-bold me-auto">{toastMessage ? toastMessage['title'] : null}</div>
      </CToastHeader>
      <CToastBody>{toastMessage ? toastMessage['description'] : null}</CToastBody>
    </CToast>
  )
  useEffect(() => {
    if (toastMessage.description) {
      addToast(notificationToast)
    }
  }, [toastMessage])
  return <CToaster ref={toaster} push={toast} placement="top-end" />
}
Toast.propTypes = {
  toastMessage: PropTypes.object.isRequired,
}

export default Toast
