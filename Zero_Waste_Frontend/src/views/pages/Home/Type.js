import React from 'react'
import Typewriter from 'typewriter-effect'
import './home.css'
function Type() {
  return (
    <div className="type">
      <Typewriter
        options={{
          strings: [
            'Go Green Breathe Clean ',
            'Zero Waste,Save Earth',
            'Use.Recycle.Reuse',
            'Think Before You Trash It',
          ],

          autoStart: true,
          loop: true,
          deleteSpeed: 50,
        }}
      />
    </div>
  )
}
export default Type
