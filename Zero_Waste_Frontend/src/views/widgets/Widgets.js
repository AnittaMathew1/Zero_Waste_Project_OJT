import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
} from '@coreui/react'
import { DocsExample } from 'src/components'

import WidgetsBrand from './WidgetsBrand'

const Widgets = () => {

  return (
    <CCard className="mb-4">
      <CCardHeader>Widgets</CCardHeader>
      <CCardBody>
        <DocsExample href="/components/widgets/#cwidgetstatsd">
          <WidgetsBrand />
        </DocsExample>
        <DocsExample href="/components/widgets/#cwidgetstatsd">
          <WidgetsBrand withCharts />
        </DocsExample>
      </CCardBody>
    </CCard>
  )
}

export default Widgets
