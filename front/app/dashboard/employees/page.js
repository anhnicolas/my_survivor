"use client";

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AuthGuard from '../../../components/AuthGuard';
import Image from 'next/image';
import Modal from '../../../components/Modal';
import TableDataPagination from '../../../components/TableDataPagination';

const DashboardPage = () => {
  const { t, i18n } = useTranslation();
  const [employees, setEmployees] = useState([]);
  const [userName, setUserName] = useState('');
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [errorData, setErrorData] = useState(null);
  
  const itemsPerPage = 10;

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

  const deleteEmployee = async (employeeId) => {
    const token = sessionStorage.getItem('token');
    try {
      const res = await fetch(`https://survivor-api.poulpitos.fr/api/employees/${employeeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setIsDeleteModalOpen(false);
      window.location.reload();

  
      catchError(res);
    } catch (err) {
      setError(t('An unexpected error occurred. Please try again later.'));
    }
  };


  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      setError(t('Token JWT manquant. Veuillez vous reconnecter.'));
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
          setError(`${t('Erreur de récupération du profil:')} ${errorData.error}`);
        }
      } catch (err) {
        setError(t('Une erreur inattendue est survenue lors de la récupération du profil. Veuillez réessayer plus tard.'));
      }
    };

    const fetchEmployees = async () => {
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
          setEmployees(data);
        } else {
          const errorData = await res.json();
          setError(`${t('Erreur de récupération des employés:')} ${errorData.error}`);
        }
      } catch (err) {
        setError(t('Une erreur inattendue est survenue lors de la récupération des employés. Veuillez réessayer plus tard.'));
      }
    };

    fetchUserProfile();
    fetchEmployees();
  }, [t]);

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

  const handleAddClient = (client) => {
    setEmployees([...employees, client]);
  };

  return (
    <AuthGuard>
      <div className="dashboard-page">
        <div className="flex justify-between items-center">
          <h3 className="text-gray-700 text-3xl font-medium">{t('coaches')}</h3>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setIsAddModalOpen(true)}
          >
            {t('Add')}
          </button>
        </div>
        <div className="mt-8"></div>
        <div className="flex flex-col mt-8">
          <input
            type="text"
            placeholder={t('Rechercher des employés...')}
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
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">{t('name')}</th>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">{t('Gender')}</th>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">{t('birthdate')}</th>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
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
                          <div className="text-sm leading-5 text-gray-900">{formatBirthDate(client.birthDate)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                          <button
                            onClick={() => {
                              setEmployeeToDelete(client._id);
                              setIsDeleteModalOpen(true);
                            }}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          >
                            {t('Delete')}
                        </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500 text-center">
                        {error ? error : t('No employee found.')}
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
      </div>
      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddClient}
      />
      <DeleteClientModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={() => deleteEmployee(employeeToDelete)}
        />
    </AuthGuard>
  );
};

const AddClientModal = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [work, setWork] = useState('');
  const [gender, setGender] = useState('');
  const [image, setImage] = useState(null);
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');


  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, surname, birthDate, image });
    onClose();
  };

  if (!isOpen) return null;
  const putEmployees = async (formData) => {
    const token = sessionStorage.getItem('token');
    try {
      const res = await fetch('https://survivor-api.poulpitos.fr/api/employees/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
        setResponseMessage('Employee added successfully!');
      } else {
        const errorData = await res.json();
        setResponseMessage(`Error: ${errorData.error}`);
      }
    } catch (err) {
      setResponseMessage('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full text-center">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Ajouter un client</h3>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 focus:outline-none"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              {t('Name')}
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="surname">
            {t('Surname')}
            </label>
            <input
              type="text"
              id="surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="birthDate">
              {t('Birth Date')}
            </label>
            <input
              type="date"
              id="birthDate"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
              {t('Image')}
            </label>
            <input
              type="file"
              id="image"
              onChange={(e) => setImage(e.target.files[0])}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="work">
              {t('Work')}
            </label>
            <input
              type="text"
              id="work"
              onChange={(e) => setWork(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="work">
              {t('Gender')}
            </label>
            <input
              type="text"
              id="gender"
              onChange={(e) => setGender(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            </div>
            <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              {t('Password')}
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

            <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="work">
              {t('Email')}
            </label>
            <input
              type="text"
              id="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <button
              type="button"
              onClick={() => {
                const formData = new FormData();
                formData.append('name', name);
                formData.append('surname', surname);
                formData.append('birthDate', birthDate);
                formData.append('image', image);
                formData.append('work', work);
                formData.append('email', email);
                formData.append('password', password);
                formData.append('gender', gender);

                putEmployees(formData);
                onClose();
              }}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 m-5 rounded focus:outline-none focus:shadow-outline"
            >
              {t('Add')}
            </button>
            <button
            >
              {t('Cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteClientModal = ({ isOpen, onClose, onDelete }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full text-center">
        <h3 className="text-2xl font-bold mb-4">{t('Are you sure you want to delete this employee')} ?</h3>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {t('Yes')}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {t('No')}
          </button>
        </div>
      </div>
    </div>
  );
};



export default DashboardPage;