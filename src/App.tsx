import React, { useState, useRef, useEffect } from 'react';
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
    reserves: 'Yedekler',
    history: 'Geçmiş',
    raffleHistory: 'Çekiliş Geçmişi',
    date: 'Tarih',
    lottery: 'Çekiliş',
    close: 'Kapat',
    noHistory: 'Henüz çekiliş geçmişi yok',
    error: 'Hata',
    ok: 'Tamam',
    tooManyParticipantsError: 'Kazanan + Yedek sayısı toplam katılımcı sayısından fazla olamaz!'
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
    reserves: 'Reserves',
    history: 'History',
    raffleHistory: 'Raffle History',
    date: 'Date',
    lottery: 'Lottery',
    close: 'Close',
    noHistory: 'No raffle history yet',
    error: 'Error',
    ok: 'OK',
    tooManyParticipantsError: 'Winners + Reserves count cannot exceed total participants!'
  }
};

interface RaffleHistory {
  id: string;
  date: string;
  lotteryName: string;
  winners: string[];
  reserves: string[];
  totalParticipants: number;
}

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
  const [showHistory, setShowHistory] = useState(false);
  const [raffleHistory, setRaffleHistory] = useState<RaffleHistory[]>([]);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const resultsRef = useRef<HTMLDivElement>(null);

  const t = translations[language];

  const participantList = participants
    .split('\n')
    .map(p => p.trim())
    .filter(p => p.length > 0);

  const showErrorDialog = (message: string) => {
    setErrorMessage(message);
    setShowError(true);
  };

  const handleRaffle = () => {
    if (participantList.length === 0) {
      showErrorDialog(t.noParticipantsError);
      return;
    }
    
    if (winnersCount + reservesCount > participantList.length) {
      showErrorDialog(t.tooManyParticipantsError);
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
        
        // Geçmişe ekle
        const newHistoryItem: RaffleHistory = {
          id: Date.now().toString(),
          date: new Date().toLocaleString('tr-TR'),
          lotteryName: lotteryName || 'İsimsiz Çekiliş',
          winners: selectedWinners,
          reserves: selectedReserves,
          totalParticipants: participantList.length
        };
        setRaffleHistory(prev => [newHistoryItem, ...prev]);
        
        // Sonuçlar gösterildikten sonra scroll yap
        setTimeout(() => {
          if (resultsRef.current) {
            resultsRef.current.scrollIntoView({ 
              behavior: 'smooth',
              block: 'center'
            });
          }
        }, 100);
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
        <button 
          className="history-btn"
          onClick={() => setShowHistory(true)}
          title={t.history}
        >
          📋
        </button>
      </div>
      
      <div className="header">
        <div className="logo-card">
          <div className="logo">
            <img src={logoMimce} alt="MIMCE Logo" className="logo-image" />
            <div className="logo-text">{t.raffle}</div>
          </div>
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
          <div className="raffle-display" ref={resultsRef}>
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
      
      {/* History Modal */}
      {showHistory && (
        <div className="modal-overlay" onClick={() => setShowHistory(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{t.raffleHistory}</h2>
              <button 
                className="modal-close"
                onClick={() => setShowHistory(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              {raffleHistory.length === 0 ? (
                <div className="no-history">
                  <div className="no-history-icon">📋</div>
                  <p className="no-history-text">{t.noHistory}</p>
                </div>
              ) : (
                <div className="history-list">
                  {raffleHistory.map((item) => (
                    <div key={item.id} className="history-item">
                      <div className="history-header">
                        <div className="history-date">{item.date}</div>
                        <div className="history-lottery">{item.lotteryName}</div>
                      </div>
                      
                      <div className="history-details">
                        <div className="history-participants">
                          {item.totalParticipants} katılımcı
                        </div>
                        
                        {item.winners.length > 0 && (
                          <div className="history-winners">
                            <strong>{t.winners}:</strong>
                            <div className="history-winner-list">
                              {item.winners.map((winner, index) => (
                                <span key={index} className="history-winner">
                                  {index + 1}. {winner} 👑
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {item.reserves.length > 0 && (
                          <div className="history-reserves">
                            <strong>{t.reserves}:</strong>
                            <div className="history-reserve-list">
                              {item.reserves.map((reserve, index) => (
                                <span key={index} className="history-reserve">
                                  {index + 1}. {reserve}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Error Modal */}
      {showError && (
        <div className="modal-overlay" onClick={() => setShowError(false)}>
          <div className="modal-content error-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header error-header">
              <div className="error-icon">⚠️</div>
              <h2 className="modal-title">{t.error}</h2>
              <button 
                className="modal-close"
                onClick={() => setShowError(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="error-message">
                {errorMessage}
              </div>
              
              <div className="error-actions">
                <button 
                  className="error-ok-btn"
                  onClick={() => setShowError(false)}
                >
                  {t.ok}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
