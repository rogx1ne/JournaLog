interface ThemeToggleProps {
  theme: string;
  onToggle: () => void;
}

function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button onClick={onToggle} className="theme-toggle">
      {theme === 'light' ?  '☀️ Light': '🌙 Dark'}
    </button>
  );
}
export default ThemeToggle;