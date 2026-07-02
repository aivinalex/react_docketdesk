# React Docket Desk

React Docket Desk is a web application for searching advocates and retrieving cause lists from the Kerala High Court website. The project combines a React/Vite frontend with a Node.js Fastify backend to make court data lookup faster and easier.

## Features

- Search advocates by name
- Select multiple advocates at once
- Fetch cause lists for a chosen date
- View and download results in document-friendly formats
- Use a responsive UI built with React and Tailwind CSS

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS

### Backend
- Node.js
- Fastify
- Cheerio for HTML parsing
- pdfmake and docx for document generation

## Project Structure

```text
react_docket/
├── backend/
│   ├── controller/
│   ├── helpers/
│   ├── routes/
│   ├── services/
│   └── server.js
├── frontend/
│   ├── src/
│   └── package.json
├── package.json
└── README.md
```

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/aivinalex/react_docketdesk.git
cd react_docketdesk
```

2. Install dependencies:

```bash
npm install
```

3. Start the app in development mode:

```bash
npm run dev
```

This starts both the backend and the frontend together.

## Available Scripts

- `npm run dev` — start backend and frontend concurrently
- `npm run dev:backend` — start only the backend
- `npm run dev:frontend` — start only the frontend
- `npm run build` — build both frontend and backend

## Development Notes

- The backend API serves the cause-list lookup flow.
- The frontend uses React components under the `frontend/src` directory.
- The app depends on court website scraping and should be used responsibly and within the platform's terms.

## License

ISC
