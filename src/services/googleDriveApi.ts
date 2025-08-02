// Google Drive API konfigurace a funkce pro frontend
import { gapi } from "gapi-script";

// Google Drive API konfigurace z environment variables
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REACT_APP_GOOGLE_REFRESH_TOKEN;
const ACCESS_TOKEN = process.env.REACT_APP_GOOGLE_ACCESS_TOKEN;

// ID hlavní složky galerie
const MAIN_FOLDER_ID = process.env.REACT_APP_GOOGLE_DRIVE_FOLDER_ID;

// Kontrola, jestli jsou všechny potřebné environment variables nastavené
if (
  !CLIENT_ID ||
  !CLIENT_SECRET ||
  !REFRESH_TOKEN ||
  !ACCESS_TOKEN ||
  !MAIN_FOLDER_ID
) {
  console.error(
    "❌ Chybí Google Drive API konfigurace v environment variables!"
  );
  console.error(
    "Ujistěte se, že máte nastavené všechny REACT_APP_GOOGLE_* proměnné v .env souboru"
  );
}

// Mapování názvů složek na kategorie
const FOLDER_NAME_MAP: { [key: string]: string } = {
  "Svatebni dorty": "Svatební dorty",
  "Svatební dorty": "Svatební dorty",
  Dortiky: "Dortíky",
  "Svatebni bary": "Svatební bary",
  "Svatební bary": "Svatební bary",
  Poharky: "Pohárky",
  Pohárky: "Pohárky",
  Tartaletky: "Tartaletky",
  Minidezerty: "Minidezerty",
  "Odpalovane vetr": "Odpalované větrníčky",
  "Odpalované větr": "Odpalované větrníčky",
  "Ovoce a tvary": "Ovoce a tvary",
  "Tradicni zakusky": "Tradiční zákusky",
  "Tradiční zákusky": "Tradiční zákusky",
};

export interface GoogleDriveImage {
  id: string;
  name: string;
  thumbnailLink: string;
  webViewLink: string;
  webContentLink: string;
  category: string;
}

class GoogleDriveApiService {
  private isInitialized = false;

  // Inicializace Google API
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    if (!CLIENT_ID || !ACCESS_TOKEN) {
      throw new Error(
        "Chybí Google Drive API konfigurace - CLIENT_ID nebo ACCESS_TOKEN"
      );
    }

