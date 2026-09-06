import { useAuth } from '../context/AuthContext';

export default function BottomNav() {
  const { logout } = useAuth();

  return (
    <div className="bottom-nav">
      <div className="nav-item active">
        <span>🌐</span>
        <span>Social</span>
      </div>
      <div className="nav-item" onClick={logout} style={{ cursor: 'pointer' }}>
        <span>🚪</span>
        <span>Logout</span>
      </div>
    </div>
  );
}
