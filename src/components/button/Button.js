import React from 'react';
import './button.css';

export function Button({ outlined,...props}) {
  return <button className={`button ${outlined ? 'outlined': ''}`} {...props}></button>;
}
