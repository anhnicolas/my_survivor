"use client";

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TableDataPagination from './TableDataPagination';
import Image from 'next/image';

const AstrologicalTable = ({ clients, onClientSelect }) => {
  const { t } = useTranslation();
  const [selectedClients, setSelectedClients] = useState([]);
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

  const handleCheckboxChange = (client) => {
    let updatedSelection;

    if (selectedClients.includes(client)) {
      updatedSelection = selectedClients.filter((c) => c !== client);
    } else {
      updatedSelection = selectedClients.length < 2 ? [...selectedClients, client] : [selectedClients[1], client];
    }

    setSelectedClients(updatedSelection);

    if (typeof onClientSelect === 'function') {
      onClientSelect(updatedSelection);
    }
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

  const filteredClients = clients.filter((client) => {
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
    <div className="flex flex-col mt-8">
       <input
              type="text"
              placeholder={t('searchCustomers')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4 px-4 py-2 border rounded"
            />
      <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">{t('Nom')}</th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">{t('gender')}</th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">{t('birthdate')}</th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">{t('astrologicalSign')}</th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">{t('select')}</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentClients && currentClients.length > 0 ? (
              currentClients.map((client, index) => (
                <tr key={client.id}>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">{startIndex + index + 1}</td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-15 w-15">
                        <Image className="h-15 w-15 rounded-full" width={50} height={50} src={client.image || "https://via.placeholder.com/40"} alt={client.name} />
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
                    <span className="px-2 inline-flex text-sm leading-5 font-medium">{formatBirthDate(client.birthDate)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-900">{t(client.astrologicalSign)}</td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-900">
                    <div className="flex justify-center items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-gray-600"
                        checked={selectedClients.includes(client)}
                        onChange={() => handleCheckboxChange(client)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 whitespace-no-wrap text-sm text-gray-500 text-center">{t('Aucun client trouvé.')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <TableDataPagination
        currentPage={currentPage}
        totalItems={clients.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default AstrologicalTable;
