import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const FAVICON_DATA_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'%3E%3Crect width='64' height='64' rx='14' fill='%23121212'/%3E%3Crect x='2' y='2' width='60' height='60' rx='12' stroke='%232a2a2a' stroke-width='1.5'/%3E%3Cpath d='M18 20L11 32L18 44' stroke='%23d4c3a3' stroke-width='3.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M46 20L53 32L46 44' stroke='%23d4c3a3' stroke-width='3.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M25 43V21H34.5C38.6421 21 41.5 23.5817 41.5 27.5C41.5 31.4183 38.6421 34 34.5 34H25' stroke='%23f4efe6' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";

function ensureFavicon(doc: Document) {
  doc.title = 'Panini Linguistics Olympiad (Senior Round 1) | Daksh Wadekar';
  const rels = ['icon', 'shortcut icon'];
  rels.forEach((rel) => {
    let link = doc.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
    if (!link) {
      link = doc.createElement('link');
      link.rel = rel;
      doc.head.appendChild(link);
    }
    link.type = 'image/svg+xml';
    link.href = FAVICON_DATA_URI;
  });
}

ensureFavicon(document);
try {
  if (window.parent && window.parent !== window && window.parent.document) {
    ensureFavicon(window.parent.document);
  }
} catch {
  // Cross-origin parent frame; ignore safely
}

createRoot(document.getElementById('root')!).render(<App />);

