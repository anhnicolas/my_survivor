import { useTranslation } from 'react-i18next';

const ValidateButton = ({ onValidate }) => {
    const { t } = useTranslation();
    
    return (
        <div className="flex justify-end">
            <button onClick={onValidate} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                {t('validate')}
            </button>
        </div>
    );
};

export default ValidateButton;
