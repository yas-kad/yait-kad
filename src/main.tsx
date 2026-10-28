import {StrictMode} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './editorial.css';
import './portfolio-sections.css';

const root = document.getElementById('root')!;
const app = <StrictMode><App /></StrictMode>;
// Known routes are prerendered at build time (scripts/route-pages.ts); 404.html ships an empty root.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
