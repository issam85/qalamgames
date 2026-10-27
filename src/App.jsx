import GameView from './components/GameView';
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import About from './components/About';
import Featured from './components/Featured';
import Lichtingen from './components/Lichtingen';
import Legends from './components/Legends';
import Footer from './components/Footer';
import useHashPage from './hooks/useHashPage';
import { GAMES } from './data/games';

const isGamePage = (key) => !!GAMES[key];

export default function App() {
  const [page, setPage] = useHashPage(isGamePage);

  if (page !== 'home') {
    return <GameView gameKey={page} onBack={() => setPage('home')} />;
  }

  return (
    <>
      <NavBar />
      <main>
        <Hero />
        <About />
        <Featured />
        <Lichtingen />
        <Legends />
      </main>
      <Footer />
    </>
  );
}
