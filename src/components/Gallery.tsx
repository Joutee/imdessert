import React, { useState, useEffect } from "react";
import { Modal, Container, Row, Col } from "react-bootstrap";
import {
  serviceAccountGoogleDriveApi,
  GoogleDriveImage,
  GalleryData,
} from "../services/serviceAccountGoogleDriveApi";
import "./Gallery.css";

interface GalleryItem {
  id: string;
  image: string;
  categoryLabel: string;
  thumbnailLink?: string;
  fallbackUrls?: string[];
}

const Gallery: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("Vše");
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Funkce pro načítání dat z Google Drive
  const fetchGalleryData = async (
    forceRefresh: boolean = false
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      console.log("🚀 Načítám dynamická data galerie...");

      // Získáme kompletní data (složky + obrázky)
      const galleryData: GalleryData = 
        await serviceAccountGoogleDriveApi.getCompleteGalleryData(forceRefresh);

      console.log("📊 Načtená data z API:", {
        folders: galleryData.folders,
        imagesCount: galleryData.images.length,
        firstImage: galleryData.images[0]
      });

      // Vytvoříme seznam kategorií ze složek
      const folderNames = galleryData.folders.map(folder => folder.name);
      const allCategories = ["Vše", ...folderNames.sort()];
      setCategories(allCategories);

      console.log("📁 Dynamicky načtené kategorie:", allCategories);

      // Převedeme obrázky na formát pro galerii
      const galleryItems: GalleryItem[] = galleryData.images.map(
        (img: GoogleDriveImage) => {
          // Získáme spolehlivé URL pro miniaturu
          const imageUrls = serviceAccountGoogleDriveApi.getImageUrls(img, 800);
          
          return {
            id: img.id,
            image: imageUrls.primary,
            categoryLabel: img.category,
            thumbnailLink: img.thumbnailLink,
            fallbackUrls: imageUrls.fallbacks, // Přidáme fallback URLs
          };
        }
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
    fetchGalleryData();
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

  // Dynamické získání kategorií z načtených dat
  const getCategories = () => {
    return categories; // Používáme dynamicky načtené kategorie
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
            onClick={() => fetchGalleryData(true)}
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
                    console.log("❌ Chyba při načítání miniatury:", item.id);
                    console.log("❌ URL která selhala:", target.src);

                    // Zkusíme fallback URLs pokud je máme
                    if (item.fallbackUrls && item.fallbackUrls.length > 0) {
                      // Najdeme aktuální URL v seznamu fallbacks
                      const currentUrlIndex = item.fallbackUrls.findIndex(url => url === target.src);
                      const nextUrlIndex = currentUrlIndex + 1;
                      
                      if (nextUrlIndex < item.fallbackUrls.length) {
                        const nextUrl = item.fallbackUrls[nextUrlIndex];
                        console.log(`🔄 Zkouším fallback URL ${nextUrlIndex + 1}:`, nextUrl);
                        target.src = nextUrl;
                        return;
                      } else if (currentUrlIndex === -1 && item.fallbackUrls.length > 0) {
                        // Pokud aktuální URL není v fallbacks, zkusíme první fallback
                        console.log("🔄 Zkouším první fallback URL:", item.fallbackUrls[0]);
                        target.src = item.fallbackUrls[0];
                        return;
                      }
                    }

                    // Pokud ani fallback nefunguje, nahradíme placeholder obrázkem
                    console.log("🔄 Používám placeholder obrázek");
                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f8f9fa'/%3E%3Ctext x='200' y='150' text-anchor='middle' dy='0.3em' font-family='Arial, sans-serif' font-size='16' fill='%23868e96'%3ENačítání...%3C/text%3E%3C/svg%3E";
                    target.style.opacity = "0.5";
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
                src={serviceAccountGoogleDriveApi.getHighQualityImageUrl({
                  id: filteredItems[currentImageIndex]?.id,
                  name: filteredItems[currentImageIndex]?.categoryLabel,
                  thumbnailLink: filteredItems[currentImageIndex]?.thumbnailLink || '',
                  webViewLink: '',
                  webContentLink: '',
                  category: filteredItems[currentImageIndex]?.categoryLabel,
                  folderId: ''
                })}
                alt={filteredItems[currentImageIndex]?.categoryLabel}
                className="modal-image"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const currentItem = filteredItems[currentImageIndex];
                  console.log("❌ Chyba při načítání velkého obrázku:", currentItem?.id);
                  console.log("❌ URL která selhala:", target.src);

                  // Fallback strategie pro velké obrázky
                  if (target.src.includes('lh3.googleusercontent.com') && target.src.includes('=s1600')) {
                    // Zkusíme s menší velikostí
                    console.log("🔄 Zkouším menší velikost =s1200");
                    target.src = `https://lh3.googleusercontent.com/d/${currentItem?.id}=s1200`;
                  } else if (target.src.includes('lh3.googleusercontent.com') && target.src.includes('=s1200')) {
                    // Zkusíme původní drive.google.com URL
                    console.log("🔄 Zkouším drive.google.com URL");
                    target.src = `https://drive.google.com/uc?id=${currentItem?.id}&export=view`;
                  } else if (currentItem?.thumbnailLink && !target.src.includes(currentItem.thumbnailLink)) {
                    // Zkusíme původní thumbnailLink ve větší velikosti
                    console.log("🔄 Zkouším thumbnailLink ve velikosti =s1600");
                    target.src = currentItem.thumbnailLink.replace(/=s\d+/, '=s1600');
                  } else {
                    // Jako poslední možnost zkusíme menší velikost z lh3
                    const fallbackUrl = `https://lh3.googleusercontent.com/d/${currentItem?.id}=s800`;
                    if (target.src !== fallbackUrl) {
                      console.log("🔄 Zkouším poslední fallback s velikostí =s800");
                      target.src = fallbackUrl;
                    } else {
                      console.log("🔄 Používám placeholder pro modal");
                      target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f8f9fa'/%3E%3Ctext x='400' y='300' text-anchor='middle' dy='0.3em' font-family='Arial, sans-serif' font-size='24' fill='%23868e96'%3EObrázek není dostupný%3C/text%3E%3C/svg%3E";
                    }
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
