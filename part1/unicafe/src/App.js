import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => setGood(good + 1)
  const handleNeutral = () => setNeutral(neutral + 1)
  const handleBad = () => setBad(bad + 1)
  
  return (
    <div>
      <Header text="give feedback" />
      <Button onClick={handleGood} text="good"/>
      <Button onClick={handleNeutral} text="neutral"/>
      <Button onClick={handleBad} text="bad"/>

      <Header text="statistics" />
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

const Statistics = ({good, neutral, bad}) => {
  const total = good + neutral + bad; 
  
  if (total === 0) {
    return (
      <p>
        No feedback given
      </p>
    )
  }
  
  const average = roundHundreth([good - bad] / total)
  const positive = roundHundreth([good / total] * 100)

  return (
    <table>
      <tbody>
        <StatisticLine category="good" value={good} />
        <StatisticLine category="neutral" value={neutral} />
        <StatisticLine category="bad" value={bad} />
        <StatisticLine category="all" value={total} />
        <StatisticLine category="average" value={average} />
        <StatisticLine category="positive" value={positive + ' %'} />
      </tbody>
    </table>
  )
}

const Header = ({text}) => {
  return (
    <h1>
      {text}
    </h1>
  )
}

const Button = ({onClick, text}) => {
  return (
    <button onClick={onClick}>
      {text}
    </button>
  )
}

const StatisticLine = ({category, value}) => {
  return (
    <tr>
      <td>{category}</td>
      <td>{value}</td>
    </tr>
  )
}

const roundHundreth = (num) => {
  return Math.round(num * 100) / 100
}

export default App
