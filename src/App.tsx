import React, { useState } from 'react';
import './App.css';
import logoMimce from './logo_mimce.png';

type Language = 'tr' | 'en';

const translations = {
  tr: {
    lotteryName: 'Çekiliş İsmi',
    lotteryNamePlaceholder: 'Proje Adı / Etkinlik ID',
    participants: 'Katılımcılar',
    participantsPlaceholder: 'Her satıra bir katılımcı ID girin',
    initiateRaffle: 'ÇEKİLİŞİ BAŞLAT',
    winner: 'Kazanan',
    noParticipantsError: 'Lütfen en az bir katılımcı girin!',
    raffle: 'ÇEKİLİŞ'
  },
  en: {
    lotteryName: 'Lottery Name',
    lotteryNamePlaceholder: 'Project Name / Event ID',
    participants: 'Participants',
    participantsPlaceholder: 'Enter one participant ID per line',
    initiateRaffle: 'INITIATE RAFFLE',
    winner: 'Winner',
    noParticipantsError: 'Please enter at least one participant!',
    raffle: 'RAFFLE'
  }
};

function App() {
  const [language, setLanguage] = useState<Language>('tr');
  const [lotteryName, setLotteryName] = useState('');
  const [participants, setParticipants] = useState('');
  const [winner, setWinner] = useState<string | null>(null);

  const t = translations[language];

  const handleRaffle = () => {
    const participantList = participants
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);
    
    if (participantList.length === 0) {
      alert(t.noParticipantsError);
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * participantList.length);
    setWinner(participantList[randomIndex]);
  };

  return (
    <div className="App">
      <div className="header">
        <div className="logo">
          <img src={logoMimce} alt="MIMCE Logo" className="logo-image" />
          <div className="logo-text">{t.raffle}</div>
        </div>
        <div className="language-selector">
          <button 
            className={`flag-btn ${language === 'tr' ? 'active' : ''}`}
            onClick={() => setLanguage('tr')}
            title="Türkçe"
          >
            🇹🇷
          </button>
          <button 
            className={`flag-btn ${language === 'en' ? 'active' : ''}`}
            onClick={() => setLanguage('en')}
            title="English"
          >
            🇺🇸
          </button>
        </div>
      </div>
      
      <div className="main-card">
        <div className="form-group">
          <label className="form-label">{t.lotteryName}</label>
          <input
            type="text"
            className="form-input"
            placeholder={t.lotteryNamePlaceholder}
            value={lotteryName}
            onChange={(e) => setLotteryName(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">{t.participants}</label>
          <textarea
            className="form-textarea"
            placeholder={t.participantsPlaceholder}
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
          />
        </div>
        
        <button className="raffle-button" onClick={handleRaffle}>
          {t.initiateRaffle}
        </button>
        
        {winner && (
          <div className="winner-display">
            <h2>{t.winner}: {winner}</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
