![Barsonar Frontend](./src/assets/barsonar_frontend.png)

## <span style="color:purple">Tartalomjegyzék</span>
- [Tartalomjegyzék](#tartalomjegyzék)
- [Röviden](#röviden)
- [Stack](#stack)
- [Előfeltételek](#előfeltételek)
- [Telepítés](#telepítés)
  - [1. Klónozás és függőségek telepítése](#1-klónozás-és-függőségek-telepítése)
  - [2. Környezeti változók](#2-környezeti-változók)
- [Fejlesztői futtatás](#fejlesztői-futtatás)
- [Futtatás Dockerben](#futtatás-dockerben)
- [Backend kapcsolat és proxy](#backend-kapcsolat-és-proxy)
- [Elérhető oldalak (route-ok)](#elérhető-oldalak-route-ok)
- [BarSonar AI (Cloudflare Worker)](#barsonar-ai-cloudflare-worker)
- [Scriptek](#scriptek)
- [Tesztelés](#tesztelés)
- [Hozzájárulás](#hozzájárulás)

---

## <span style="color:purple">Röviden</span>

A **BarSonar Frontend** egy React + TypeScript + Vite alapú webalkalmazás. Fejlesztés közben a Vite dev szerver az API hívásokat az `/api` útvonalról a backend felé **proxy-zza**, illetve a projekt tartalmaz egy külön **Cloudflare Worker** alprojektet (`barsonar-ai/`) a valós idejű funkciókhoz (pl. chat).

---

## <span style="color:purple">Stack</span>

![React](https://img.shields.io/badge/React-61DAFB?logo=react\&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript\&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite\&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?logo=bootstrap\&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=reactrouter\&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker\&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest\&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint\&logoColor=white)

---

## <span style="color:purple">Előfeltételek</span>

A projekt futtatásához szükséges:

- **<span style="color:red">Node.js</span>**
- **<span style="color:red">npm</span>**
- **<span style="color: #1D63ED">Docker Desktop</span>** (opcionális), ha Dockerben szeretnéd futtatni
- **<span style="color:red">[BarSonar Backend](https://github.com/jaaajaaaja/VizsgaRemek_Backend)</span>** – a frontend a backend API-t használja, ezért a backendnek futnia kell

---

## <span style="color:purple">Telepítés</span>

#### 1. Klónozás és függőségek telepítése

```bash
# Klónozd a repository-t
git clone <repository-url>

# Lépj be a frontend mappába
cd barsonar-frontend

# Telepítsd a függőségeket (node_modules mappa)
npm install
```

#### 2. Környezeti változók

Nevezd át a projekt gyökerében lévő `.env.example` fájlt `.env`-re és állítsd be a következőképpen:

```env
VITE_API_BASE_URL=/api
VITE_PROXY_TARGET=http://localhost:3000
VITE_WORKER_URL="https://projekt-nev.felhasznalonev.workers.dev"
VITE_GOOGLE_MAPS_API_KEY=Your-Google-Maps-API-Key-Goes-Here
```

**Megjegyzések:**

- `VITE_API_BASE_URL` – az API “base path” a frontendben (fejlesztéskor jellemzően `/api`)
- `VITE_PROXY_TARGET` – a backend címe, ahová a Vite proxy továbbít (alapértelmezett: `http://localhost:3000`)
- `VITE_WORKER_URL` – a Cloudflare Worker URL-je (pl. valós idejű chat)
- `VITE_GOOGLE_MAPS_API_KEY` – Google Maps API kulcs a térképhez/helyadatokhoz

---

## <span style="color:purple">Fejlesztői futtatás</span>

```bash
npm run dev
```

Az alkalmazás alapértelmezetten itt érhető el:
- `http://localhost:5173`

---

## <span style="color:purple">Futtatás Dockerben</span>

Gyors indítás:

```bash
docker compose up --build
```

**Fontos:** a `compose.yaml` a Vite környezeti változókat **build argként** adja át, tehát ezek az értékek a build során “beleégnek” a production bundle-be. Ha változtatni szeretnél rajtuk, futtasd újra a buildet (pl. `docker compose up --build`), vagy módosítsd a `compose.yaml`-t.

További Docker jegyzetek: `README.Docker.md`.

---

## <span style="color:purple">Backend kapcsolat és proxy</span>

- Fejlesztés közben az `/api/*` hívások proxy-zva vannak a `VITE_PROXY_TARGET` felé (lásd `vite.config.ts`).
- A proxy `rewrite`-olja az útvonalat, azaz a backend felé a `/api` prefix lekerül.
- Ha a backend más címen fut, állítsd át a `.env`-ben a `VITE_PROXY_TARGET` értékét.

---

## <span style="color:purple">Elérhető oldalak (route-ok)</span>

A jelenlegi route-ok (`src/App.tsx`) röviden:

- `/` – Home
- `/about` – About
- `/bars` – Bárok listája
- `/bar/:barId` – Bár részletek
- `/recommendations` – Ajánlások
- `/friends` – Ismerősök
- `/settings` – Beállítások
- `/help` – Súgó

---

## <span style="color:purple">BarSonar AI (Cloudflare Worker)</span>

A repo tartalmaz egy külön alprojektet is: `barsonar-ai/` (Wrangler + Cloudflare Worker).

Hasznos parancsok:

```bash
cd barsonar-ai
npm install
wrangler deploy
```

A frontend a Worker URL-t a `VITE_WORKER_URL` változóból olvassa.

---

## <span style="color:purple">Scriptek</span>

Fő frontend (`package.json`):

- `npm run dev` – fejlesztői szerver (Vite)
- `npm run build` – TypeScript build + Vite build
- `npm run preview` – production build előnézet
- `npm run lint` – ESLint
- `npm test` – Vitest (CI-szerű futtatás)

---

## <span style="color:purple">Tesztelés</span>

```bash
npm test
```

---

## <span style="color:purple">Hozzájárulás</span>

**A projekt fejlesztése során kérjük, hogy:**

1. Fork-old a repository-t
2. Hozz létre egy feature branch-et (`git checkout -b feature/uj-funkcio`)
3. Commit-old a változtatásaidat (`git commit -m 'Hozzáadva: új funkció'`)
4. Push-old a branch-et (`git push origin feature/uj-funkcio`)
5. Nyiss egy Pull Request-et

---

**Készítette:** BarSonar fejlesztői csapat  

**Verzió:** 1.0.0

**Utolsó frissítés:** 2026
