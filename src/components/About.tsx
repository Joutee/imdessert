import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./About.css";

const About: React.FC = () => {
  return (
    <div>
      {/* Hero sekce */}
      <div className="about-hero">
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h1 className="about-title fade-in-up">O naší cukrárně</h1>
              <p className="about-subtitle fade-in-up">
                Passion pro sladké chvíle a tradiční receptury předávané
                generacemi
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Náš příběh */}
      <div className="section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h2 className="section-title">Náš příběh</h2>
              <p className="story-text">
                Vítejte v i'm DESSERT, kde se tradiční cukrářství setkává s
                moderní kreativitou. Naše cukrárna vznikla z lásky ke sladkým
                chvílím a touhy vytvářet dezerty, které potěší nejen chuťové
                pohárky, ale i oči.
              </p>
              <p className="story-text">
                S více než 15 lety zkušeností v oboru přinášíme našim zákazníkům
                pouze to nejlepší - od svatebních dortů až po každodenní sladké
                potěšení. Každý výrobek je vytvořen s láskou a pečlivostí.
              </p>
            </Col>
            <Col lg={6}>
              <div className="story-image-wrapper">
                <img
                  src="/images/gallery/tartaletky/IMG_0062.JPG"
                  alt="Naše práce"
                  className="story-image"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Naše hodnoty */}
      <div className="section section-alt">
        <Container>
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <h2 className="section-title">Naše hodnoty</h2>
              <p className="section-subtitle">
                Principy, které nás vedou při každé zakázce
              </p>
            </Col>
          </Row>
          <Row>
            <Col md={6} lg={3} className="mb-4">
              <Card className="value-card">
                <Card.Body className="text-center">
                  <div className="value-icon">✨</div>
                  <h5 className="value-title">Kvalita</h5>
                  <p className="value-text">
                    Používáme pouze nejkvalitnější suroviny od ověřených
                    dodavatelů
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <Card className="value-card">
                <Card.Body className="text-center">
                  <div className="value-icon">🎨</div>
                  <h5 className="value-title">Kreativita</h5>
                  <p className="value-text">
                    Každý dezert je originální dílo přizpůsobené vašim
                    představám
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <Card className="value-card">
                <Card.Body className="text-center">
                  <div className="value-icon">❤️</div>
                  <h5 className="value-title">Láska</h5>
                  <p className="value-text">
                    Do každého výrobku vkládáme kus svého srdce a lásky
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <Card className="value-card">
                <Card.Body className="text-center">
                  <div className="value-icon">📜</div>
                  <h5 className="value-title">Tradice</h5>
                  <p className="value-text">
                    Respektujeme tradiční postupy a receptury našich předků
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Náš tým */}
      <div className="section">
        <Container>
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <h2 className="section-title">Náš tým</h2>
              <p className="section-subtitle">
                Lidé, kteří tvoří kouzlo našich dezertů
              </p>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={6} lg={4} className="mb-4">
              <Card className="team-card">
                <div className="team-image-wrapper">
                  <div className="team-placeholder">
                    <div className="team-avatar">👩‍🍳</div>
                  </div>
                </div>
                <Card.Body className="text-center">
                  <h5 className="team-name">Hlavní cukrářka</h5>
                  <p className="team-role">
                    Zakladatelka & Kreativní ředitelka
                  </p>
                  <p className="team-description">
                    S láskou k detailům a vášní pro dokonalost vytváří
                    nejkrásnější dezerty
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default About;
