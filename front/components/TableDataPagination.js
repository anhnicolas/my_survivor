import { useTranslation } from 'react-i18next';

const TableDataPagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const { t } = useTranslation();
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePreviousClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex flex-col items-center py-4">
      <span className="text-sm text-gray-700 dark:text-gray-400">
        {t('showing')} <span className="font-semibold text-gray-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</span> {t('to')} <span className="font-semibold text-gray-900 dark:text-white">{Math.min(currentPage * itemsPerPage, totalItems)}</span> {t('of')} <span className="font-semibold text-gray-900 dark:text-white">{totalItems}</span> {t('entries')}
      </span>
      <div className="inline-flex mt-2 xs:mt-0">
        <button
          onClick={handlePreviousClick}
          className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          disabled={currentPage === 1}
        >
          {t('previous')}
        </button>
        <button
          onClick={handleNextClick}
          className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          disabled={currentPage === totalPages}
        >
          {t('next')}
        </button>
      </div>
    </div>
  );
}

export default TableDataPagination;
