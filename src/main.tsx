import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import { PrintResume } from './app/components/PrintResume';
import './styles/fonts.css';

// `?print` renders the decoupled print-only layout used to generate
// public/resume.pdf — kept out of the normal user-facing flow.
const isPrint =
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('print');

createRoot(document.getElementById('root')!).render(
  <StrictMode>{isPrint ? <PrintResume /> : <App />}</StrictMode>,
);
