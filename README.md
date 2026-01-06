
# Full-Stack Twitter Clone

A high-performance social media application featuring real-time-style interactions, user authentication, and a dynamic feed.


## Quick Start (Local Run)
#### Prerequisites: Node.js v18+, Docker.

### 1. Clone the repo 
```
git clone https://github.com/durazzo2/twitter-clone.git
cd twitter-clone
```
### 2. Setup the backend

```
cd backend
npm install
cp .env.example .env   
docker compose up -d   # must run before prisma
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

### 3. Setup the frontend

```
cd ../frontend
npm install
cp .env.example .env.local
npm run dev
```


## Architecture overview

The system follows a decoupled client–server architecture with clear separation between presentation, business logic, and persistence layers.

The backend is implemented in NestJS using a modular, feature-based structure (Auth, Users, Tweets). Authentication is handled via JWT guards, while interceptors are used for response shaping and cross-cutting concerns. DTOs combined with validation pipes enforce strict input validation and data integrity at the API boundary. Data access is managed through Prisma ORM, with a PostgreSQL database running in Docker to ensure environment consistency across development setups.

The frontend is built with Next.js (App Router) and adopts a hybrid rendering model. Server Components are responsible for initial data fetching and SEO-sensitive content, while Client Components handle interactive features such as the feed, modals, and user actions.

To improve security and avoid direct client-to-backend communication, Next.js Route Handlers act as an API proxy layer. This bridge manages token forwarding, CORS concerns, and request normalization before delegating calls to the NestJS API.

## Technologies used

| Layer    | Technology        | Key Role |
|----------|-------------------|----------|
| Frontend | Next.js 16        | Server-side rendering, routing, and UI framework |
| Styling  | Tailwind CSS 4    | Modern, utility-first CSS for responsive design |
| Backend  | NestJS            | Scalable Node.js framework for the REST API |
| Database | PostgreSQL        | Relational database for structured social data |
| ORM      | Prisma            | Type-safe database client and automated migrations |
| DevOps   | Docker            | Containerization of the database environment |
| Auth     | JWT / Passport    | Secure, stateless user authentication |


