import React from 'react';
import ReactDOM from 'react-dom/client'; // react ar component ke conncet korte dom BROWSER sathe 
import './index.css';
import App from './App'; //app.js main component

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


/*
- Finds the <div id="root"></div> inside public/index.html.
- This is the container where your entire React app will be injected. line 6 - 7

- Renders your App component inside the root div.
- React.StrictMode is a wrapper that helps catch potential problems (like deprecated APIs or side effects). It doesn’t affect production, only development warnings.





*/