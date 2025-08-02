# Im Dessert - Cukrářství

Moderní webová stránka pro cukrářství vytvořená v React.js s Bootstrap stylingem.

## Funkce

- **Domovská stránka** - Uvítací sekce s hlavními specialitami
- **O nás** - Informace o cukrárně, historii a filosofii
- **Galerie** - Fotogalerie zákusků a dezertů
- **Kontakt** - Kontaktní formulář a informace

## Technologie

- React.js 18.2
- TypeScript
- React Bootstrap 2.5
- React Router DOM 6.3
- Bootstrap 5.2

## Instalace a spuštění

1. Naklonujte repository

```bash
git clone https://github.com/Joutee/imdessert.git
cd imdessert
```

2. Nainstalujte závislosti

```bash
npm install
```

3. Nastavte environment variables

```bash
cp .env.example .env
```

Upravte `.env` soubor a nastavte své Google Drive API údaje:

```
REACT_APP_GOOGLE_CLIENT_ID=your_client_id_here
REACT_APP_GOOGLE_CLIENT_SECRET=your_client_secret_here
REACT_APP_GOOGLE_REFRESH_TOKEN=your_refresh_token_here
REACT_APP_GOOGLE_ACCESS_TOKEN=your_access_token_here
REACT_APP_GOOGLE_DRIVE_FOLDER_ID=your_google_drive_folder_id_here
```

4. Spusťte vývojový server

```bash
npm start
```

Aplikace se otevře na adrese [http://localhost:3000](http://localhost:3000)

## Dostupné skripty

- `npm start` - Spustí aplikaci ve vývojovém režimu
- `npm run build` - Vytvoří produkční build
- `npm test` - Spustí testy
- `npm run eject` - Odstraní Create React App abstrakcí (nevratné!)

## Struktura projektu

```
src/
  components/
    Home.tsx        # Domovská stránka
    About.tsx       # O nás
    Gallery.tsx     # Galerie
    Contact.tsx     # Kontakt
  App.tsx           # Hlavní aplikace s routingem
  index.tsx         # Entry point
  index.css         # Globální styly
```

## Přizpůsobení

### Změna obrázků

Obrázky v aplikaci používají Unsplash API. Pro produkční použití doporučujeme:

1. Stáhnout obrázky lokálně do `public/images/`
2. Aktualizovat cesty v komponentách

### Kontaktní informace

Upravte kontaktní údaje v `src/components/Contact.tsx`

### Styling

Přizpůsobte barvy a styly v `src/index.css`

## Produkční nasazení

1. Vytvořte produkční build:

```bash
npm run build
```

2. Nahrajte obsah složky `build/` na váš webserver

## Licence

MIT License
