import { useState, forwardRef, useImperativeHandle } from 'react'

const Togglable = forwardRef((props, ref) => {

  const [isVisible, setVisible] = useState(false)

  const buttonText = isVisible
    ? props.buttonText
    : 'Cancel'

  const contentStyle = isVisible
    ? { display: 'none' }
    : { display: '' }

  const toggleVisibility = () => { setVisible(!isVisible) }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div style={contentStyle}>{props.children}</div>
      <button onClick={toggleVisibility}>{buttonText}</button>
    </div>
  )
})

Togglable.displayName = 'Togglable'

export default Togglable