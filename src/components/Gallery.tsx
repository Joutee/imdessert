import React, { useState, useEffect } from "react";
import { Modal, Container, Row, Col } from "react-bootstrap";
import {
  serviceAccountGoogleDriveApi,
  GoogleDriveImage,
} from "../services/serviceAccountGoogleDriveApi";
import "./Gallery.css";

interface GalleryItem {
  id: string;
  image: string;
  categoryLabel: string;
  thumbnailLink?: string;
}

const Gallery: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("Vše");
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Funkce pro načítání obrázků z Google Drive
  const fetchGalleryImages = async (
    forceRefresh: boolean = false
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const googleImages =
        await serviceAccountGoogleDriveApi.getAllGalleryImages(forceRefresh);

      const galleryItems: GalleryItem[] = googleImages.map(
        (img: GoogleDriveImage) => ({
          id: img.id,
          image: serviceAccountGoogleDriveApi.getThumbnailUrl(img, 800),
          categoryLabel: img.category,
          thumbnailLink: img.thumbnailLink,
        })
      );

      setGalleryItems(galleryItems);
      setFilteredItems(galleryItems);

      // Debug: výpis prvních pár URLs
      console.log("🔍 Ukázka generovaných URLs:");
      galleryItems.slice(0, 3).forEach((item, index) => {
        console.log(
          `  ${index + 1}. ${item.categoryLabel} (${item.id}): ${item.image}`
        );
      });

      if (forceRefresh) {
        console.log("🔄 Galerie byla vynuceně obnovena!");
      }
    } catch (error: any) {
      console.error("Chyba při načítání obrázků:", error);
      setError(
        "Nepodařilo se načíst obrázky z Google Drive. Zkuste to prosím později."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryImages();
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

  // Získání jedinečných kategorií z načtených obrázků
  const getCategories = () => {
    const categories = ["Vše"];
    const uniqueCategories = Array.from(
      new Set(galleryItems.map((item) => item.categoryLabel))
    );
    return [...categories, ...uniqueCategories.sort()];
  };

  const handleCategoryFilter = (category: string) => {
    setActiveCategory(category);
  };

  const handleImageClick = (index: number) => {
    console.log("🖼️ Kliknuto na obrázek:", {
      index,
      imageId: filteredItems[index]?.id,
      thumbnailLink: filteredItems[index]?.thumbnailLink,
      category: filteredItems[index]?.categoryLabel,
    });
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

      {/* Loading stav */}
      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Načítání...</span>
          </div>
          <p className="mt-3">Načítáme obrázky...</p>
        </div>
      )}

      {/* Error stav */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Chyba při načítání</h4>
          <p>{error}</p>
          <hr />
          <button
            className="btn btn-outline-danger"
            onClick={() => fetchGalleryImages(true)}
          >
            Zkusit znovu (s vynuceným obnovením)
          </button>
        </div>
      )}

      {/* Filtrační tlačítka */}
      {!loading && !error && (
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
      )}

      {/* Galerie obrázků */}
      {!loading && !error && (
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
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    console.log("❌ Chyba při načítání obrázku:", item.id);
                    console.log("❌ URL která selhala:", target.src);

                    // Zkusíme fallback na lh3.googleusercontent.com
                    if (!target.src.includes("lh3.googleusercontent.com")) {
                      console.log(
                        "🔄 Zkouším fallback na lh3.googleusercontent.com"
                      );
                      target.src = `https://lh3.googleusercontent.com/d/${item.id}=s800`;
                    } else {
                      console.log("🔄 Skrývám obrázek, všechny URL selhaly");
                      target.style.display = "none";
                    }
                  }}
                />
                <div className="gallery-overlay">
                  <span className="gallery-category">{item.categoryLabel}</span>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}

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
                src={`https://drive.google.com/uc?id=${filteredItems[currentImageIndex]?.id}&export=view`}
                alt={filteredItems[currentImageIndex]?.categoryLabel}
                className="modal-image"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  console.log(
                    "❌ Chyba při načítání modalu:",
                    filteredItems[currentImageIndex]?.id
                  );
                  console.log("❌ URL která selhala:", target.src);

                  // Fallback na lh3.googleusercontent.com
                  if (!target.src.includes("lh3.googleusercontent.com")) {
                    console.log(
                      "🔄 Zkouším fallback na lh3.googleusercontent.com pro modal"
                    );
                    target.src = `https://lh3.googleusercontent.com/d/${filteredItems[currentImageIndex]?.id}=s1600`;
                  } else {
                    console.log(
                      "🔄 Skrývám modal obrázek, všechny URL selhaly"
                    );
                    target.style.display = "none";
                  }
                }}
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
