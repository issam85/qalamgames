import '../styles/legends.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="footer-mark" aria-hidden="true">Q</span>
          Qalam Games — Al Qalam School, Gouda
        </div>
        <nav className="footer-links" aria-label="Footer">
          <a href="#uitgelicht">Spellen</a>
          <a href="#lichtingen">Lichtingen</a>
          <a href="#legends">Hall of Legends</a>
        </nav>
      </div>
    </footer>
  );
}
