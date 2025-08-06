// Service Account Google Drive API pro trvalou autentizaci (browser compatible)

// Service Account konfigurace z environment variables
const SERVICE_ACCOUNT_EMAIL =
  process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL;
const SERVICE_ACCOUNT_PRIVATE_KEY =
  process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
const MAIN_FOLDER_ID = process.env.REACT_APP_GOOGLE_DRIVE_FOLDER_ID;

export interface GoogleDriveFolder {
  id: string;
  name: string;
}

export interface GoogleDriveImage {
  id: string;
  name: string;
  thumbnailLink: string;
  webViewLink: string;
  webContentLink: string;
  category: string;
  folderId: string;
}

export interface GalleryData {
  folders: GoogleDriveFolder[];
  images: GoogleDriveImage[];
}

class ServiceAccountGoogleDriveApi {
  private accessToken: string | null = null;
  private tokenExpiryTime: number = 0;

  // Kontrola, jestli máme platný token
  private isTokenValid(): boolean {
    return this.accessToken !== null && Date.now() < this.tokenExpiryTime;
  }

  // Base64URL encoding pro JWT
  private base64UrlEncode(bytes: Uint8Array): string {
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }

  // String to Uint8Array
  private stringToUint8Array(str: string): Uint8Array {
    return new TextEncoder().encode(str);
  }

