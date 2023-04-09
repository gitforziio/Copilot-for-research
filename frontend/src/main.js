import React from 'react';
import ReactDOM from 'react-dom/client';
import vNode from './lib/vue-to-react';
import App from './App';
// import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  vNode(React.StrictMode, null, vNode(App)),
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>,
);
