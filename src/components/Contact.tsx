import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import "./Contact.css";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    event: "",
    message: "",
  });
  const [showAlert, setShowAlert] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Zde by byla logika pro odeslání formuláře
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
    // Reset formuláře
    setFormData({
      name: "",
      email: "",
      phone: "",
      event: "",
      message: "",
    });
  };

  return (
    <div>
      {/* Hero sekce */}
      <div className="contact-hero">
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h1 className="contact-title fade-in-up">Kontaktujte nás</h1>
              <p className="contact-subtitle fade-in-up">
                Jsme tu pro vás a rádi si s vámi promluvíme o vašich sladkých
                přáních
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Kontaktní informace a formulář */}
      <div className="section">
        <Container>
          <Row>
            <Col lg={6} className="mb-5 mb-lg-0">
              <h2 className="section-title">Napište nám</h2>
              <p className="contact-description">
                Máte dotaz ohledně naší nabídky? Chcete si objednat speciální
                dort? Neváhejte nás kontaktovat - rádi vám pomůžeme!
              </p>

              {showAlert && (
                <Alert variant="success" className="custom-alert">
                  <strong>Děkujeme!</strong> Vaše zpráva byla úspěšně odeslána.
                  Ozveme se vám co nejdříve.
                </Alert>
              )}

              <Form onSubmit={handleSubmit} className="contact-form">
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Jméno a příjmení *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="form-control-custom"
                        placeholder="Vaše jméno"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="form-control-custom"
                        placeholder="vas@email.cz"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Telefon</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="form-control-custom"
                        placeholder="+420 xxx xxx xxx"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Typ akce</Form.Label>
                      <Form.Select
                        name="event"
                        value={formData.event}
                        onChange={handleInputChange}
                        className="form-control-custom"
                      >
                        <option value="">Vyberte typ akce</option>
                        <option value="svatba">Svatba</option>
                        <option value="narozeniny">Narozeniny</option>
                        <option value="firemni">Firemní akce</option>
                        <option value="oslavy">Oslavy</option>
                        <option value="jine">Jiné</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-4">
                  <Form.Label>Zpráva *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="form-control-custom"
                    placeholder="Popište nám své představy o dortu nebo zákusku..."
                  />
                </Form.Group>
                <Button type="submit" className="btn-primary-custom" size="lg">
                  📧 Odeslat zprávu
                </Button>
              </Form>
            </Col>

            <Col lg={6}>
              <div className="contact-info">
                <h2 className="section-title">Kontaktní údaje</h2>

                <Card className="contact-card">
                  <Card.Body>
                    <div className="contact-item">
                      <div className="contact-icon">📧</div>
                      <div>
                        <h5>Email</h5>
                        <p>info@imdessert.cz</p>
                      </div>
                    </div>
                    <div className="contact-item">
                      <div className="contact-icon">📱</div>
                      <div>
                        <h5>Telefon</h5>
                        <p>+420 XXX XXX XXX</p>
                      </div>
                    </div>
                    <div className="contact-item">
                      <div className="contact-icon">📍</div>
                      <div>
                        <h5>Adresa</h5>
                        <p>Česká republika</p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>

                <Card className="contact-card mt-4">
                  <Card.Body>
                    <h5 className="card-title">💡 Tip pro objednávku</h5>
                    <p className="tip-text">
                      Pro nejlepší výsledek nás kontaktujte alespoň 2 týdny
                      předem. U větších akcí (svatby, velké oslavy) doporučujeme
                      objednat minimálně měsíc dopředu.
                    </p>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Contact;
