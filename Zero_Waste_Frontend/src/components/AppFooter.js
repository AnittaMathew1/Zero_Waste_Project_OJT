import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <p rel="noopener noreferrer">Kakkanad Municipality Corporation &amp; Dashboard Template</p>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
