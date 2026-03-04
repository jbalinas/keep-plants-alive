import { Routes, Route } from 'react-router-dom';
import { PlantProvider } from './store/PlantContext';
import Nav from './ui/components/Nav';
import Dashboard from './pages/Dashboard';
import PlantList from './pages/PlantList';
import PlantDetail from './pages/PlantDetail';
import EditPlant from './pages/EditPlant';
import AddPlant from './pages/AddPlant';
import styles from './App.module.css';

export default function App() {
  return (
    <PlantProvider>
      <div className={styles.layout}>
        <Nav />
        <main className={styles.main} id="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/plants" element={<PlantList />} />
            <Route path="/plants/:id" element={<PlantDetail />} />
            <Route path="/plants/:id/edit" element={<EditPlant />} />
            <Route path="/add" element={<AddPlant />} />
          </Routes>
        </main>
      </div>
    </PlantProvider>
  );
}
