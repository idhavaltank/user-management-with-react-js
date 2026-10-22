import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import App from './App';
import store from './redux/store';
import reportWebVitals from './reportWebVitals';
import NotistackProvider from './utils/NotistackProvider';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('The application root element is missing.');
}

const root = ReactDOM.createRoot(rootElement);

// Wrap App component with Redux store and notistack(use for display toast).
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <NotistackProvider>
        <App />
      </NotistackProvider>
    </Provider>
  </BrowserRouter>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
