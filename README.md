# 🌿 EcoSmart AI
> Sort smart. Earn value. Reduce emissions.

EcoSmart AI helps urban Nigerians make smarter waste decisions by identifying waste, guiding proper disposal, and connecting users to recyclers — enabling them to earn while reducing pollution and climate impact.

---

## 📁 Project Structure

```
ecosmart-ai/
├── frontend/          # Next.js PWA
├── backend/           # Node.js REST API
├── .github/           # CI/CD, PR & issue templates
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB
- Anthropic API key

### Installation

```bash
# Clone the repo
git clone https://github.com/your-org/ecosmart-ai.git
cd ecosmart-ai

# Install frontend deps
cd frontend && npm install

# Install backend deps
cd ../backend && npm install
```

### Running locally

```bash
# Terminal 1 — Backend
cd backend && npm run dev     # runs on :5000

# Terminal 2 — Frontend
cd frontend && npm run dev    # runs on :3000
```

## 🌿 Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | Next.js 14, TypeScript  |
| Backend   | Node.js, Express        |
| Database  | MongoDB                 |
| AI        | Anthropic Claude API    |
| Auth      | JWT                     |
| Deploy    | Vercel (FE) + Railway (BE) |

## 👥 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) and the GitHub workflow below.

### Branch Strategy
- `main` — production-ready only
- `develop` — integration branch
- `feature/<name>` — new features
- `fix/<name>` — bug fixes

## 📄 License
MIT © Evergreen Team 02 — 2026
