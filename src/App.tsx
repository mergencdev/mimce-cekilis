import React, { useState } from 'react';
import './App.css';

function App() {
  const [lotteryName, setLotteryName] = useState('');
  const [participants, setParticipants] = useState('');
  const [winner, setWinner] = useState<string | null>(null);

  const handleRaffle = () => {
    const participantList = participants
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);
    
    if (participantList.length === 0) {
      alert('Lütfen en az bir katılımcı girin!');
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * participantList.length);
    setWinner(participantList[randomIndex]);
  };

  return (
    <div className="App">
      <div className="header">
        <div className="logo">
          <div className="logo-icon">|||</div>
          <div className="logo-text">RAFFLE</div>
        </div>
      </div>
      
      <div className="main-card">
        <div className="form-group">
          <label className="form-label">Lottery Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="Project Name / Event ID"
            value={lotteryName}
            onChange={(e) => setLotteryName(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Participants</label>
          <textarea
            className="form-textarea"
            placeholder="Enter one participant ID per line"
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
          />
        </div>
        
        <button className="raffle-button" onClick={handleRaffle}>
          INITIATE RAFFLE
        </button>
        
        {winner && (
          <div className="winner-display">
            <h2>Kazanan: {winner}</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