  // Import private key pro Web Crypto API
  private async importPrivateKey(privateKeyPem: string): Promise<CryptoKey> {
    // Odstranění PEM hlaviček a formátování
    const pemContent = privateKeyPem
      .replace(/-----BEGIN PRIVATE KEY-----/g, "")
      .replace(/-----END PRIVATE KEY-----/g, "")
      .replace(/\n/g, "")
      .replace(/\r/g, "")
      .replace(/\s/g, "");

    // Převod base64 na ArrayBuffer
    const binaryString = atob(pemContent);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Import klíče
    return await crypto.subtle.importKey(
      "pkcs8",
      bytes.buffer,
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: "SHA-256",
      },
      false,
      ["sign"]
    );
  }

  // Vytvoření JWT tokenu pro Service Account
  private async createJWT(): Promise<string> {
    if (!SERVICE_ACCOUNT_EMAIL || !SERVICE_ACCOUNT_PRIVATE_KEY) {
      throw new Error("Service Account konfigurace není kompletní");
    }

    const now = Math.floor(Date.now() / 1000);
    const expiry = now + 3600; // 1 hodina

    // JWT Header
    const header = {
      alg: "RS256",
      typ: "JWT",
    };

    // JWT Payload
    const payload = {
      iss: SERVICE_ACCOUNT_EMAIL,
      scope: "https://www.googleapis.com/auth/drive.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: expiry,
    };

    // Kódování header a payload
    const encodedHeader = this.base64UrlEncode(
      this.stringToUint8Array(JSON.stringify(header))
    );
    const encodedPayload = this.base64UrlEncode(
      this.stringToUint8Array(JSON.stringify(payload))
    );

    const message = `${encodedHeader}.${encodedPayload}`;

    // Import private key a podpis
    const privateKey = await this.importPrivateKey(SERVICE_ACCOUNT_PRIVATE_KEY);
    const signature = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      privateKey,
      this.stringToUint8Array(message)
    );

    const encodedSignature = this.base64UrlEncode(new Uint8Array(signature));

    return `${message}.${encodedSignature}`;
  }

  // Získání access tokenu pomocí Service Account
  private async getAccessToken(): Promise<string> {
    if (this.isTokenValid() && this.accessToken) {
      console.log(
        "🔄 Používám existující Service Account token, platnost:",
        Math.round((this.tokenExpiryTime - Date.now()) / 1000 / 60),
        "minut"
      );
      return this.accessToken;
    }

    try {
      console.log("🔑 Získávám nový Service Account token...");
      console.log("📧 Service Account Email:", SERVICE_ACCOUNT_EMAIL);
      console.log("🔐 Private Key prezent:", SERVICE_ACCOUNT_PRIVATE_KEY ? "✅" : "❌");
      console.log("📁 Main Folder ID:", MAIN_FOLDER_ID);
      
      const assertion = await this.createJWT();
      console.log("🎯 JWT assertion vytvořen, délka:", assertion.length);

      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
          assertion: assertion,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Service Account autentizace selhala: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiryTime = Date.now() + data.expires_in * 1000 - 60000; // 1 minuta před expirací

      console.log(
        "✅ Service Account token získán, platnost:",
        Math.round((this.tokenExpiryTime - Date.now()) / 1000 / 60),
        "minut"
      );

      if (!this.accessToken) {
        throw new Error(
          "Access token nebyl získán ze service account response"
        );
      }

      return this.accessToken;
    } catch (error) {
      console.error("❌ Chyba při získávání Service Account tokenu:", error);
      throw error;
    }
  }

  // API volání s automatickou autentizací
  private async makeApiCall(
    url: string,
    params: Record<string, any> = {}
  ): Promise<any> {
    const accessToken = await this.getAccessToken();

    const urlWithParams = new URL(url);
    Object.entries(params).forEach(([key, value]) => {
      urlWithParams.searchParams.append(key, value);
    });

    const response = await fetch(urlWithParams.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expiroval, vynulujeme ho a zkusíme znovu
        this.accessToken = null;
        this.tokenExpiryTime = 0;
        console.log("🔄 Token expiroval, získávám nový...");
        return this.makeApiCall(url, params);
      }
      throw new Error(
        `API volání selhalo: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  // Získání všech složek z galerie
  async getGalleryFolders(): Promise<GoogleDriveFolder[]> {
    try {
      console.log("📁 Načítám složky galerie z Google Drive...");

      const data = await this.makeApiCall(
        "https://www.googleapis.com/drive/v3/files",
        {
          q: `'${MAIN_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
          fields: "files(id,name)",
        }
      );

      const folders = data.files || [];
      console.log(
        `✅ Nalezeno ${folders.length} složek:`,
        folders.map((f: any) => f.name)
      );

      return folders.map((folder: any) => ({
        id: folder.id,
        name: folder.name,
      }));
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
    try {
      console.log(`🖼️ Načítám obrázky ze složky "${folderName}"...`);

      const data = await this.makeApiCall(
        "https://www.googleapis.com/drive/v3/files",
        {
          q: `'${folderId}' in parents and (mimeType contains 'image/') and trashed=false`,
          fields: "files(id,name,thumbnailLink,webViewLink,webContentLink)",
        }
      );

      const files = data.files || [];
      console.log(
        `✅ Nalezeno ${files.length} obrázků ve složce "${folderName}"`
      );

      return files.map((file: any) => ({
        id: file.id,
        name: file.name,
        thumbnailLink: file.thumbnailLink || "",
        webViewLink: file.webViewLink || "",
        webContentLink: file.webContentLink || "",
        category: folderName, // Použijeme přímo název složky jako kategorii
        folderId: folderId,
      }));
    } catch (error) {
      console.error(
        `❌ Chyba při načítání obrázků ze složky "${folderName}":`,
        error
      );
      throw error;
    }
  }

  // Získání všech obrázků galerie
  async getAllGalleryImages(
    forceRefresh: boolean = false
  ): Promise<GoogleDriveImage[]> {
    try {
      console.log("🎯 Začínám načítání kompletní galerie...");

      // Nejdříve získáme všechny složky
      const folders = await this.getGalleryFolders();
      console.log(`📁 Nalezeno ${folders.length} složek pro zpracování`);

      // Získáme obrázky ze všech složek
      const allImages: GoogleDriveImage[] = [];

      for (const folder of folders) {
        try {
          const images = await this.getImagesFromFolder(
            folder.id,
            folder.name,
            forceRefresh
          );
          allImages.push(...images);
        } catch (error) {
          console.warn(
            `⚠️ Nepodařilo se načíst obrázky ze složky "${folder.name}":`,
            error
          );
        }
      }

      console.log(
        `✅ Celkem načteno ${allImages.length} obrázků z ${folders.length} složek`
      );
      return allImages;
    } catch (error) {
      console.error("❌ Chyba při načítání galerie:", error);
      throw error;
    }
  }

  // Nová metoda pro získání kompletních dat galerie (složky + obrázky)
  async getCompleteGalleryData(
    forceRefresh: boolean = false
  ): Promise<GalleryData> {
    try {
      console.log("🎯 Načítám kompletní data galerie...");

      // Nejdříve získáme všechny složky
      const folders = await this.getGalleryFolders();
      
      // Pak získáme všechny obrázky
      const images = await this.getAllGalleryImages(forceRefresh);

      return {
        folders,
        images,
      };
    } catch (error) {
      console.error("❌ Chyba při načítání kompletních dat galerie:", error);
      throw error;
    }
  }

  // Získání přímého odkazu na obrázek ve vysoké kvalitě
  getHighQualityImageUrl(image: GoogleDriveImage): string {
    // Používáme drive.google.com pro spolehlivé načítání velkých obrázků
    return `https://drive.google.com/uc?id=${image.id}&export=view`;
  }

  // Získání odkazu na thumbnail s fallback strategií
  getThumbnailUrl(image: GoogleDriveImage, size: number = 400): string {
    // Priorita 1: Upravený thumbnailLink z Google Drive API
    if (image.thumbnailLink && image.thumbnailLink.includes('googleusercontent.com')) {
      return image.thumbnailLink.replace(/=s\d+/, `=s${size}`);
    }
    
    // Priorita 2: Spolehlivý lh3.googleusercontent.com odkaz
    return `https://lh3.googleusercontent.com/d/${image.id}=s${size}`;
  }

  // Získání několika variant URL pro fallback
  getImageUrls(image: GoogleDriveImage, size: number = 400): { primary: string; fallbacks: string[] } {
    const urls = [];
    
    console.log(`🔗 Generuji URLs pro obrázek ${image.id}:`, {
      thumbnailLink: image.thumbnailLink,
      category: image.category,
      name: image.name
    });
    
    // Priorita 1: Pokud máme thumbnailLink, přidáme ho jako první
    if (image.thumbnailLink && image.thumbnailLink.includes('googleusercontent.com')) {
      const modifiedThumbnail = image.thumbnailLink.replace(/=s\d+/, `=s${size}`);
      urls.push(modifiedThumbnail);
      console.log(`  ✅ Přidán thumbnailLink:`, modifiedThumbnail);
    }
    
    // Priorita 2: drive.google.com/uc URL (často funguje lépe)
    const driveUrl = `https://drive.google.com/uc?id=${image.id}&export=view`;
    urls.push(driveUrl);
    console.log(`  ✅ Přidán drive URL:`, driveUrl);
    
    // Priorita 3: lh3.googleusercontent.com variantu
    const lh3Url = `https://lh3.googleusercontent.com/d/${image.id}=s${size}`;
    urls.push(lh3Url);
    console.log(`  ✅ Přidán lh3 URL:`, lh3Url);
    
    // Priorita 4: Další lh3 varianty s různými velikostmi
    if (size > 400) {
      urls.push(`https://lh3.googleusercontent.com/d/${image.id}=s400`);
      console.log(`  ✅ Přidán lh3 URL s menší velikostí`);
    }
    
    // Priorita 5: docs.google.com variantu
    const docsUrl = `https://docs.google.com/uc?id=${image.id}&export=download`;
    urls.push(docsUrl);
    console.log(`  ✅ Přidán docs URL:`, docsUrl);
    
    const result = {
      primary: urls[0],
      fallbacks: urls.slice(1)
    };
    
    console.log(`  🎯 Finální URLs:`, result);
    
    return result;
  }
}

// Export singleton instance
export const serviceAccountGoogleDriveApi = new ServiceAccountGoogleDriveApi();
