// bootstrap.jsx — mounts the app full-bleed as a responsive web app.
// No device frame. App itself handles the responsive layout: full-screen on
// phones, a sidebar + centered content column on tablet/desktop.
function Shell() {
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#E7E2D9' }}>
      <App />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<Shell />);
