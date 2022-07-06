import { useState } from 'react'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}


const App = () => {
  const nameField = useField('text')
  const bornField = useField('date')
  const heightField = useField('number')

  return (
    <div>
      <form>
        name: 
        <input {...nameField} /> 
        <br/> 
        birthdate:
        <input {...bornField} />
        <br /> 
        height:
        <input {...heightField} />
      </form>
      <div>
        {nameField.value} {bornField.value} {heightField.value} 
      </div>
    </div>
  )
}

export default App