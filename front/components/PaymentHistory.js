"use client";

import { useEffect, useState } from 'react';
const { useTranslation } = require('react-i18next');

const PaymentMethodIcon = ({ method }) => {
    switch (method) {
        case 'Bank Transfer':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512">
                    <path d="M256 59.55c108.5 0 196.45 87.96 196.45 196.45S364.5 452.45 256 452.45c-108.49 0-196.45-87.96-196.45-196.45S147.51 59.55 256 59.55zM256 0c70.68 0 134.69 28.66 181.02 74.98C483.34 121.31 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.7 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.68 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm163.28 92.72C377.49 50.94 319.76 25.09 256 25.09c-63.77 0-121.5 25.85-163.28 67.63C50.94 134.5 25.09 192.23 25.09 256c0 63.76 25.85 121.49 67.63 163.28 41.78 41.78 99.51 67.63 163.28 67.63 63.77 0 121.5-25.85 163.28-67.63 41.78-41.78 67.63-99.51 67.63-163.28 0-63.77-25.85-121.5-67.63-163.28zM286.15 218.77c-.59-6.7-3.28-11.86-8.06-15.61-3.31-2.59-7.63-4.29-12.92-5.08v38.85l9.64 2.18c9.17 2.01 17.31 4.65 24.39 7.98 7.04 3.33 12.97 7.33 17.79 11.94 4.82 4.56 8.48 9.89 10.95 15.87 2.48 6.01 3.76 12.75 3.84 20.16-.08 11.77-3.06 21.84-8.91 30.28-5.88 8.41-14.33 14.89-25.33 19.37-9.18 3.75-19.98 5.92-32.37 6.52v21.07h-14.93v-21.08c-12.43-.64-23.48-2.9-33.13-6.81-11.6-4.65-20.6-11.73-27-21.24-6.44-9.51-9.72-21.54-9.9-36.08h43.08c.34 5.97 1.96 11 4.77 14.97 2.86 4.01 6.79 7.04 11.77 9.08 3.17 1.32 6.64 2.21 10.41 2.69v-41l-13.35-3.1c-16.11-3.7-28.78-9.68-38.08-17.95-9.26-8.27-13.86-19.45-13.82-33.57-.04-11.51 3.07-21.62 9.3-30.28 6.23-8.65 14.84-15.39 25.89-20.25 9.01-3.94 19.02-6.28 30.06-7.01V139.7h14.93v20.94c11.39.69 21.49 3.06 30.28 7.08 10.66 4.9 18.89 11.73 24.78 20.51 5.89 8.79 8.87 18.94 9 30.54h-43.08zm-35.91-20.69c-2.6.38-4.93.96-6.99 1.75-3.88 1.54-6.78 3.63-8.7 6.23-1.96 2.64-2.94 5.67-3.03 9.04-.09 2.82.47 5.25 1.71 7.38 1.23 2.13 3.07 3.97 5.45 5.58 2.4 1.63 5.3 3.03 8.66 4.23.94.33 1.91.65 2.9.95v-35.16zm14.93 115.64c2.77-.41 5.3-1.05 7.59-1.94 4.26-1.62 7.55-3.88 9.85-6.78 2.31-2.94 3.5-6.27 3.54-10.02-.04-3.5-1.15-6.52-3.28-9.04-2.13-2.52-5.38-4.69-9.77-6.53-2.31-.98-4.96-1.92-7.93-2.82v37.13z"/>
                </svg>
            );
        case 'Credit Card':
            return (
               <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 385.414"><path fill="#3B95D9" fill-rule="nonzero" d="M26.217 0h382.258c14.366 0 26.16 11.803 26.16 26.158V264.76c0 14.364-11.796 26.16-26.16 26.16H26.217c-14.384 0-26.16-11.776-26.16-26.16V26.158C.057 11.798 11.859 0 26.217 0z"/>
                    <path fill="#42A6F1" d="M26.216 7.674h382.26c10.166 0 18.484 8.356 18.484 18.484v238.603c0 10.128-8.356 18.483-18.484 18.483H26.216c-10.128 0-18.483-8.317-18.483-18.483V26.158c0-10.166 8.317-18.484 18.483-18.484z"/><path fill="#4D5471" d="M0 56.192h434.691v74.811H0z"/><path fill="#D54C3D" fill-rule="nonzero" d="M103.585 94.494H485.84c7.197 0 13.737 2.948 18.471 7.682l.47.515c4.467 4.71 7.219 11.051 7.219 17.961v238.602c0 14.364-11.796 26.16-26.16 26.16H103.585c-14.383 0-26.16-11.777-26.16-26.16V120.652c0-7.167 2.939-13.697 7.679-18.449l.049-.048c4.749-4.728 11.273-7.661 18.432-7.661z"/><path fill="#ED5444" d="M103.585 102.168H485.84c10.167 0 18.484 8.356 18.484 18.484v238.602c0 10.128-8.356 18.484-18.484 18.484H103.585c-10.128 0-18.484-8.317-18.484-18.484V120.652c0-10.167 8.317-18.484 18.484-18.484z"/><path fill="#F8D14A" fill-rule="nonzero" d="M126.406 283.827a8.33 8.33 0 110-16.661h167.77a8.33 8.33 0 010 16.661h-167.77zm242.263-26.394c12.433 0 23.464 5.995 30.363 15.254 6.9-9.259 17.932-15.254 30.367-15.254 20.9 0 37.845 16.944 37.845 37.844 0 20.902-16.945 37.846-37.845 37.846-12.435 0-23.467-5.997-30.367-15.256-6.899 9.259-17.93 15.256-30.363 15.256-20.903 0-37.846-16.944-37.846-37.846 0-20.9 16.943-37.844 37.846-37.844zm-242.263 65.959a8.331 8.331 0 010-16.661h126.509a8.332 8.332 0 010 16.661H126.406z"/><path fill="#DACD71" d="M139.602 153.639h56.914c7.258 0 13.197 5.939 13.197 13.197v2.883h-83.307v-2.883c0-7.258 5.938-13.197 13.196-13.197zm70.111 20.621v28.134h-25.844V174.26h25.844zm-30.384 28.134h-22.568V174.26h22.568v28.134zm-27.109 0h-25.814V174.26h25.814v28.134zm57.493 4.541v2.928c0 7.257-5.94 13.196-13.197 13.196h-56.914c-7.257 0-13.196-5.938-13.196-13.196v-2.928h83.307z"/>
               </svg>
            );
        case 'PayPal':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 48 48">
                    <path fill="#1565C0" d="M18.7,13.767l0.005,0.002C18.809,13.326,19.187,13,19.66,13h13.472c0.017,0,0.034-0.007,0.051-0.006C32.896,8.215,28.887,6,25.35,6H11.878c-0.474,0-0.852,0.335-0.955,0.777l-0.005-0.002L5.029,33.813l0.013,0.001c-0.014,0.064-0.039,0.125-0.039,0.194c0,0.553,0.447,0.991,1,0.991h8.071L18.7,13.767z"></path><path fill="#039BE5" d="M33.183,12.994c0.053,0.876-0.005,1.829-0.229,2.882c-1.281,5.995-5.912,9.115-11.635,9.115c0,0-3.47,0-4.313,0c-0.521,0-0.767,0.306-0.88,0.54l-1.74,8.049l-0.305,1.429h-0.006l-1.263,5.796l0.013,0.001c-0.014,0.064-0.039,0.125-0.039,0.194c0,0.553,0.447,1,1,1h7.333l0.013-0.01c0.472-0.007,0.847-0.344,0.945-0.788l0.018-0.015l1.812-8.416c0,0,0.126-0.803,0.97-0.803s4.178,0,4.178,0c5.723,0,10.401-3.106,11.683-9.102C42.18,16.106,37.358,13.019,33.183,12.994z"></path><path fill="#283593" d="M19.66,13c-0.474,0-0.852,0.326-0.955,0.769L18.7,13.767l-2.575,11.765c0.113-0.234,0.359-0.54,0.88-0.54c0.844,0,4.235,0,4.235,0c5.723,0,10.432-3.12,11.713-9.115c0.225-1.053,0.282-2.006,0.229-2.882C33.166,12.993,33.148,13,33.132,13H19.66z"></path>
                </svg>
            );
        default:
            return <span>{method || 'N/A'}</span>;
    }
};

