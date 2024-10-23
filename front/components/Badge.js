import React from 'react';

const BadgeComponent = ({ type, client }) => {
    const isOld = client.birthDate && new Date().getFullYear() - new Date(client.birthDate).getFullYear() >= 50;
    const isBirthday = client.birthDate && new Date().getMonth() === new Date(client.birthDate).getMonth() && new Date().getDate() === new Date(client.birthDate).getDate();

    const badgeData = {
        wine: { emoji: '🍷', description: 'Old person' },
        cake: { emoji: '🎂', description: 'Happy birthday!' },
        star: { emoji: '🕐', description: 'Long-term user' },
    };

    const badge = badgeData[type];
    if (!badge) {
        return null;
    }

    if (type === 'wine' && isOld) {
        return (
            <div className="inline-block">
                <span title={badge.description} className="text-2xl">
                    {badge.emoji}
                </span>
            </div>
        );
    }

    if (type === 'cake' && isBirthday) {
        return (
            <div className="inline-block">
                <span title={badge.description} className="text-2xl">
                    {badge.emoji}
                </span>
            </div>
        );
    }
};

export default BadgeComponent;
