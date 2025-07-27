import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import "./styles/global.css";
import "./components/Navbar.css";
import Home from "./components/Home";
import About from "./components/About";
import Gallery from "./components/Gallery";
import Contact from "./components/Contact";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <div className="App">
      <ScrollToTop />
      <Navbar expand="lg" sticky="top" className="navbar-custom">
        <Container>
          <Navbar.Brand as={Link} to="/" className="navbar-brand-custom">
            <img
              src="/images/hero/logo.png"
              alt="I'm Dessert Logo"
              className="navbar-logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/" className="nav-link-custom">
                Domů
              </Nav.Link>
              <Nav.Link as={Link} to="/about" className="nav-link-custom">
                O nás
              </Nav.Link>
              <Nav.Link as={Link} to="/gallery" className="nav-link-custom">
                Galerie
              </Nav.Link>
              <Nav.Link as={Link} to="/contact" className="nav-link-custom">
                Kontakt
              </Nav.Link>
              <Nav.Link
                href="https://www.facebook.com/imdesssert"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link-custom facebook-icon"
                title="Facebook"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      <footer className="footer-custom">
        <Container>
          <div className="footer-content">
            <div className="footer-brand">
              <img
                src="/images/hero/logo.png"
                alt="I'm Dessert Logo"
                className="footer-logo"
              />
              <h5>i'm DESSERT</h5>
              <p>Sladké chvíle plné lásky</p>
            </div>
            <div className="footer-links">
              <h6>Rychlé odkazy</h6>
              <Link to="/" className="footer-link">
                Domů
              </Link>
              <Link to="/about" className="footer-link">
                O nás
              </Link>
              <Link to="/gallery" className="footer-link">
                Galerie
              </Link>
              <Link to="/contact" className="footer-link">
                Kontakt
              </Link>
            </div>
            <div className="footer-contact">
              <h6>Kontakt</h6>
              <p>📧 info@imdessert.cz</p>
              <p>📱 +420 XXX XXX XXX</p>
              <a
                href="https://www.facebook.com/imdesssert"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link facebook-icon footer-facebook"
                title="Sledujte nás na Facebooku"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>
          <hr className="footer-divider" />
          <div className="footer-bottom">
            <p>&copy; 2025 i'm DESSERT. Všechna práva vyhrazena.</p>
            <p>Vytvořeno s ❤️ pro sladké chvíle</p>
          </div>
        </Container>
      </footer>
    </div>
  );
}

export default App;
