import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AppShell from './components/AppShell';

function App() {
  return (
    <Router>
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </AppShell>
    </Router>
  );
}

export default App;
