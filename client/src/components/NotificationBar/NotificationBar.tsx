import { useEffect, useState } from 'react';
import { getQuote } from '../../api';
import { Quote } from '../../types';
import './NotificationBar.css';

export default function NotificationBar() {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    getQuote()
      .then(res => setQuote(res.data))
      .catch(() => setQuote(null));
  }, []);

  if (!quote) return null;

  return (
    <div className="notification-bar">
      <span className="notification-icon">💬</span>
      <span className="notification-text">{quote.content}</span>
    </div>
  );
}
