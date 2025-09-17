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
    raffle: 'ÇEKİLİŞ',
    participantCount: 'Katılımcı Sayısı',
    totalParticipants: 'Toplam'
  },
  en: {
    lotteryName: 'Lottery Name',
    lotteryNamePlaceholder: 'Project Name / Event ID',
    participants: 'Participants',
    participantsPlaceholder: 'Enter one participant ID per line',
    initiateRaffle: 'INITIATE RAFFLE',
    winner: 'Winner',
    noParticipantsError: 'Please enter at least one participant!',
    raffle: 'RAFFLE',
    participantCount: 'Participant Count',
    totalParticipants: 'Total'
  }
};

function App() {
  const [language, setLanguage] = useState<Language>('tr');
  const [lotteryName, setLotteryName] = useState('');
  const [participants, setParticipants] = useState('');
  const [winner, setWinner] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentDisplay, setCurrentDisplay] = useState<string>('');

  const t = translations[language];

  const participantList = participants
    .split('\n')
    .map(p => p.trim())
    .filter(p => p.length > 0);

  const handleRaffle = () => {
    if (participantList.length === 0) {
      alert(t.noParticipantsError);
      return;
    }
    
    setIsSpinning(true);
    setWinner(null);
    setCurrentDisplay('');
    
    // Animasyon süresi (3 saniye)
    const animationDuration = 3000;
    const startTime = Date.now();
    
    const spinInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / animationDuration;
      
      if (progress >= 1) {
        // Animasyon bitti, kazananı göster
        clearInterval(spinInterval);
        const randomIndex = Math.floor(Math.random() * participantList.length);
        setWinner(participantList[randomIndex]);
        setIsSpinning(false);
      } else {
        // Rastgele isim göster
        const randomIndex = Math.floor(Math.random() * participantList.length);
        setCurrentDisplay(participantList[randomIndex]);
      }
    }, 100);
  };

  return (
    <div className="App">
      <div className="language-selector-fixed">
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
          🇬🇧
        </button>
      </div>
      
      <div className="header">
        <div className="logo">
          <img src={logoMimce} alt="MIMCE Logo" className="logo-image" />
          <div className="logo-text">{t.raffle}</div>
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
          <div className="form-label-container">
            <label className="form-label">{t.participants}</label>
            <div className="participant-count">
              <span className="count-label">{t.participantCount}:</span>
              <span className="count-number">{participantList.length}</span>
            </div>
          </div>
          <textarea
            className="form-textarea"
            placeholder={t.participantsPlaceholder}
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
          />
        </div>
        
        <button 
          className={`raffle-button ${isSpinning ? 'spinning' : ''}`} 
          onClick={handleRaffle}
          disabled={isSpinning}
        >
          {isSpinning ? '...' : t.initiateRaffle}
        </button>
        
        {(isSpinning || winner) && (
          <div className="raffle-display">
            {isSpinning ? (
              <div className="spinning-display">
                <div className="spinning-wheel">
                  <div className="spinning-text">{currentDisplay}</div>
                </div>
                <div className="spinning-label">Çekiliş yapılıyor...</div>
              </div>
            ) : winner ? (
              <div className="winner-display">
                <div className="winner-crown">👑</div>
                <h2 className="winner-title">{t.winner}</h2>
                <div className="winner-name">{winner}</div>
                <div className="winner-celebration">🎉</div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
