import { useThemeStore } from '../../store/theme';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
      <span className={`theme-icon ${theme === 'dark' ? 'sun' : 'moon'}`}>
        {theme === 'dark' ? '☀️' : '🌙'}
      </span>
    </button>
  );
}
