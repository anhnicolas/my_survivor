import Image from 'next/image';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Carousel = ({ clothes }) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const sortOrder = [t('hat/cap'), t('top'), t('bottom'), t('shoes')];

  const typeMapping = {
    'hat/cap': t('hat/cap'),
    'Hat': t('hat/cap'),
    'Cap': t('hat/cap'),
    'top': t('top'),
    'Top': t('top'),
    'bottom': t('bottom'),
    'Bottom': t('bottom'),
    'shoes': t('shoes'),
    'Shoes': t('shoes')
  };

  const sortedClothes = clothes.sort((a, b) => {
    const normalizedTypeA = typeMapping[a.type] || a.type.toLowerCase();
    const normalizedTypeB = typeMapping[b.type] || b.type.toLowerCase();
    const indexA = sortOrder.indexOf(normalizedTypeA);
    const indexB = sortOrder.indexOf(normalizedTypeB);
    return indexA - indexB;
  });

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? sortedClothes.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === sortedClothes.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div id="controls-carousel" className="relative w-80 h-36 mb-0 p-0" data-carousel="static">
      <div className="relative h-full overflow-hidden rounded-lg flex items-center justify-center p-0 m-0">
        {sortedClothes.map((item, index) => (
          <div
            key={index}
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
            data-carousel-item
          >
            <div className="relative w-16 h-16 md:w-32 md:h-32">
              <Image
                src={item.image}
                alt={t(item.type)}
                layout="fill"
                objectFit="contain"
                className="rounded"
              />
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={handlePrevious}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 z-30 flex items-center justify-center w-10 h-10 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        data-carousel-prev
      >
        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="sr-only">{t('previous')}</span>
      </button>
      <button
        type="button"
        onClick={handleNext}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 z-30 flex items-center justify-center w-10 h-10 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        data-carousel-next
      >
        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="sr-only">{t('next')}</span>
      </button>
    </div>
  );
};

export default Carousel;
