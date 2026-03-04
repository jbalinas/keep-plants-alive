import { useNavigate } from 'react-router-dom';
import { usePlantStore } from '../store/PlantContext';
import PlantForm from '../ui/PlantForm';

export default function AddPlant() {
  const { dispatch } = usePlantStore();
  const navigate = useNavigate();

  return (
    <div>
      <h1 style={{ fontWeight: 300, fontSize: '2rem', marginBottom: '2rem' }}>Add a plant</h1>
      <PlantForm
        submitLabel="Add plant"
        onSubmit={(data) => {
          dispatch({ type: 'ADD_PLANT', payload: data });
          navigate('/plants');
        }}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}
