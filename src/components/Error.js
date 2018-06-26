import React from 'react'

export default ({message, onClick}) => (
  <div className="alert alert-danger text-light cs-error cs-empty" role="alert" onClick={onClick}>
    {message}
  </div>
)
