import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Poets from './pages/Poets';
import SingleEntry from './pages/SingleEntry';

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout theme={theme} onToggleTheme={toggleTheme} />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/poets" element={<Poets />} />
            <Route path="/entry/:id" element={<SingleEntry />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
