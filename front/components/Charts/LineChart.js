import Chart from 'react-apexcharts';
import { useTranslation } from 'react-i18next';

const LineChart = ({ series }) => {
    const { t } = useTranslation();

    const transformEncountersData = (encounters) => {
        const encountersByMonth = {};

        encounters.forEach(encounter => {
            const month = new Date(encounter.date).toLocaleString('default', { month: 'short', year: 'numeric' });
            if (!encountersByMonth[month]) {
                encountersByMonth[month] = 0;
            }
            encountersByMonth[month]++;
        });

        const categories = Object.keys(encountersByMonth);
        const data = Object.values(encountersByMonth);

        return { categories, data };
    };

    const { categories, data } = transformEncountersData(series[0].data.flat());

    const ChartOptions = {
        xaxis: {
            show: true,
            categories: categories,
            labels: {
                show: true,
                style: {
                    fontFamily: "Inter, sans-serif",
                    cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
                }
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        yaxis: {
            labels: {
                style: {
                    fontFamily: "Inter, sans-serif",
                    cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
                }
            }
        },
        chart: {
            type: 'bar'
        }
    };

    const chartSeries = [
        {
            name: t('coachingEvolution'),
            data: data
        }
    ];

    return (
        <div className="max-w-sm w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
            <div className="flex justify-between items-start w-full">
                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">{t('Number of meetings per week')}</h5>
            </div>
            <div className="py-6">
            <Chart
                options={ChartOptions}
                series={chartSeries}
                type="bar"
                height="350"
            />
            </div>
        </div>
    );
};

export default LineChart;