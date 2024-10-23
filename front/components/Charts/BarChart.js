import Chart from "react-apexcharts";
import { useTranslation } from 'react-i18next';

const BarChart = ({ series }) => {
    const { t } = useTranslation();
    
    const ChartOptions = {
        chart: {
            id: "basic-bar"
        },
        xaxis: {
            categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
        },
        series: [
            {
                name: "series-1",
                data: [30, 40, 45, 50, 49, 60, 70, 91]
            }
        ]
    };
    
    return (
        <div className="max-w-sm w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
            <div className="flex justify-between items-start w-full">
                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                    {t('numberOfClientsPerYear')}
                </h5>
            </div>
            <div className="py-6">
                <Chart
                    options={ChartOptions}
                    series={ChartOptions.series}
                    type="bar"
                    width="100%"
                />
            </div>
        </div>
    );
};

export default BarChart;
