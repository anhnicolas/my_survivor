"use client"

import AuthGuard from '../../../components/AuthGuard';
import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';

const EventsMap = dynamic(() => import('@/components/EventsMap/EventsMap'), { ssr: false });

const Events = () => {
    const { t } = useTranslation();
	return (
		<AuthGuard>
		<div className="events-page">
			<h3 className="text-gray-700 text-3xl font-medium">{t('events')}</h3>
			<div className="main-content mt-12">
				<EventsMap />
			</div>
		</div>
		</AuthGuard>
	);
};

export default Events;