const PaymentHistory = ({ clientId }) => {
    const { t } = useTranslation();
    const [payments, setPayments] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            setError('Token JWT missing. Please reconnect.');
            return;
        }

        const fetchPaymentHistory = async () => {
            try {
                const res = await fetch(`https://survivor-api.poulpitos.fr/api/payments?customerId=${clientId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    setPayments(data);
                } else {
                    const errorData = await res.json();
                    setError(`Failed to fetch payment history: ${errorData.error}`);
                }
            } catch (err) {
                setError('An unexpected error occurred while fetching payment history. Please try again later.');
            }
        };

        fetchPaymentHistory();
    }, [clientId]);

    return (
        <div className="payment-history">
            <h3 className="text-gray-700 text-lg font-medium">{t('paymentHistory')}</h3>
            <div className="flex flex-col mt-4">
                <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">{t('date')}</th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">{t('method')}</th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">{t('amount')}</th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">{t('comment')}</th>
                                </tr>
                            </thead>

                            <tbody className="bg-white">
                                {payments.length > 0 ? (
                                    payments.map((payment) => (
                                        <tr key={payment._id}>
                                            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                                                {new Date(payment.date).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500 flex items-center">
                                                <PaymentMethodIcon method={payment.paymentMethod} />
                                                <span className="ml-2">{payment.paymentMethod || 'N/A'}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                                                {payment.amount ? `${payment.amount} €` : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                                                {payment.comment || 'N/A'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500 text-center">
                                            {error ? error : t('noPayments')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentHistory;
