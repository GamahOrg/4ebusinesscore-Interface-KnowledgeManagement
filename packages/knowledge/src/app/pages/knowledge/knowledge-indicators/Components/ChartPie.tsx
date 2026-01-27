import { Doughnut } from "react-chartjs-2";
import { useIntl } from "react-intl";

const ChartPie = () => {
  const intl = useIntl();

  const data = {
    labels: [
      intl.formatMessage({ id: "GeneralKnowledge" }),
      intl.formatMessage({ id: "OwnKnowledge" }),

    ],
    datasets: [
      {
        data: [15, 10],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
        hoverOffset: 4,
      },
    ],
  };
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    width: 500,
    height: 500,
  };
  return (
    <div>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default ChartPie;
