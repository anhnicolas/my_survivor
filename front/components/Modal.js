import { useEffect, useState } from 'react';
import Image from 'next/image';
import CoachAssign from '@/components/CoachAssign';
import RecentMeetings from '@/components/RecentMeetings';
import PaymentHistory from '@/components/PaymentHistory';
import AudioNotesTable from '@/components/AudioNotesTable';
import AudioRecorder from '@/components/AudioRecorder';
import { useTranslation } from 'react-i18next';
import BadgeComponent from './Badge';

const Modal = ({ isOpen, onClose, client }) => {
    const { t } = useTranslation();
    const [coach, setCoach] = useState(null);
    const [error, setError] = useState(false);  // Track if the coach retrieval fails

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
        // Reset the coach and error states when a new client is loaded
        setCoach(null);
        setError(false);

        const fetchCoach = async () => {
            if (client && client.idCoach) {  // Check if client and client.idCoach exist
                try {
                    const token = sessionStorage.getItem('token');
                    const res = await fetch(`https://survivor-api.poulpitos.fr/api/employees/${client.idCoach}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (res.ok) {
                        const coachData = await res.json();
                        setCoach(coachData);
                    } else {
                        setError(true);  // Coach retrieval failed
                    }
                } catch (err) {
                    setError(true);  // Error occurred while fetching the coach
                }
            } else {
                setError(true);  // No coach assigned
            }
        };

        fetchCoach();
    }, [client]);  // Only re-run the effect when the client changes

    const handleCoachAssigned = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
            <div className="bg-gray-200 rounded-lg shadow-lg w-full max-w-screen-3xl p-8 overflow-y-auto max-h-screen relative">

                {/* Back Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-8 bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 shadow flex items-center space-x-2 focus:outline-none"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>{t('previous')}</span>
                </button>

                <div className="mt-12 flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-8">
                    {/* Left Column - Client Profile */}
                    <div className="flex-1/2">
                        <div className="bg-white border border-gray-300 p-6 shadow-sm">
                            <div className="text-left">
                                <div className="flex flex-col items-center">
                                    <Image
                                        src={client.image || "https://via.placeholder.com/150"}
                                        alt={client.name}
                                        width={150}
                                        height={150}
                                        className="rounded-full mb-2"
                                    />
                                    <p className="text-xl font-bold mb-2 text-gray-700">{client.name} {client.surname}</p>

                                    <p className="text-gray-600 text-lg text-center mx-4">{client.description || 'N/A'}</p>
                                    {/* Separating Line */}
                                    <hr className="border-t border-gray-300 w-full my-4" />
                                </div>

                                {/* Short Details Section */}
                                <div className="space-y-2 text-sm">
                                    <div>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">ID: </p>
                                        <p className="font-semibold text-gray-600">{client._id || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">{t('phoneNbr')}</p>
                                        <p className="font-semibold text-gray-600">{client.phoneNumber || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">{t('email')}</p>
                                        <p className="font-semibold text-gray-600">{client.email || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">{t('gender')}</p>
                                        <p className="font-semibold text-gray-600">{client.gender === 'Male' ? t('male') : client.gender === 'Female' ? t('female') : t('other')}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">{t('birthdate')}</p>
                                        <p className="font-semibold text-gray-600">{formatBirthDate(client.birthDate)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">{t('address')}</p>
                                        <p className="font-semibold text-gray-600">{client.address || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">{t('assignedCoach')}</p>
                                        <p className="font-semibold text-gray-600">
                                            {coach ? `${coach.name} ${coach.surname}` : (error ? 'N/A' : 'Loading...')}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">{t('astrologicalSign')}</p>
                                        <p className="font-semibold text-gray-600">{t(client.astrologicalSign) || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">{t('badges')}</p>
                                        <BadgeComponent type="cake" client={client} />
                                        <BadgeComponent type="wine" client={client} />
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <CoachAssign clientId={client._id} onAssign={handleCoachAssigned} />
                                </div>
                                <div className="mt-6">
                                    <AudioRecorder clientId={client._id}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Additional Information */}
                    <div className="flex-1 space-y-4">
                        <div className="bg-white border border-gray-300 p-6 shadow-sm">
                            <RecentMeetings clientId={client._id}/>
                        </div>
                        <div className="bg-white border border-gray-300 p-6 shadow-sm">
                            <PaymentHistory clientId={client._id}/>
                        </div>
                        <div className="bg-white border border-gray-300 p-6 shadow-sm">
                            <AudioNotesTable clientId={client._id}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
