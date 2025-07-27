import React, { useState, useEffect } from "react";
import { Modal, Container, Row, Col } from "react-bootstrap";
import "./Gallery.css";

interface GalleryItem {
  id: number;
  image: string;
  categoryLabel: string;
}

const Gallery: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("Vše");
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mapping kategorií k obrázkům
  const categoryImages = {
    "Svatební dorty": [
      "gallery/svatebni_dorty/226355835_611830156446746_2348951962239083661_n.jpg",
      "gallery/svatebni_dorty/239972602_581904572834152_5605270540226798176_n (1).jpg",
      "gallery/svatebni_dorty/3.JPG",
      "gallery/svatebni_dorty/8888.jpg",
      "gallery/svatebni_dorty/IMG-20220719-WA0004.jpg",
      "gallery/svatebni_dorty/IMG20230930093600.jpg",
      "gallery/svatebni_dorty/IMG_0009.JPG",
      "gallery/svatebni_dorty/IMG_20230812_153224.jpg",
      "gallery/svatebni_dorty/IMG_2544.JPG",
      "gallery/svatebni_dorty/IMG_3806.JPG",
      "gallery/svatebni_dorty/IMG_3836.JPG",
      "gallery/svatebni_dorty/IMG_3868.JPG",
      "gallery/svatebni_dorty/IMG_3896.JPG",
      "gallery/svatebni_dorty/IMG_4031.JPG",
      "gallery/svatebni_dorty/_MG_6369.jpg",
    ],
    Dortíky: [
      "gallery/dortiky/2021-07-10 marketavlasata photo (244).jpg",
      "gallery/dortiky/IMG_2329.JPG",
      "gallery/dortiky/_3213884.JPG",
      "gallery/dortiky/_3213887.JPG",
      "gallery/dortiky/_3213894.JPG",
    ],
    "Svatební bary": [
      "gallery/svatebni_bary/2021-07-10 marketavlasata photo (237).jpg",
      "gallery/svatebni_bary/2021-07-10 marketavlasata photo (238).jpg",
      "gallery/svatebni_bary/2021-07-10 marketavlasata photo (240).jpg",
      "gallery/svatebni_bary/2021-07-10 marketavlasata photo (241).jpg",
      "gallery/svatebni_bary/2021-07-10 marketavlasata photo (242).jpg",
      "gallery/svatebni_bary/296446143_3267480410191559_1126760623025135470_n.jpg",
      "gallery/svatebni_bary/296472004_2287493091404050_1238877990560344701_n.jpg",
      "gallery/svatebni_bary/296746580_539205938003209_4468912488144096325_n.jpg",
      "gallery/svatebni_bary/Aneta&Richard 198.jpg",
      "gallery/svatebni_bary/Aneta&Richard 199.jpg",
      "gallery/svatebni_bary/Aneta&Richard 202.jpg",
    ],
    Pohárky: [
      "gallery/poharky/DSC04245.jpg",
      "gallery/poharky/_3113766.JPG",
      "gallery/poharky/_3113779.JPG",
      "gallery/poharky/_3113788.JPG",
      "gallery/poharky/_3113791.JPG",
      "gallery/poharky/_3113792.JPG",
      "gallery/poharky/_9170895.JPG",
    ],
    Tartaletky: [
      "gallery/tartaletky/1.jpeg",
      "gallery/tartaletky/20180908_100936.jpg",
      "gallery/tartaletky/9170897.JPG",
      "gallery/tartaletky/IMG_0062.JPG",
      "gallery/tartaletky/IMG_0080.JPG",
      "gallery/tartaletky/IMG_0082.JPG",
      "gallery/tartaletky/IMG_0093.JPG",
      "gallery/tartaletky/IMG_0097.JPG",
      "gallery/tartaletky/IMG_2319.JPG",
      "gallery/tartaletky/IMG_2608.JPG",
    ],
    Minidezerty: [
      "gallery/minidezerty/92713601_683283548880254_4619769713814142976_n.jpg",
      "gallery/minidezerty/IMG_0406.JPG",
      "gallery/minidezerty/IMG_2478.JPG",
      "gallery/minidezerty/IMG_2509.JPG",
      "gallery/minidezerty/IMG_2512.JPG",
      "gallery/minidezerty/IMG_2613.JPG",
    ],
    "Odpalované větrníčky": [
      "gallery/odpalovane_vetrnicky_a_eclairs/_3244126.JPG",
      "gallery/odpalovane_vetrnicky_a_eclairs/_3244139.JPG",
      "gallery/odpalovane_vetrnicky_a_eclairs/_9170900.JPG",
    ],
    "Ovoce a tvary": [
      "gallery/ovoce_a_jine_tvary/99044344_644685266389855_384932294965592064_n.jpg",
      "gallery/ovoce_a_jine_tvary/IMG_2945.JPG",
    ],
    "Tradiční zákusky": [
      "gallery/tradicni_zakusky/1.jpg",
      "gallery/tradicni_zakusky/20180908_104148.jpg",
      "gallery/tradicni_zakusky/_9170888.JPG",
    ],
  };

  // Funkce pro generování gallery items
  const generateGalleryItems = (): GalleryItem[] => {
    const items: GalleryItem[] = [];
    let id = 1;

    Object.entries(categoryImages).forEach(([category, images]) => {
      images.forEach((imageName) => {
        items.push({
          id: id++,
          image: `/images/${imageName}`,
          categoryLabel: category,
        });
      });
    });

    return items;
  };

  useEffect(() => {
    const items = generateGalleryItems();
    setGalleryItems(items);
    setFilteredItems(items);
  }, []);

  useEffect(() => {
    if (activeCategory === "Vše") {
      setFilteredItems(galleryItems);
    } else {
      setFilteredItems(
        galleryItems.filter((item) => item.categoryLabel === activeCategory)
      );
    }
  }, [activeCategory, galleryItems]);

  // Získání jedinečných kategorií
  const getCategories = () => {
    const categories = ["Vše", ...Object.keys(categoryImages)];
    return categories;
  };

  const handleCategoryFilter = (category: string) => {
    setActiveCategory(category);
  };

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? filteredItems.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === filteredItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      handlePrevImage();
    } else if (event.key === "ArrowRight") {
      handleNextImage();
    } else if (event.key === "Escape") {
      handleCloseModal();
    }
  };

  return (
    <Container className="gallery-container">
      <h2 className="gallery-title">Naše Tvorba</h2>

      {/* Filtrační tlačítka */}
      <div className="filter-buttons mb-4">
        <Row className="justify-content-center">
          {getCategories().map((category) => (
            <Col key={category} xs="auto" className="mb-2">
              <button
                className={`filter-btn ${
                  activeCategory === category ? "active" : ""
                }`}
                onClick={() => handleCategoryFilter(category)}
              >
                {category}
              </button>
            </Col>
          ))}
        </Row>
      </div>

      <Row>
        {filteredItems.map((item, index) => (
          <Col key={item.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <div
              className="gallery-item"
              onClick={() => handleImageClick(index)}
            >
              <img
                src={item.image}
                alt={item.categoryLabel}
                className="gallery-image"
              />
              <div className="gallery-overlay">
                <span className="gallery-category">{item.categoryLabel}</span>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        size="lg"
        centered
        onKeyDown={handleKeyDown}
        tabIndex={-1}
        backdrop={true}
      >
        <Modal.Body className="text-center position-relative">
          {filteredItems.length > 0 && (
            <>
              <button
                className="modal-close-btn"
                onClick={handleCloseModal}
                aria-label="Zavřít"
              >
                &#10005;
              </button>
              <img
                src={filteredItems[currentImageIndex]?.image}
                alt={filteredItems[currentImageIndex]?.categoryLabel}
                className="modal-image"
              />
              <button
                className="modal-nav-btn modal-prev-btn"
                onClick={handlePrevImage}
                aria-label="Předchozí obrázek"
              ></button>
              <button
                className="modal-nav-btn modal-next-btn"
                onClick={handleNextImage}
                aria-label="Další obrázek"
              ></button>
              <div className="modal-counter">
                {currentImageIndex + 1} / {filteredItems.length}
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Gallery;
