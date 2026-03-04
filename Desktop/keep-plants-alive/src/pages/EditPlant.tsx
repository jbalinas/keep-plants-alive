import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePlantStore } from '../store/PlantContext';
import PlantForm from '../ui/PlantForm';

export default function EditPlant() {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = usePlantStore();
  const navigate = useNavigate();

  const plant = state.plants.find((p) => p.id === id);
  if (!plant) return <p style={{ padding: '2rem' }}>Plant not found. <Link to="/plants">Back to list</Link></p>;

  return (
    <div>
      <h1 style={{ fontWeight: 300, fontSize: '2rem', marginBottom: '2rem' }}>Edit — {plant.name}</h1>
      <PlantForm
        initialValues={plant}
        submitLabel="Save changes"
        onSubmit={(data) => {
          dispatch({ type: 'UPDATE_PLANT', payload: { id: plant.id, ...data } });
          navigate(`/plants/${plant.id}`);
        }}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}
