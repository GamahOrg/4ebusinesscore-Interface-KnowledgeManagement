import { Line } from "react-chartjs-2";

const CustomLineChart = ({ chartData }: any) => {
  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default CustomLineChart;
