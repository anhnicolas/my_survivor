import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const CoachAssign = ({ clientId, onAssign }) => {
  const { t } = useTranslation();
  const [coaches, setCoaches] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      setError('JWT token missing.');
      return;
    }

    const fetchCoaches = async () => {
      try {
        const res = await fetch('https://survivor-api.poulpitos.fr/api/employees?work=Coach', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setCoaches(data);
        } else {
          const errorData = await res.json();
          setError(`Failed to fetch coaches: ${errorData.error}`);
        }
      } catch (err) {
        setError('An unexpected error occurred.');
      }
    };

    fetchCoaches();
  }, []);

  const handleAssignCoach = async () => {
    if (!selectedCoach) {
      alert('Please select a coach to assign.');
      return;
    }

    try {
      const res = await fetch(`https://survivor-api.poulpitos.fr/api/customers/${clientId}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify({ coachId: selectedCoach }),
      });

      if (res.ok) {
        onAssign();
        alert('Coach assigned successfully.');
      } else {
        const errorData = await res.json();
        setError(`Failed to assign coach: ${errorData.error}`);
      }
    } catch (err) {
      setError('An error occurred while assigning coach.');
    }
  };

  const selectedCoachInfo = coaches.find(coach => coach._id === selectedCoach);

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}

      <select
        value={selectedCoach}
        onChange={(e) => setSelectedCoach(e.target.value)}
        className="mb-2 w-full px-4 py-2 border rounded"
      >
        <option value="">{t('selectCoach')}</option>
        {coaches.map((coach) => (
          <option key={coach._id} value={coach._id}>
            {coach.name} {coach.surname}
          </option>
        ))}
      </select>

      {selectedCoachInfo && (
        <div className="mt-4 p-4 border border-gray-300 rounded-lg shadow-md flex items-center space-x-4">
          <Image
            src={selectedCoachInfo.image || "https://via.placeholder.com/50"}
            alt={selectedCoachInfo.name}
            className="w-16 h-16 rounded-full"
            width={64}
            height={64}
          />
          <div className="text-left">
            <p className="text-lg font-semibold">{selectedCoachInfo.name} {selectedCoachInfo.surname}</p>
            <p className="text-gray-500">{selectedCoachInfo.work}</p>
            <p className="text-sm text-gray-400">{t('email')}: {selectedCoachInfo.email}</p>
            <p className="text-sm text-gray-400">{t('gender')}: {selectedCoachInfo.gender === 'Male' ? t('male') : selectedCoachInfo.gender === 'Female' ? t('female') : t('other')}</p>
          </div>
        </div>
      )}

      <button
        onClick={handleAssignCoach}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
      >
        {t('assignCoach')}
      </button>
    </div>
  );
};

export default CoachAssign;
