import React, { useEffect, useState } from 'react';
import * as c from '../game-engine/constant/index';

const CheckNotification = ({ isInCheck, currentTurn, isCheckMate }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const shouldShow = isInCheck && !isCheckMate;
    
    if (shouldShow) {
      setVisible(true);
      
      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [isInCheck, isCheckMate]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'rgba(255, 0, 0, 0.9)',
      color: 'white',
      padding: '12px 20px',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: 'bold',
      zIndex: 1000,
      border: '2px solid white',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
      transform: 'translateY(0)',
      transition: 'all 0.3s ease'
    }}>
      <p style={{ margin: 0 }}>
        {c.COLORSTR[currentTurn].toUpperCase()} King is in Check!
      </p>
    </div>
  );
};

export default CheckNotification;
