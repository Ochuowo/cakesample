import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';
import { HelmetProvider } from 'react-helmet-async';
import './bootstrap.min.css';
import './index.css';
import CssBaseline from '@material-ui/core/CssBaseline';

ReactDOM.render(
	<Provider store={store}>
		<React.StrictMode>
			<HelmetProvider>
				<BrowserRouter >
					<CssBaseline />
					<App />
				</BrowserRouter>
			</HelmetProvider>
		</React.StrictMode>
	</Provider>,
	document.getElementById('root')
);
