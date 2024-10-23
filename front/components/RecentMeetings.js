"use client";

import { useEffect, useState } from 'react';
const { useTranslation } = require('react-i18next');

const RatingStars = ({ rating }) => {
    const maxRating = 5; // Assume a rating out of 5
    const filledStars = Math.round(rating); // Round the rating to the nearest whole number
    const emptyStars = maxRating - filledStars;

    return (
        <div className="flex items-center">
            {/* Render filled stars */}
            {[...Array(filledStars)].map((_, i) => (
                <span key={i} className="text-yellow-400">★</span>
            ))}
            {/* Render empty stars */}
            {[...Array(emptyStars)].map((_, i) => (
                <span key={i} className="text-gray-300">★</span>
            ))}
        </div>
    );
};

const RecentMeetings = ({ clientId }) => {
    const { t } = useTranslation();
    const [meetings, setMeetings] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            setError('Token JWT missing. Please reconnect.');
            return;
        }

        const fetchRecentMeetings = async () => {
            try {
                const res = await fetch(`https://survivor-api.poulpitos.fr/api/encounters?customerId=${clientId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    setMeetings(data);
                } else {
                    const errorData = await res.json();
                    setError(`Failed to fetch meetings: ${errorData.error}`);
                }
            } catch (err) {
                setError('An unexpected error occurred while fetching recent meetings. Please try again later.');
            }
        };

        fetchRecentMeetings();
    }, [clientId]);

    return (
        <div className="recent-meetings">
            <h3 className="text-gray-700 text-lg font-medium">{t('recentMeetings')}</h3>
            <div className="flex flex-col mt-4">
                <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-5 font-medium text-gray-500 uppercase tracking-wider">{t('date')}</th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-5 font-medium text-gray-500 uppercase tracking-wider">{t('rating')}</th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-5 font-medium text-gray-500 uppercase tracking-wider">{t('source')}</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {meetings.length > 0 ? (
                                    meetings.map((meeting) => (
                                        <tr key={meeting._id}>
                                            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                                                {new Date(meeting.date).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                                                {meeting.rating ? <RatingStars rating={meeting.rating} /> : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                                                {meeting.source || 'N/A'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500 text-center">
                                            {error ? error : t('noMeetings')}
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

export default RecentMeetings;
