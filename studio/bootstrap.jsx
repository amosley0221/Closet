// bootstrap.jsx — mounts the app full-bleed as a responsive web app.
// No device frame: the app fills the viewport on phones and sits in a centered
// app-width column on tablet/desktop (clean, installable, not an iPhone mockup).
function Shell() {
  return (
    <div style={{
      position: 'fixed', inset: 0, display: 'flex', justifyContent: 'center',
      background: '#E7E2D9',
    }}>
      <div style={{
        position: 'relative', width: '100%', maxWidth: 480, height: '100%',
        overflow: 'hidden', background: '#FBFAF7',
        boxShadow: '0 0 1px rgba(28,26,23,0.10), 0 24px 80px rgba(28,26,23,0.14)',
      }}>
        <App />
      </div>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<Shell />);
