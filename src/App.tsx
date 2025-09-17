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
    totalParticipants: 'Toplam',
    winnersCount: 'Kazanan Sayısı',
    reservesCount: 'Yedek Sayısı',
    results: 'Sonuçlar',
    winners: 'Kazananlar',
    reserves: 'Yedekler'
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
    totalParticipants: 'Total',
    winnersCount: 'Winners Count',
    reservesCount: 'Reserves Count',
    results: 'Results',
    winners: 'Winners',
    reserves: 'Reserves'
  }
};

function App() {
  const [language, setLanguage] = useState<Language>('tr');
  const [lotteryName, setLotteryName] = useState('');
  const [participants, setParticipants] = useState('');
  const [winnersCount, setWinnersCount] = useState(1);
  const [reservesCount, setReservesCount] = useState(0);
  const [winners, setWinners] = useState<string[]>([]);
  const [reserves, setReserves] = useState<string[]>([]);
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
    
    if (winnersCount + reservesCount > participantList.length) {
      alert('Kazanan + Yedek sayısı toplam katılımcı sayısından fazla olamaz!');
      return;
    }
    
    setIsSpinning(true);
    setWinners([]);
    setReserves([]);
    setCurrentDisplay('');
    
    // Animasyon süresi (3 saniye)
    const animationDuration = 3000;
    const startTime = Date.now();
    
    const spinInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / animationDuration;
      
      if (progress >= 1) {
        // Animasyon bitti, kazananları seç
        clearInterval(spinInterval);
        
        const shuffled = [...participantList].sort(() => Math.random() - 0.5);
        const selectedWinners = shuffled.slice(0, winnersCount);
        const selectedReserves = shuffled.slice(winnersCount, winnersCount + reservesCount);
        
        setWinners(selectedWinners);
        setReserves(selectedReserves);
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
        
        <div className="count-selectors">
          <div className="count-group">
            <label className="count-label">{t.winnersCount}</label>
            <div className="count-controls">
              <button 
                className="count-btn" 
                onClick={() => setWinnersCount(Math.max(1, winnersCount - 1))}
                disabled={winnersCount <= 1}
              >
                -
              </button>
              <span className="count-value">{winnersCount}</span>
              <button 
                className="count-btn" 
                onClick={() => setWinnersCount(Math.min(participantList.length - reservesCount, winnersCount + 1))}
                disabled={winnersCount >= participantList.length - reservesCount}
              >
                +
              </button>
            </div>
          </div>
          
          <div className="count-group">
            <label className="count-label">{t.reservesCount}</label>
            <div className="count-controls">
              <button 
                className="count-btn" 
                onClick={() => setReservesCount(Math.max(0, reservesCount - 1))}
                disabled={reservesCount <= 0}
              >
                -
              </button>
              <span className="count-value">{reservesCount}</span>
              <button 
                className="count-btn" 
                onClick={() => setReservesCount(Math.min(participantList.length - winnersCount, reservesCount + 1))}
                disabled={reservesCount >= participantList.length - winnersCount}
              >
                +
              </button>
            </div>
          </div>
        </div>
        
        <button 
          className={`raffle-button ${isSpinning ? 'spinning' : ''}`} 
          onClick={handleRaffle}
          disabled={isSpinning}
        >
          {isSpinning ? '...' : t.initiateRaffle}
        </button>
        
        {(isSpinning || winners.length > 0) && (
          <div className="raffle-display">
            {isSpinning ? (
              <div className="spinning-display">
                <div className="spinning-wheel">
                  <div className="spinning-text">{currentDisplay}</div>
                </div>
                <div className="spinning-label">Çekiliş yapılıyor...</div>
              </div>
            ) : winners.length > 0 ? (
              <div className="results-display">
                <h2 className="results-title">{t.results}</h2>
                
                {winners.length > 0 && (
                  <div className="winners-section">
                    <h3 className="section-title">{t.winners}</h3>
                    <div className="winners-list">
                      {winners.map((winner, index) => (
                        <div key={index} className="winner-item">
                          <span className="winner-number">{index + 1}</span>
                          <span className="winner-name">{winner}</span>
                          <span className="winner-crown">👑</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {reserves.length > 0 && (
                  <div className="reserves-section">
                    <h3 className="section-title">{t.reserves}</h3>
                    <div className="reserves-list">
                      {reserves.map((reserve, index) => (
                        <div key={index} className="reserve-item">
                          <span className="reserve-number">{index + 1}</span>
                          <span className="reserve-name">{reserve}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
