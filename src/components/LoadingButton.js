import React from 'react';

export default ({loading, label}) => (
  <button type="submit" className="btn btn-primary btn-block" disabled={loading}>{loading ? <i className="fas fa-circle-notch fa-spin"></i> : label}</button>
)
