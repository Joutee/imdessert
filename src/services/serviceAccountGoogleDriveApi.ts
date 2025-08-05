// Service Account Google Drive API pro trvalou autentizaci (browser compatible)

// Service Account konfigurace z environment variables
const SERVICE_ACCOUNT_EMAIL =
  process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL;
const SERVICE_ACCOUNT_PRIVATE_KEY =
  process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
const MAIN_FOLDER_ID = process.env.REACT_APP_GOOGLE_DRIVE_FOLDER_ID;

// Mapování názvů složek na kategorie
const FOLDER_NAME_MAP: { [key: string]: string } = {
  dorty: "Svatební dorty",
  Dortiky: "Dortíky",
  bary: "Svatební bary",
  Poharky: "Pohárky",
  Tartaletky: "Tartaletky",
  Minidezerty: "Minidezerty",
  odpalovane: "Odpalované větrníčky",
  Ovoce: "Ovoce a tvary",
  Zakusky: "Tradiční zákusky",
};

export interface GoogleDriveImage {
  id: string;
  name: string;
  thumbnailLink: string;
  webViewLink: string;
  webContentLink: string;
  category: string;
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
      const assertion = await this.createJWT();

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
  async getGalleryFolders(): Promise<string[]> {
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

      return folders.map((folder: any) => folder.name);
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

      const mappedCategory = FOLDER_NAME_MAP[folderName] || folderName;

      return files.map((file: any) => ({
        id: file.id,
        name: file.name,
        thumbnailLink: file.thumbnailLink || "",
        webViewLink: file.webViewLink || "",
        webContentLink: file.webContentLink || "",
        category: mappedCategory,
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

      // Nejdříve získáme ID všech složek
      const foldersData = await this.makeApiCall(
        "https://www.googleapis.com/drive/v3/files",
        {
          q: `'${MAIN_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
          fields: "files(id,name)",
        }
      );

      const folders = foldersData.files || [];
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

  // Získání přímého odkazu na obrázek ve vysoké kvalitě
  getHighQualityImageUrl(image: GoogleDriveImage): string {
    return `https://drive.google.com/uc?id=${image.id}&export=view`;
  }

  // Získání odkazu na thumbnail
  getThumbnailUrl(image: GoogleDriveImage, size: number = 400): string {
    if (image.thumbnailLink) {
      return image.thumbnailLink.replace(/=s\d+/, `=s${size}`);
    }
    return this.getHighQualityImageUrl(image);
  }
}

// Export singleton instance
export const serviceAccountGoogleDriveApi = new ServiceAccountGoogleDriveApi();
