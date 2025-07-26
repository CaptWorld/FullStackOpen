import { useState } from 'react'

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const VoteViewer = ({ vote }) => <div>has {vote} votes</div>

const MostVotedAnecdote = ({ anecdotes, votes, indexWithMostVotes }) => {
  return (
    <div>
      <h1>Anecdote with most votes</h1>
      <div>{anecdotes[indexWithMostVotes]}</div>
      <VoteViewer vote={votes[indexWithMostVotes]} />
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ];

  const [selected, setSelected] = useState(getRandomInt(anecdotes.length));
  const [votes, setVotes] = useState(new Uint32Array(anecdotes.length));
  const [indexWithMostVotes, setIndexWithMostVotes] = useState(selected);

  console.log("Using anecdote with index", selected);
  console.log("Votes", votes);

  const selectRandomAnecdote = () => setSelected(getRandomInt(anecdotes.length));

  const incrementVote = () => {
    const newVotes = [...votes];
    newVotes[selected]++;
    setVotes(newVotes);
    if (newVotes[selected] > votes[indexWithMostVotes]) {
      setIndexWithMostVotes(selected);
    }
  }

  return (
    <div>
      <div>{anecdotes[selected]}</div>
      <VoteViewer vote={votes[selected]} />
      <div>
        <button
          onClick={incrementVote}
        >
          vote
        </button>
        <button
          onClick={selectRandomAnecdote}
        >
          next anecdote
        </button>
      </div>
      <MostVotedAnecdote
        anecdotes={anecdotes}
        votes={votes}
        indexWithMostVotes={indexWithMostVotes}
      />
    </div>
  )
}

export default App