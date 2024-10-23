"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AuthGuard from './AuthGuard';
import TableDataPagination from './TableDataPagination';


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

async function fetchTips(token) {
    const response = await fetch('https://survivor-api.poulpitos.fr/api/tips', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
}

const AdviceList = () => {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [tipes, setTipes] = useState([]);
    const [error, setError] = useState(null);
    const [expandedTipIndex, setExpandedTipIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;



    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            setError(t("missingToken"));
            return;
        }

        const fetchData = async () => {
            try {
                const data = await fetchTips(token);
                setTipes(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchData();
    }, []);

    let tips = tipes;

    const filteredTips = tips.filter((tip) => {
        let title = tip.title || '';
        let description = tip.description || '';
        let lowerCaseTipTitle = title.toLowerCase();
        let lowerCaseTip = description.toLowerCase();
        const lowerCaseSearch = search.toLowerCase();

        if (lowerCaseSearch === '') {
            return true;
        }
        if (lowerCaseTip.charAt(lowerCaseTip.length - 1) === '.') {
            lowerCaseTip = lowerCaseTip.slice(0, -1);
        }
        if (lowerCaseSearch.length < lowerCaseTip.length) {
            lowerCaseTip = lowerCaseTip.slice(0, lowerCaseSearch.length);
        }
        if (lowerCaseTipTitle.charAt(lowerCaseTipTitle.length - 1) === '.') {
            lowerCaseTipTitle = lowerCaseTipTitle.slice(0, -1);
        }
        if (lowerCaseSearch.length < lowerCaseTipTitle.length) {
            lowerCaseTipTitle = lowerCaseTipTitle.slice(0, lowerCaseSearch.length);
        }
        return similarityPercentage(lowerCaseTip, lowerCaseSearch) > 85 || similarityPercentage(lowerCaseTipTitle, lowerCaseSearch) > 85;
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentTips = filteredTips.slice(startIndex, startIndex + itemsPerPage);
  
    const handlePageChange = (newPage) => {
      setCurrentPage(newPage);
    };


    const handleTipClick = (index) => {
        setExpandedTipIndex(expandedTipIndex === index ? null : index);
    };
    return (
        <AuthGuard>
            <div className="dashboard-page">
                <h3 className="text-gray-700 text-3xl font-medium">{t('Conseils')}</h3>
                <div className="mt-8"></div>
                <div className="flex flex-col mt-8">
                    <input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input mb-4 px-4 py-2 border rounded"
                    />
                        
                        {currentTips.map((tip, index) => (
                            <tr key={index}>
                                <div
                                    className={`p-1 border border-gray-300 bg-gray-100 cursor-pointer hover:bg-gray-200 flex justify-between items-center ${index > 0 ? 'border-2' : ''}`}
                                    onClick={() => handleTipClick(index)}
                                >
                                    <p className="tip-title font-bold m-5 p-0 flex-1">{tip.title}</p>
                                    <span className="ml-2 p-5">
                                        {expandedTipIndex === index ? '▲' : '▼'}
                                    </span>
                                </div>
                                {expandedTipIndex === index && (
                                    <div className="p-5 border-t border-gray-300 bg-white m-0">
                                        <p className="tip-description m-0">{tip.description}</p>
                                    </div>
                                )}
                            </tr>
                        ))}
                        <TableDataPagination
              currentPage={currentPage}
              totalItems={filteredTips.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
                </div>
            </div>
        </AuthGuard>
    );
};


export default AdviceList;
