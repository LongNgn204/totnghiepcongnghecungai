import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * ThemeToggle - toggles between light/dark/system themes
 */
const ThemeToggle: React.FC<{ compact?: boolean } & React.HTMLAttributes<HTMLDivElement>> = ({ compact = false, className = '', ...props }) => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  return (
    <div className={`inline-flex items-center gap-2 ${className}`} {...props}>
      {/* Compact toggle: click to cycle */}
      {compact ? (
        <button
          aria-label="Toggle theme"
          title={`Theme: ${theme} (${resolvedTheme})`}
          onClick={toggleTheme}
          className="btn-icon"
        >
          {resolvedTheme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      ) : (
        // Full control: light / system / dark
        <div className="inline-flex items-center rounded-lg border border-border bg-surface p-1">
          <button
            onClick={() => setTheme('light')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              theme === 'light' ? 'bg-surface-hover text-text-primary' : 'text-text-secondary hover:bg-surface-hover'
            }`}
            aria-pressed={theme === 'light'}
          >
            <Sun size={16} className="inline mr-1" />
            Sáng
          </button>
          <button
            onClick={() => setTheme('system')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              theme === 'system' ? 'bg-surface-hover text-text-primary' : 'text-text-secondary hover:bg-surface-hover'
            }`}
            aria-pressed={theme === 'system'}
          >
            <Monitor size={16} className="inline mr-1" />
            System
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              theme === 'dark' ? 'bg-surface-hover text-text-primary' : 'text-text-secondary hover:bg-surface-hover'
            }`}
            aria-pressed={theme === 'dark'}
          >
            <Moon size={16} className="inline mr-1" />
            Dark
          </button>
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
