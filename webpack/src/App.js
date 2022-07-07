import React, { useState, useEffect } from 'react'
import axios from 'axios'

import PromisePolyfill from 'promise-polyfill'
if (!window.Promise) {
  window.Promise = PromisePolyfill
}

const useNotes = (url) => {
  console.log('Getting from', url)
  const [notes, setNotes] = useState([])
  useEffect(() => {
    axios.get(url).then(response => {
      console.log('Got data', response.data)
      setNotes(response.data)
    }).catch(error => {
      console.log('Got error', error)
    })
  }, [url])
  return notes
}

const App = () => {
  const [counter, setCounter] = useState(0)
  const [values, setValues] = useState([])
  const notes = useNotes(BACKEND_URL)

  const handleClick = () => {
    setCounter(counter + 1)
    setValues(values.concat(counter))
  }

  return (
    <div className='container'>
      Hello webpack! { counter } clicks.
      <button onClick={handleClick} >
        Click me
      </button>
      <div>{notes.length} notes on server {BACKEND_URL}</div>
    </div>
  )
}

export default App