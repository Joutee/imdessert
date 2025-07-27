import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import "./Home.css";

const Home: React.FC = () => {
  return (
    <div>
      {/* Hero sekce s bannerem */}
      <div className="hero-section">
        <div className="hero-background">
          <img
            src="/images/hero/banner.JPG"
            alt="Banner"
            className="hero-banner"
          />
          <div className="hero-overlay"></div>
        </div>
        <Container className="hero-content">
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h1 className="hero-title fade-in-up">Vítejte v i'm DESSERT</h1>
              <p className="hero-subtitle fade-in-up">
                Luxusní zákusky a dezerty připravované s láskou podle tradičních
                receptur. Každý kousek je malým uměleckým dílem plným chuti a
                lásky.
              </p>
              <div className="hero-buttons fade-in-up">
                <Button
                  className="btn-primary-custom me-3"
                  size="lg"
                  href="#specialties"
                >
                  🍰 Objevte naše speciality
                </Button>
                <Button
                  className="btn-secondary-custom"
                  size="lg"
                  href="/gallery"
                >
                  📸 Prohlédnout galerii
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Speciality sekce */}
      <div id="specialties" className="section section-alt">
        <Container>
          <Row className="text-center mb-5">
            <Col lg={12}>
              <h2 className="section-title">Naše speciality</h2>
              <p className="section-subtitle">
                Každý zákusek je malým uměleckým dílem plným chuti a lásky
              </p>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="card-custom specialty-card">
                <div className="card-image-wrapper">
                  <Card.Img
                    variant="top"
                    src="/images/gallery/svatebni_dorty/IMG_3806.JPG"
                    alt="Svatební dorty"
                    className="card-image"
                  />
                  <div className="card-overlay">
                    <div className="card-icon">🎂</div>
                  </div>
                </div>
                <Card.Body className="text-center">
                  <Card.Title className="card-title-custom">
                    Svatební dorty
                  </Card.Title>
                  <Card.Text className="card-text-custom">
                    Nádherné dorty pro svatby a slavnostní příležitosti. Každý
                    dort je jedinečný a připravený přesně podle vašich představ.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="card-custom specialty-card">
                <div className="card-image-wrapper">
                  <Card.Img
                    variant="top"
                    src="/images/gallery/tartaletky/IMG_0062.JPG"
                    alt="Tartaletky"
                    className="card-image"
                  />
                  <div className="card-overlay">
                    <div className="card-icon">🧁</div>
                  </div>
                </div>
                <Card.Body className="text-center">
                  <Card.Title className="card-title-custom">
                    Luxusní tartaletky
                  </Card.Title>
                  <Card.Text className="card-text-custom">
                    Jemné tartaletky s bohatou krémovou náplní a jedinečnou
                    dekorací. Ideální pro menší oslavy nebo jako elegantní
                    dezert.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="card-custom specialty-card">
                <div className="card-image-wrapper">
                  <Card.Img
                    variant="top"
                    src="/images/gallery/minidezerty/IMG_2478.JPG"
                    alt="Minidezerty"
                    className="card-image"
                  />
                  <div className="card-overlay">
                    <div className="card-icon">�</div>
                  </div>
                </div>
                <Card.Body className="text-center">
                  <Card.Title className="card-title-custom">
                    Minidezerty
                  </Card.Title>
                  <Card.Text className="card-text-custom">
                    Malé sladké pokušení v různých příchutích - od klasických po
                    moderní variace. Perfektní pro cateringové akce.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* O nás preview sekce */}
      <div className="section">
        <Container>
          <h3 className="section-title text-start mb-4">
            Proč zvolit právě nás?
          </h3>
          <Row className="align-items-start">
            <Col lg={6} className="mb-4 mb-lg-0">
              <div className="features-grid">
                <div className="feature-item">
                  <div className="feature-icon">✨</div>
                  <h5 className="feature-title">Kvalita</h5>
                  <p className="feature-text">
                    Pouze nejkvalitnější suroviny od ověřených dodavatelů
                  </p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">📜</div>
                  <h5 className="feature-title">Tradice</h5>
                  <p className="feature-text">
                    Tradiční receptury předávané generacemi
                  </p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🎨</div>
                  <h5 className="feature-title">Kreativita</h5>
                  <p className="feature-text">
                    Individuální objednávky podle vašich představ
                  </p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">⭐</div>
                  <h5 className="feature-title">Zkušenosti</h5>
                  <p className="feature-text">
                    Roky zkušeností v oboru cukrářství
                  </p>
                </div>
              </div>
            </Col>
            <Col lg={6} className="d-flex flex-column">
              <div className="about-image-wrapper">
                <img
                  src="/images/gallery/svatebni_dorty/_MG_6369.jpg"
                  alt="Naše práce"
                  className="about-image"
                />
                <div className="about-image-overlay">
                  <div className="about-stats">
                    <div className="stat-item">
                      <h4>500+</h4>
                      <p>Spokojených zákazníků</p>
                    </div>
                    <div className="stat-item">
                      <h4>1000+</h4>
                      <p>Vytvořených dortů</p>
                    </div>
                  </div>
                  <div className="text-center mt-3">
                    <Button className="btn-secondary-custom" href="/about">
                      Více o naší cukrárně
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* CTA sekce */}
      <div className="section">
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h2 className="section-title">
                Připraveni vytvořit něco výjimečného?
              </h2>
              <p className="section-subtitle mb-4">
                Kontaktujte nás a společně vytvoříme sladký zážitek, který splní
                všechna vaše očekávání.
              </p>
              <div className="cta-buttons">
                <Button
                  className="btn-primary-custom me-3"
                  size="lg"
                  href="/contact"
                >
                  📞 Kontaktujte nás
                </Button>
                <Button
                  className="btn-secondary-custom"
                  size="lg"
                  href="/gallery"
                >
                  📸 Inspirujte se v galerii
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Home;
