import React from 'react'

export default ({message, onClick}) => {
  if (!message || message.length === 0) return null
  return (
    <div className="alert alert-danger text-light cs-error" role="alert">
      <strong>{message}</strong>
      <button type="button" className="close" aria-label="Close" onClick={onClick}>
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  )
}
