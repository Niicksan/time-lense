
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Home } from './components/Home';
import { LivePreview } from './components/LivePreview';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/live" element={<LivePreview />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App; 