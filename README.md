# Eventora Advanced — Event Management Operations Dashboard

An advanced React + Vite frontend-only event management application for creating events, managing registrations, monitoring performance and exporting attendee data.

## Features
- Dashboard overview with registration, revenue, event and occupancy KPIs
- Event CRUD: create, view, edit and delete
- Search and status filtering for events
- Attendee registration and guest directory
- Registration and revenue analytics charts (Recharts)
- CSV export for attendee records
- Browser localStorage persistence
- Responsive sidebar, tables, forms and dashboard
- Form validation and confirmation feedback

## Requirements
- Node.js LTS (npm included)
- VS Code

## Windows setup
1. Extract the ZIP archive.
2. Open the `eventora-advanced` folder in VS Code.
3. Open Terminal → New Terminal.
4. Run:
   ```bash
   node -v
   npm -v
   npm install
   npm run dev
   ```
5. Open the local URL printed by Vite, usually http://localhost:5173.

## Build and preview
```bash
npm run build
npm run preview
```
Vite writes the production site to `dist/`.

## Deploy to Vercel
1. Push the project folder to a GitHub repository.
2. In Vercel select Add New → Project and import that repository.
3. Framework preset: Vite.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Click Deploy.

## Folder structure
```text
eventora-advanced/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── App.jsx
    ├── index.css
    └── main.jsx
```

## Data and limitations
This is frontend-only. Event and attendee data are persisted in the current browser's localStorage. CSV export is generated locally. There is no server, shared database, user authentication, payment processing, real email delivery, WhatsApp messaging, or cross-device sync. Browser storage can be cleared by the user. Use a backend/database and appropriate security before production use.

## Customisation
- Edit `initialEvents` and `initialAttendees` in `src/App.jsx` for sample data.
- Change dashboard theme and responsive styles in `src/index.css`.
- Update the project title and metadata in `index.html`.
