import { Quote } from '../../types';
import './NotificationBar.css';

interface NotificationBarProps {
  quote: Quote | null;
}

export default function NotificationBar({ quote }: NotificationBarProps) {
  if (!quote) return null;

  return (
    <div className="notification-bar">
      <span className="notification-icon">💬</span>
      <span className="notification-text">{quote.content}</span>
    </div>
  );
}
