import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVote] = useState(Array(anecdotes.length).fill(0))
  const mostVotesIndex = votes.indexOf(Math.max(...votes))

  const handleVote = () => {
    const copy = [...votes] 
    copy[selected]++
    setVote(copy)
  }

  const handleNext = () => {
    let randIndex = Math.floor(Math.random() * (anecdotes.length))
    while (randIndex === selected) {
      randIndex = Math.floor(Math.random() * (anecdotes.length))
    }
    setSelected(randIndex)
  }  

  return (
    <div>
      <Header text='Anecdote of the day' />
      <Anecdote anecdote={anecdotes[selected]} votes={votes[selected]} />
      <Button handleClick={handleVote} text='vote' />
      <Button handleClick={handleNext} text='next anecdote' />

      <Header text='Anecdote with the most votes' />
      <Anecdote anecdote={anecdotes[mostVotesIndex]} votes={votes[mostVotesIndex]} />
    </div>
  )
}

const Header = ({text}) => {
  return (
    <h1>
      {text}
    </h1>
  )
}

const Anecdote = ({anecdote, votes}) => {
  return (
    <>
      <p>{anecdote}</p>
      <p>has {votes} votes</p>
    </>
  )
}

const Button = ({handleClick, text}) => {
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
}

export default App