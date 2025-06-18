import { useState } from 'react';
import './App.css';

function App() {
  const [total, setTotal] = useState(0);
  const [extra, setExtra] = useState(0);
  const [endScore, setEndScore] = useState(0);
  const [wicket, setWicket] = useState(0);
  const [over, setOver] = useState(0);
  const [ball, setBall] = useState(0);
  const [idx, setIdx] = useState(1);
  const [playerStats, setPlayerStats] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState([]);

  const updateOver = () => {
    setBall((prev) => prev + 1);
    if (ball + 1 === 6) {
      setOver((prev) => prev + 1);
      setBall(0);
      setTotal((prevTotal) => prevTotal + extra);
      setHistory((prevHistory) => [...prevHistory, 'End of Over<br/>']); // Add end of over line with a line break
    }
  };

  const handleScore = (playerId, runs) => {
    setPlayerStats((prevStats) =>
      prevStats.map((player) =>
        player.id === playerId && !player.isOut
          ? { ...player, score: player.score + runs, ballsFaced: player.ballsFaced + 1 }
          : player
      )
    );
    setTotal((prevTotal) => prevTotal + runs);
    updateOver();
    setHistory((prevHistory) => [...prevHistory, runs]); // Update history with the new run
  };

  const handleOut = (playerId) => {
    setPlayerStats((prevStats) =>
      prevStats.map((player) =>
        player.id === playerId ? { ...player, isOut: true } : player
      )
    );
    setWicket((prev) => prev + 1);
    updateOver();
    setHistory((prevHistory) => [...prevHistory, 'Out']); 
  };

  const handleExtras = () => {
    setExtra((prevExtra) => prevExtra + 1);
    setTotal((prevTotal) => prevTotal + 1);
    setHistory((prevHistory) => [...prevHistory, 'wd']); // Update history with the extra event
  };

  const handleDots = (playerId) => {
    handleScore(playerId, 0);
    setHistory((prevHistory) => [...prevHistory, 'Dot']); // Update history with the dot event
  };

  const endGame = () => {
    setEndScore(total + extra);
  };

  const resetGame = () => {
    alert("Are you sure you want to reset the board?");
    setPlayerStats([]);
    setTotal(0);
    setExtra(0);
    setEndScore(0);
    setWicket(0);
    setOver(0);
    setBall(0);
    setIdx(1);
    setHistory([]); 
  };

  const st = {
    padding: '10px 15px',
    fontSize: '1rem',
    width: '250px',
    borderColor: 'black',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  };

  const addPlayer = () => {
    if (inputValue.trim() !== "") {
      setPlayerStats((prevPlayers) => [
        ...prevPlayers,
        { id: idx, name: inputValue, score: 0, isOut: false, ballsFaced: 0 }
      ]);
      setIdx((prevIdx) => prevIdx + 1);
      setInputValue("");
    } else {
      console.log("Enter a player name to create a scoreboard");
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Lions King</h1>
        <h2>Score Board</h2>
      </header>
      <div>
        <input 
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={st}
          placeholder="Enter player name"
        />
        <button className="spec" onClick={addPlayer}>Add Batsman</button>
      </div>
      <main>
        <div className="score-info">
          <p>Total Score: {total}</p>
          <p>Wickets: {wicket}</p>
          <p>Overs: {over}.{ball}</p>
          <p>Extras: {extra}</p>
          <p>History:</p>
          <div>
            {history.map((entry, index) => (
              <div key={index} dangerouslySetInnerHTML={{ __html: entry === 'End of Over<br/>' ? entry : `${entry}<br/>` }} />
            ))}
          </div>
        </div>

        <div className="player-section">
          {playerStats.map((player) => (
            <div key={player.id} className="player-card">
              <h3>{player.name}</h3>
              <p>Score: {player.score}</p>
              <p>Balls Faced: {player.ballsFaced}</p>
              <p>Status: {player.isOut ? 'Out' : 'Not Out'}</p>
              {!player.isOut && (
                <div className="button-group">
                  <button onClick={() => handleScore(player.id, 1)}>Single</button>
                  <button onClick={() => handleScore(player.id, 2)}>Double</button>
                  <button onClick={() => handleScore(player.id, 4)}>Four</button>
                  <button onClick={() => handleScore(player.id, 6)}>Six</button>
                  <button onClick={() => handleOut(player.id)}>Out</button>
                  <button onClick={() => handleDots(player.id)}>Dot</button>
                </div>
              )}
              {player.isOut && player.score === 0 && <p>Ponna vegathulaiye thirumba vandhuta</p>}
              {player.isOut && <p>Player is out</p>}
            </div>
          ))}
        </div>
        <div className="action-buttons">
          <button onClick={handleExtras}>Add Extra</button>
          <button onClick={resetGame}>Reset Game</button>
        </div>
      </main>
    </div>
  );
}

export default App;
