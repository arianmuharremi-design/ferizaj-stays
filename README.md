# Ferizaj Stays

Direct-booking website for three apartments in Ferizaj, Kosovo (Arch Point, Dream Palace, Intercon), in Albanian, German and English.

- **Website:** https://web-production-59708a4e.up.railway.app
- **Host dashboard:** https://web-production-59708a4e.up.railway.app/admin/

## Files

| File | What it is |
|---|---|
| `index.html` | The website: apartments, prices, photos, translations, booking form |
| `admin.html` | Host dashboard: accept/decline requests, block dates, Airbnb sync status |
| `server.js` | Server: serves the pages, syncs Airbnb calendars, stores bookings |
| `config.json` | Apartment names and sync interval (no secrets) |
| `.env` | **Local only, never uploaded.** Dashboard logins and Airbnb calendar links |

## Run it on your computer

```
npm run dev
```

Then open http://localhost:8080.

## Put changes online

Railway is connected to this GitHub repository, so every change pushed to the `main` branch goes live automatically within a couple of minutes.

Secrets (`ADMIN_USERS`, `AIRBNB_ICAL_*`) and the bookings disk (`DATA_DIR=/data`) are set in Railway's service settings, not in this repository.