    try {
      await new Promise<void>((resolve, reject) => {
        gapi.load("client:auth2", {
          callback: async () => {
            try {
              await gapi.client.init({
                clientId: CLIENT_ID,
                discoveryDocs: [
                  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
                ],
                scope: "https://www.googleapis.com/auth/drive.readonly",
              });

              // Nastavení access tokenu
              gapi.client.setToken({
                access_token: ACCESS_TOKEN,
              });

              this.isInitialized = true;
              console.log("✅ Google Drive API inicializováno");
              resolve();
            } catch (error) {
              console.error("❌ Chyba při inicializaci Google API:", error);
              reject(error);
            }
          },
          onerror: (error: any) => {
            console.error("❌ Chyba při načítání Google API:", error);
            reject(error);
          },
        });
      });
    } catch (error) {
      console.error("❌ Chyba při inicializaci:", error);
      throw error;
    }
  }

  // Získání všech podsložek v hlavní složce galerie
  async getGalleryFolders(forceRefresh: boolean = false): Promise<any[]> {
    await this.initialize();

    try {
      const response = await gapi.client.request({
        path: "https://www.googleapis.com/drive/v3/files",
        params: {
          q: `'${MAIN_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
          fields: "files(id,name,modifiedTime)",
          orderBy: "name",
          pageSize: 1000, // Zvýšíme limit pro více složek
        },
        headers: forceRefresh
          ? {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            }
          : {},
      });

      console.log("📁 Nalezené složky:", response.result.files);
      console.log(`📊 Počet složek: ${response.result.files?.length || 0}`);

      if (forceRefresh) {
        console.log("🔄 Použito force refresh pro složky");
      }

      return response.result.files || [];
    } catch (error) {
      console.error("❌ Chyba při načítání složek:", error);
      throw error;
    }
  }

  // Získání obrázků ze složky
  async getImagesFromFolder(
    folderId: string,
    folderName: string,
    forceRefresh: boolean = false
  ): Promise<GoogleDriveImage[]> {
    await this.initialize();

    try {
      const response = await gapi.client.request({
        path: "https://www.googleapis.com/drive/v3/files",
        params: {
          q: `'${folderId}' in parents and (mimeType contains 'image/') and trashed=false`,
          fields:
            "files(id,name,thumbnailLink,webViewLink,webContentLink,modifiedTime,createdTime,size)",
          orderBy: forceRefresh ? "createdTime desc" : "name", // Nejnovější první při force refresh
          pageSize: 1000, // Zvýšíme limit pro více obrázků
        },
        headers: forceRefresh
          ? {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            }
          : {},
      });

      const images = response.result.files || [];
      const category = FOLDER_NAME_MAP[folderName] || folderName;

      console.log(
        `📷 Složka "${folderName}" -> Kategorie "${category}": ${
          images.length
        } obrázků${forceRefresh ? " (force refresh)" : ""}`
      );

      // Debug: kontrola raw dat z API
      if (images.length > 0) {
        console.log("🔍 Raw data z API pro první obrázek:", images[0]);
        console.log(
          "🔍 Všechna pole v prvním obrázku:",
          Object.keys(images[0])
        );
        console.log("🔍 thumbnailLink existuje?", !!images[0].thumbnailLink);
        console.log("🔍 thumbnailLink hodnota:", images[0].thumbnailLink);
      }

      const mappedImages = images.map((file: any) => ({
        id: file.id,
        name: file.name,
        thumbnailLink: file.thumbnailLink,
        webViewLink: file.webViewLink,
        webContentLink: file.webContentLink,
        category: category,
      }));

      // Debug: ukázka prvního obrázku
      if (mappedImages.length > 0) {
        const firstImage = mappedImages[0];
        console.log(`🔍 Ukázka URLs pro "${firstImage.name}":`, {
          thumbnailLink: firstImage.thumbnailLink,
          thumbnailExists: !!firstImage.thumbnailLink,
          webViewLink: firstImage.webViewLink,
          webViewExists: !!firstImage.webViewLink,
          directUrl: this.getDirectImageUrl(firstImage.id),
          highResUrl: this.getHighResImageUrl(firstImage.id),
        });

        if (!firstImage.thumbnailLink) {
          console.warn(
            "⚠️ VAROVÁNÍ: thumbnailLink chybí! Možný problém s oprávněními."
          );
        }
      }

      return mappedImages;
    } catch (error) {
      console.error(
        `❌ Chyba při načítání obrázků ze složky ${folderName}:`,
        error
      );
      return [];
    }
  }

  // Získání všech obrázků z galerie
  async getAllGalleryImages(
    forceRefresh: boolean = false
  ): Promise<GoogleDriveImage[]> {
    try {
      console.log(
        `🔄 Načítám obrázky z Google Drive${
          forceRefresh ? " (force refresh)" : ""
        }...`
      );

      const folders = await this.getGalleryFolders(forceRefresh);
      console.log(
        `📁 Nalezeno celkem ${folders.length} složek:`,
        folders.map((f) => f.name)
      );

      const allImages: GoogleDriveImage[] = [];

      // Paralelní načítání obrázků ze všech složek
      const imagePromises = folders.map((folder) =>
        this.getImagesFromFolder(folder.id, folder.name, forceRefresh)
      );

      const imageArrays = await Promise.all(imagePromises);

      // Spojení všech obrázků do jednoho pole
      imageArrays.forEach((images, index) => {
        console.log(
          `📦 Složka ${folders[index].name}: ${images.length} obrázků`
        );
        allImages.push(...images);
      });

      // Debug informace o kategoriích
      const categories = Array.from(
        new Set(allImages.map((img) => img.category))
      );
      console.log(`🏷️ Jedinečné kategorie (${categories.length}):`, categories);

      // Statistiky podle kategorií
      categories.forEach((category) => {
        const count = allImages.filter(
          (img) => img.category === category
        ).length;
        console.log(`   ${category}: ${count} obrázků`);
      });

      console.log(
        `✅ Načteno celkem ${allImages.length} obrázků z ${
          folders.length
        } složek${forceRefresh ? " (s vynuceným obnovením)" : ""}`
      );

      return allImages;
    } catch (error) {
      console.error("❌ Chyba při načítání galerie:", error);
      throw error;
    }
  }

  // Konverze Google Drive URL na přímý odkaz pro zobrazení
  getDirectImageUrl(fileId: string): string {
    // Alternativní formáty pro různé případy použití
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }

  // Alternativní URL pro větší obrázky
  getHighResImageUrl(fileId: string): string {
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }

  // Nová metoda pro větší thumbnail
  getBetterThumbnailUrl(thumbnailLink: string): string {
    if (!thumbnailLink) return "";
    // Nahradí =s220 za =s800 pro větší thumbnail
    return thumbnailLink.replace("=s220", "=s800");
  }

  // Nová metoda pro high quality obrázky v galerii
  getGalleryImageUrl(fileId: string): string {
    // Návrat k spolehlivému thumbnail URL, ale s vyšší kvalitou
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }

  // Refresh access token když expiruje
  async refreshAccessToken(): Promise<void> {
    if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
      throw new Error("Chybí Google OAuth konfigurace pro refresh tokenu");
    }

    try {
      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          refresh_token: REFRESH_TOKEN,
          grant_type: "refresh_token",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        gapi.client.setToken({
          access_token: data.access_token,
        });
        console.log("🔄 Access token obnoven");
      } else {
        console.error("❌ Chyba při obnovení tokenu:", await response.text());
      }
    } catch (error) {
      console.error("❌ Chyba při obnovení access tokenu:", error);
    }
  }
}

export const googleDriveApi = new GoogleDriveApiService();
