"use client";

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const PieChart = dynamic(() => import('@/components/Charts/PieChart'), { ssr: false });
const LineChart = dynamic(() => import('@/components/Charts/LineChart'), { ssr: false });
const BarChart = dynamic(() => import('@/components/Charts/BarChart'), { ssr: false });
import AuthGuard from '../../components/AuthGuard';

const Statistics = () => {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pieChartData, setPieChartData] = useState({ series: [], labels: [] });
    const [lineChartData, setLineChartData] = useState([{ name: '', data: [] }]);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [totalCoaches, setTotalCoaches] = useState(0);
    const [totalEvents, setTotalEvents] = useState(0);
    const [coaches, setCoaches] = useState([]);
    const [events, setEvents] = useState([]);
    const [selectedCoach, setSelectedCoach] = useState(null);
    const [selectedCoachStats, setSelectedCoachStats] = useState(null);
    const [selectedCoachCustomers, setSelectedCoachCustomers] = useState([]);
    const [selectedCoachEncounters, setSelectedCoachEncounters] = useState([]);
  
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) {
                    setError(t("missingToken"));
                    return;
                }

                const [customersResponse, coachesResponse, eventsResponse] = await Promise.all([
                    fetch('https://survivor-api.poulpitos.fr/api/customers', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch('https://survivor-api.poulpitos.fr/api/employees?work=Coach', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch('https://survivor-api.poulpitos.fr/api/events', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                if (!customersResponse.ok || !coachesResponse.ok || !eventsResponse.ok) {
                    throw new Error(t('apiError'));
                }

                const customersData = await customersResponse.json();
                const coachesData = await coachesResponse.json();
                const eventsData = await eventsResponse.json();

                setCoaches(coachesData);
                setEvents(eventsData);

                setTotalCustomers(customersData.length);
                setTotalCoaches(coachesData.length);
                setTotalEvents(eventsData.length);

                setLoading(false);
            } catch (error) {
                console.error("Erreur de récupération des données:", error);
                setError(t('fetchDataError'));
                setLoading(false);
            }
        };

        fetchData();
    }, [t]);

    const fetchCustomersByCoach = async (idCoach) => {
      console.log('Fetching customers for coach:', idCoach);
        const token = sessionStorage.getItem('token');
        try {
            const response = await fetch('https://survivor-api.poulpitos.fr/api/customers', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch customers');
            }
    
            const customers = await response.json();
            const filteredCustomers = customers.filter(customer => customer.idCoach == idCoach);
            setSelectedCoachCustomers(filteredCustomers);
            return filteredCustomers;
        } catch (error) {
            console.error('Error fetching customers:', error);
            return [];
        }
    };

    const fetchEncountersByCoach = async (idCoach, customers) => {
        const token = sessionStorage.getItem('token');
        const encounters = [];
        for (const customer of customers) {
            try {
                const response = await fetch(`https://survivor-api.poulpitos.fr/api/encounters?customerId=${customer._id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch encounters');
                }

                const customerEncounters = await response.json();
                console.log('Customer Encounters:', customerEncounters);
                encounters.push(...customerEncounters);
            }  catch (error) {
            console.error('Error fetching encounters:', error);
            return [    ];
        }
    }
        return encounters;
    };

        

    // const fetchAllPaymentsSortedByCoach = async () => {
    //     const token = sessionStorage.getItem('token');
    //     try {
    //         const response = await fetch('https://survivor-api.poulpitos.fr/api/payments', {
    //             headers: { 'Authorization': `Bearer ${token}` }
    //         });

    //         if (!response.ok) {
    //             throw new Error('Failed to fetch payments');
    //         }

    //         const payments = await response.json();
    //         const paymentsByCoach = {};
    //         payments.forEach(payment => {
    //             if (!paymentsByCoach[payment.idCoach]) {
    //                 paymentsByCoach[payment.idCoach] = [];
    //             }
    //             paymentsByCoach[payment.idCoach].push(payment);
    //         });
    //     }

    //         return paymentsByCoach;
    //     }
        

        

    const handleCoachChange = async (event) => {
        const selectedCoachId = event.target.value;
        // Utilisez selectedCoachId comme paramètre
        const employeesId = selectedCoachId;
        setSelectedCoach(selectedCoachId);
    
        try {
            const token = sessionStorage.getItem('token');
            const coachStatsResponse = await fetch(`https://survivor-api.poulpitos.fr/api/employees/${employeesId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
    
            if (!coachStatsResponse.ok) {
                throw new Error(t('apiError'));
            }
    
            const coachStatsData = await coachStatsResponse.json();
            setSelectedCoachStats(coachStatsData);
    
            updateCoachCharts(coachStatsData);
    
        } catch (error) {
            console.error("Erreur de récupération des données du coach:", error);
            setError(t('fetchDataError'));
        }
    };
    

    const updateCoachCharts = async (coachStats) => {
      try {
        const voidData = { name: '', data: [] };
        setSelectedCoachEncounters([]);
        setLineChartData([voidData]);
        const CoachCustomers = await fetchCustomersByCoach(coachStats._id);
        const customerCountBySign = calculateCustomerCountBySign(CoachCustomers);
        setPieChartData(customerCountBySign);

        const encounters = await fetchEncountersByCoach(coachStats._id, CoachCustomers);
        const templineChartData = [
            {
                name: t("coachingEvolution"),
                data: encounters
            }
        ];
        setLineChartData(templineChartData);
        console.log('Line Chart Data:', templineChartData);
    } catch (error) {
        console.error('Error updating coach data:', error);
    }
    };
    

    const calculateCustomerCountBySign = (customers) => {
        const counts = {
            Leo: 0, Gemini: 0, Scorpio: 0, Aquarius: 0,
            Taurus: 0, Cancer: 0, Capricorn: 0, Pisces: 0,
            Aries: 0, Libra: 0, Virgo: 0, Sagittarius: 0
        };
        customers.forEach(customer => {
            const translatedSign = customer.astrologicalSign;
            if (counts[translatedSign] !== undefined) {
                counts[translatedSign]++;
            }
        });

        return {
            series: Object.values(counts),
            labels: Object.keys(counts)
        };
    };

    if (loading) {
        return <div>{t('loading')}</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }


    return (
        <AuthGuard>
            <div className="flex flex-wrap -mx-6">
                <div className="w-full px-6 sm:w-1/2 xl:w-1/3">
                    <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-white">
                        <div className="p-3 rounded-full bg-indigo-600 bg-opacity-75">
                            <svg className="h-8 w-8 text-white" viewBox="0 0 28 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.2 9.08889C18.2 11.5373 16.3196 13.5222 14 13.5222C11.6804 13.5222 9.79999 11.5373 9.79999 9.08889C9.79999 6.64043 11.6804 4.65556 14 4.65556C16.3196 4.65556 18.2 6.64043 18.2 9.08889Z" fill="currentColor"/>
                                <path d="M25.2 12.0444C25.2 13.6768 23.9464 15 22.4 15C20.8536 15 19.6 13.6768 19.6 12.0444C19.6 10.4121 20.8536 9.08889 22.4 9.08889C23.9464 9.08889 25.2 10.4121 25.2 12.0444Z" fill="currentColor"/>
                                <path d="M19.6 22.3889C19.6 19.1243 17.0927 16.4778 14 16.4778C10.9072 16.4778 8.39999 19.1243 8.39999 22.3889V26.8222H19.6V22.3889Z" fill="currentColor"/>
                                <path d="M8.39999 12.0444C8.39999 13.6768 7.14639 15 5.59999 15C4.05359 15 2.79999 13.6768 2.79999 12.0444C2.79999 10.4121 4.05359 9.08889 5.59999 9.08889C7.14639 9.08889 8.39999 10.4121 8.39999 12.0444Z" fill="currentColor"/>
                                <path d="M22.4 26.8222V22.3889C22.4 20.8312 22.0195 19.3671 21.351 18.0949C21.6863 18.0039 22.0378 17.9556 22.4 17.9556C24.7197 17.9556 26.6 19.9404 26.6 22.3889V26.8222H22.4Z" fill="currentColor"/>
                                <path d="M6.64896 18.0949C5.98058 19.3671 5.59999 20.8312 5.59999 22.3889V26.8222H1.39999V22.3889C1.39999 19.9404 3.2804 17.9556 5.59999 17.9556C5.96219 17.9556 6.31367 18.0039 6.64896 18.0949Z" fill="currentColor"/>
                            </svg>
                        </div>

                        <div className="mx-5">
                            <h4 className="text-2xl font-semibold text-gray-700">{totalCustomers}</h4>
                            <div className="text-gray-500">{t('Clients')}</div>
                        </div>
                    </div>
                    </div>
                    <div className="w-full mt-6 px-6 sm:w-1/2 xl:w-1/3 sm:mt-0">
                    <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-white">
                        <div className="p-3 rounded-full bg-orange-600 bg-opacity-75">
                            <svg className="h-8 w-8 text-white" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.19999 1.4C3.4268 1.4 2.79999 2.02681 2.79999 2.8C2.79999 3.57319 3.4268 4.2 4.19999 4.2H5.9069L6.33468 5.91114C6.33917 5.93092 6.34409 5.95055 6.34941 5.97001L8.24953 13.5705L6.99992 14.8201C5.23602 16.584 6.48528 19.6 8.97981 19.6H21C21.7731 19.6 22.4 18.9732 22.4 18.2C22.4 17.4268 21.7731 16.8 21 16.8H8.97983L10.3798 15.4H19.6C20.1303 15.4 20.615 15.1004 20.8521 14.6261L25.0521 6.22609C25.2691 5.79212 25.246 5.27673 24.991 4.86398C24.7357 4.45123 24.2852 4.2 23.8 4.2H8.79308L8.35818 2.46044C8.20238 1.83722 7.64241 1.4 6.99999 1.4H4.19999Z" fill="currentColor"/>
                                <path d="M22.4 23.1C22.4 24.2598 21.4598 25.2 20.3 25.2C19.1403 25.2 18.2 24.2598 18.2 23.1C18.2 21.9402 19.1403 21 20.3 21C21.4598 21 22.4 21.9402 22.4 23.1Z" fill="currentColor"/>
                                <path d="M9.1 25.2C10.2598 25.2 11.2 24.2598 11.2 23.1C11.2 21.9402 10.2598 21 9.1 21C7.9402 21 7 21.9402 7 23.1C7 24.2598 7.9402 25.2 9.1 25.2Z" fill="currentColor"/>
                            </svg>
                        </div>

                        <div className="mx-5">
                            <h4 className="text-2xl font-semibold text-gray-700">{totalEvents}</h4>
                            <div className="text-gray-500">{t('Événements')}</div>
                        </div>
                    </div>
                </div>

                <div className="w-full mt-6 px-6 sm:w-1/2 xl:w-1/3 xl:mt-0">
                    <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-white">
                        <div className="p-3 rounded-full bg-pink-600 bg-opacity-75">
                            <svg className="h-8 w-8 text-white" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.99998 11.2H21L22.4 23.8H5.59998L6.99998 11.2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                                <path d="M9.79999 8.4C9.79999 6.08041 11.6804 4.2 14 4.2C16.3196 4.2 18.2 6.08041 18.2 8.4V12.6C18.2 14.9197 16.3196 16.8 14 16.8C11.6804 16.8 9.79999 14.9197 9.79999 12.6V8.4Z" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </div>

                        <div className="mx-5">
                            <h4 className="text-2xl font-semibold text-gray-700">{totalCoaches}</h4>
                            <div className="text-gray-500">{t('Coachs')}</div>
                        </div>
                    </div>
                </div>

				<div className="w-full px-6 mb-4">
                    <select
                        onChange={(event) => handleCoachChange(event)}
                        value={selectedCoach || ''}
                        className="border p-2 rounded mt-8"
                    >
                        <option value="">{t('SelectCoach')}</option>
                        {coaches.map(coach => (
                        <option key={coach._id} value={coach._id}>
                            {coach.name} {coach.surname}
                        </option>

                        ))}
                    </select>
                </div>
                <div className="flex flex-wrap justify-center gap-8 mt-2 px-6">
                    <PieChart series={pieChartData.series} labels={pieChartData.labels} />
                    <LineChart series={lineChartData} />
                </div>
            </div>
        </AuthGuard>
    );
};

export default Statistics;
