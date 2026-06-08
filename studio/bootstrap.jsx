// bootstrap.jsx — mounts the app in a scalable iPhone frame.
function Stage() {
  const [scale, setScale] = React.useState(1);
  React.useEffect(() => {
    const fit = () => setScale(Math.min(1, (window.innerHeight - 36) / 874, (window.innerWidth - 24) / 402));
    fit(); window.addEventListener('resize', fit); return () => window.removeEventListener('resize', fit);
  }, []);
  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
      <IOSDevice>
        <App />
      </IOSDevice>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<Stage />);
