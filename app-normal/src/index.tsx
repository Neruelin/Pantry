import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import './globals.css';

const body = document.body;
const root = document.createElement('div');
body.appendChild(root)
if (root === null) throw new Error("Root div could not be found.");
const reactRoot = ReactDOM.createRoot(root)
reactRoot.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)