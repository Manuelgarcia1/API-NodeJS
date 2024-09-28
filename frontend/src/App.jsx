
import Navbar from './components/Inicio/Navbar';
import Card from './components/Inicio/Card';
import Carousel from './components/Inicio/Carousel';
import Footer from './components/Inicio/Footer';
import Cards from './components/Nosotros/Cards.jsx'
import SobreNosotrosText from './components/Nosotros/sobreNosotrosText.jsx';
import './index.css'; // Asegúrate de que esto esté presente para cargar Tailwind CSS.

function App() {
  return (
    <>
      <Navbar />
      <Carousel />
      <SobreNosotrosText />
      <Cards />
      <Card />
      <Footer />
    </>
  );
}

export default App;