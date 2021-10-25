import * as React from 'react'
import './Wave.css'

export function Wave({ message, timestamp, address, isMe = false }) {
  return (
    <div className={`wave ${isMe && 'owner'}`}>
      <div className="wave-address">{isMe ? 'YOU' : address}</div>
      <div className="wave-message">{message}</div>
      <div className="wave-timestamp">
        {new Date(timestamp).toLocaleString()}
      </div>
    </div>
  )
}

export default Wave
