import React from 'react'
import './style.css'

const Alert = ({ errors, label }) => {
  return (
    errors &&
    errors.map(value => {
      if (value.field == label) {
        return <div key={value.message}><p className='alert'> *{value.message} </p></div>
      }
    })
  )
}

export default Alert