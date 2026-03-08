import { POSDashboardMain } from './POSDashboardMain';

interface POSDashboardMainWithContextProps {
  onLogout: () => void;
}

export function POSDashboardMainWithContext({ onLogout }: POSDashboardMainWithContextProps) {
  return <POSDashboardMain onLogout={onLogout} />;
}
