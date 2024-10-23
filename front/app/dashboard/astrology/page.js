"use client";

import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import AstrologicalTable from "@/components/AstrologicalTable";
import ValidateButton from "@/components/ValidateButton";
import AuthGuard from '@/components/AuthGuard';
import dynamic from 'next/dynamic';

const AstrologicalCompatibility = () => {
  const { t } = useTranslation();
  const [clients, setClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [compatibilityResult, setCompatibilityResult] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);  // State to control modal visibility
  const modalRef = useRef(null);  // Ref to track the modal box

  useEffect(() => {
    const fetchClients = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        setError(t('Token JWT manquant. Veuillez vous reconnecter.'));
        return;
      }

      try {
        const res = await fetch('https://survivor-api.poulpitos.fr/api/customers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setClients(data);
        } else {
          const errorData = await res.json();
          setError(`${t('Erreur de récupération des clients:')} ${errorData.error}`);
        }
      } catch (err) {
        setError(t('Une erreur inattendue est survenue lors de la récupération des clients. Veuillez réessayer plus tard.'));
      }
    };

    fetchClients();
  }, [t]);

  const handleSelectClient = (selectedClients) => {
    setSelectedClients(selectedClients);
  };

  const handleValidate = async () => {
    if (selectedClients.length !== 2) {
      alert(t("Veuillez sélectionner deux clients."));
      return;
    }

    const [firstClient, secondClient] = selectedClients;

    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        setError(t("Token JWT manquant. Veuillez vous reconnecter."));
        return;
      }

      const res = await fetch(`https://survivor-api.poulpitos.fr/api/astro/compatibility/${firstClient._id}/${secondClient._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setCompatibilityResult(data.compatibility);
        setIsModalOpen(true); // Open the modal when compatibility result is received
      } else {
        const errorData = await res.json();
        setError(`${t('Erreur de compatibilité:')} ${errorData.error}`);
      }
    } catch (err) {
      setError(t('Une erreur inattendue est survenue lors de la vérification de compatibilité. Veuillez réessayer plus tard.'));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCompatibilityResult(null); // Reset the result when closing the modal
  };

  // Detect clicks outside the modal to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  // Get modal style and icon based on compatibility result
  const getModalStyle = (compatibility) => {
    if (compatibility > 85) {
      return { bgColor: 'bg-pink-500', icon: '❤️', textColor: 'text-white' };
    } else if (compatibility >= 70 && compatibility <= 84) {
      return { bgColor: 'bg-green-500', icon: '😊', textColor: 'text-white' };
    } else if (compatibility >= 50 && compatibility <= 69) {
      return { bgColor: 'bg-yellow-500', icon: '😎', textColor: 'text-black' };
    } else if (compatibility >= 25 && compatibility < 50) {
      return { bgColor: 'bg-orange-500', icon: '😕', textColor: 'text-white' };
    } else {
      return { bgColor: 'bg-red-500', icon: '💔', textColor: 'text-white' };
    }
  };

  return (
    <AuthGuard>
      <div className="dashboard-page relative">
        <h3 className="text-gray-700 text-3xl font-medium">{t('astrologicalCompatibility')}</h3>
        <div className="mt-8"></div>
        <div className="flex flex-col mt-8">
          <AstrologicalTable clients={clients} onClientSelect={handleSelectClient} />
          <ValidateButton onValidate={handleValidate} />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Modal for compatibility result */}
        {isModalOpen && compatibilityResult !== null && (
          <div>
            {/* Overlay/Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>

            {/* Modal Box */}
            <div className="fixed inset-0 flex items-center justify-center z-50">
              {/* Modal box with ref */}
              {(() => {
                const { bgColor, icon, textColor } = getModalStyle(compatibilityResult);
                return (
                  <div ref={modalRef} className={`${bgColor} ${textColor} rounded-lg shadow-lg p-6 max-w-md mx-auto`}>
                    <h3 className="text-lg font-bold mb-4">{t('Résultat de Compatibilité')}</h3>
                    <div className="flex items-center justify-center">
                      <span className="text-5xl">{icon}</span>
                      <p className="ml-4 text-3xl">{`${compatibilityResult}%`}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
};

export default dynamic(() => Promise.resolve(AstrologicalCompatibility), { ssr: false });
