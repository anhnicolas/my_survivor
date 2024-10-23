"use client";

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Carousel from '@/components/Carousel';
import ValidateButton from '@/components/ValidateButton';
import AuthGuard from '../../../components/AuthGuard';
import Image from 'next/image';
import TableDataPagination from '@/components/TableDataPagination';

const Closet = () => {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const formatBirthDate = (birthDate) => {
    if (!birthDate)
        return 'N/A';  // Handle missing or undefined birthdate

    const date = new Date(birthDate);
    if (isNaN(date))
        return 'N/A';  // Handle invalid dates

    // Extract day, month, and year and format in DD/MM/YYYY
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');  // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchCustomers = async () => {
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
          setCustomers(data);
        } else {
          const errorData = await res.json();
          setError(`${t('Erreur de récupération des clients:')} ${errorData.error}`);
        }
      } catch (err) {
        setError(t('Une erreur inattendue est survenue lors de la récupération des clients. Veuillez réessayer plus tard.'));
      }
    };

    fetchCustomers();
  }, [t]);

  const handleCustomerSelection = (customer) => {
    setSelectedCustomer((prevSelected) => (prevSelected === customer ? null : customer));
  };

  const handleValidation = () => {
    if (selectedCustomer) {
      const customerClothes = selectedCustomer.clothes || [];
      if (customerClothes.length === 0) {
        setError(t('Aucun vêtement trouvé pour ce client.'));
      } else {
        setError(null);
      }
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCustomers = customers.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const groupedClothes = (selectedCustomer?.clothes || []).reduce((acc, item) => {
    acc[item.type] = acc[item.type] ? [...acc[item.type], item] : [item];
    return acc;
  }, {});

  return (
    <AuthGuard>
      <div className="dashboard-page">
        <h3 className="text-gray-700 text-3xl font-medium">{t('Garde robe')}</h3>
        <div className="main-content">
          <p className="text-gray-700 text-lg">
            {t('Veuillez sélectionner un client pour voir sa garde-robe.')}
          </p>
        </div>
        <div className="flex flex-col mt-8 gap-8">
          <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">{t('name')}</th>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">{t('gender')}</th>
                    <th className="px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">{t('birthday')}</th>
                    <th className="px-6 py-3 border-b border-gray-200 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">{t('select')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentCustomers.map((customer, index) => (
                    <tr key={customer._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 text-gray-500">{startIndex + index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 text-gray-900">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-15 w-15">
                            <Image 
                              className="h-15 w-15 rounded-full" 
                              width={50} 
                              height={50} 
                              src={customer.image || "https://via.placeholder.com/40"} 
                              alt={customer.name} 
                            />
                          </div>
                          <div className="ml-8">
                            <div className="text-sm leading-5 font-medium text-gray-900">{customer.name}</div>
                            <div className="text-sm leading-5 text-gray-500">{customer.surname}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                        <div className="text-sm leading-5 text-gray-900">
                          {customer.gender === 'Male' ? t('male') : customer.gender === 'Female' ? t('female') : t('other')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 text-gray-900">{formatBirthDate(customer.birthDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 text-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-indigo-600"
                          checked={selectedCustomer === customer}
                          onChange={() => handleCustomerSelection(customer)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <TableDataPagination
            currentPage={currentPage}
            totalItems={customers.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
          {selectedCustomer && (
            <div className="mt-8 gap-8 w-full flex flex-col justify-center items-center">
              {Object.entries(groupedClothes).map(([type, clothes]) => (
                <Carousel key={type} title={t(type)} clothes={clothes} />
              ))}
            </div>
          )}
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </AuthGuard>
  );
};

export default Closet;
