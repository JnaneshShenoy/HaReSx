import "./App.css";
import HeroWithNavbar from "./sections/HeroxNav/HeroWithNavbar";
import Contact from "./sections/Contact/Contact";
import Footer from "./sections/Footer/Footer";
import Features from "./sections/Features/Features";
import Skills from "./sections/Skills/Skills";
import HairStyle from "./sections/Productx/HairStyle";

function Home() {
  return (
    <>
      <HeroWithNavbar />
      <HairStyle/>
      <Features />
      <Skills />
      <Contact />
      <Footer />
    </>
  );
}

export default Home;
