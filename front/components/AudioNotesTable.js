"use client";

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const AudioNotesTable = ({ clientId }) => {
    const { t } = useTranslation();
    const [audioNotes, setAudioNotes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            setError('Token JWT missing. Please reconnect.');
            return;
        }

        const fetchAudioNotes = async () => {
            try {
                const res = await fetch(`https://survivor-api.poulpitos.fr/api/notes/${clientId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    setAudioNotes(data);
                } else {
                    const errorData = await res.json();
                    setError(`Failed to fetch audio notes: ${errorData.error}`);
                }
            } catch (err) {
                setError('An unexpected error occurred while fetching audio notes. Please try again later.');
            }
        };

        fetchAudioNotes();
    }, [clientId]);

    return (
        <div className="audio-notes">
            <h3 className="text-gray-700 text-lg font-medium">{t('audioNotes')}</h3>
            <div className="flex flex-col mt-4">
                <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">{t('date')}</th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">{t('content')}</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {audioNotes.length > 0 ? (
                                    audioNotes.map((note) => (
                                        <tr key={note._id}>
                                            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">{note._id}</td>
                                            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">{new Date(note.createdAt).toLocaleString()}</td>
                                            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">{note.note}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500 text-center">
                                            {error ? error : t('noAudioNotes')}
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

export default AudioNotesTable;
