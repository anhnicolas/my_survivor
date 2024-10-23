"use client";

import { useEffect, useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import Image from 'next/image';
import TableDataPagination from '@/components/TableDataPagination';
import Modal from '@/components/Modal';
const { useTranslation } = require('react-i18next');

const CustomersPage = () => {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState([]);
  const [userName, setUserName] = useState('');
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      setError("Token JWT manquant. Veuillez vous reconnecter.");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const res = await fetch('https://survivor-api.poulpitos.fr/api/employees/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUserName(data.name);
        } else {
          const errorData = await res.json();
          setError(`Erreur de récupération du profil: ${errorData.error}`);
        }
      } catch (err) {
        setError('Une erreur inattendue est survenue lors de la récupération du profil. Veuillez réessayer plus tard.');
      }
    };

    const fetchEmployees = async () => {
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
          setEmployees(data);
        } else {
          const errorData = await res.json();
          setError(`Erreur de récupération des employees: ${errorData.error}`);
        }
      } catch (err) {
        setError('Une erreur inattendue est survenue lors de la récupération des employees. Veuillez réessayer plus tard.');
      }
    };

    fetchUserProfile();
    fetchEmployees();
  }, []);

  const openModal = (client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
  };

  function levenshteinDistance(a, b) {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    return matrix[b.length][a.length];
  }

  function similarityPercentage(a, b) {
      const distance = levenshteinDistance(a, b);
      const maxLength = Math.max(a.length, b.length);
      return ((maxLength - distance) / maxLength) * 100;
  }

  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = employees.filter((client) => {
    let fullName = `${client.name} ${client.surname}`.toLowerCase();
    let search = searchTerm.toLowerCase();
    let name = client.name.toLowerCase();
    let surname = client.surname.toLowerCase();
    if (search === '') {
      return true;
    }

    if (name.length > search.length) {
      name = name.slice(0, search.length);
    }
    if (surname.length > search.length) {
      surname = surname.slice(0, search.length);
    }
    if (fullName.length > search.length) {
      fullName = fullName.slice(0, search.length);
    }
    return similarityPercentage(name, search) > 80 || similarityPercentage(surname, search) > 80 || similarityPercentage(fullName, search) > 80;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentClients = filteredClients.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

    return (
      <AuthGuard>
        <div className="dashboard-page">
          <h3 className="text-gray-700 text-3xl font-medium">{t('Clients')}</h3>
          <div className="main-content">
          </div>
          <div className="mt-8"></div>
          <div className="flex flex-col mt-8">
            <input
              type="text"
              placeholder={t('searchCustomers')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4 px-4 py-2 border rounded"
            />
            <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
              <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">#</th>
                      <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">{t('Nom')}</th>
                      <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">{t('gender')}</th>
                      <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">{t('phoneNbr')}</th>
                      <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">{t('address')}</th>
                      <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">{t('interactions')}</th>
                    </tr>
                  </thead>

                  <tbody className="bg-white">
                    {currentClients.length > 0 ? (
                      currentClients.map((client, index) => (
                        <tr key={client.id}>
                          <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">{startIndex + index + 1}</td>
                          <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-15 w-15">
                                <Image className="h-15 w-15 rounded-full" src={client.image || "https://via.placeholder.com/40"} alt={client.name} width={50} height={50} />
                              </div>

                              <div className="ml-8">
                                <div className="text-sm leading-5 font-medium text-gray-900">{client.name}</div>
                                <div className="text-sm leading-5 text-gray-500">{client.surname}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                            <div className="text-sm leading-5 text-gray-900">
                            {client.gender === 'Male' ? t('male') : client.gender === 'Female' ? t('female') : t('other')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                            <div className="text-sm leading-5 text-gray-900">{client.phoneNumber}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-900">{client.address}</td>
                          <td className="px-6 py-4 whitespace-no-wrap text-center border-b border-gray-200 text-sm leading-5 font-medium">
                            <button onClick={() => openModal(client)} className="text-indigo-600 hover:text-indigo-900 text-3xl">...</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500 text-center">
                          {error ? error : 'Aucun client trouvé.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <TableDataPagination
              currentPage={currentPage}
              totalItems={filteredClients.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
          <Modal isOpen={isModalOpen} onClose={closeModal} client={selectedClient} />
        </div>
      </AuthGuard>
    );
  };

export default CustomersPage;
