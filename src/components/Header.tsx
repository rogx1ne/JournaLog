import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  theme: string;
  onToggle: () => void;
}

function Header({ theme, onToggle }: HeaderProps) {
  return (
    <header className="Header">
      <h1>JournalLOG</h1>
      <ThemeToggle theme={theme} onToggle={onToggle} />
    </header>
  );
}
export default Header;