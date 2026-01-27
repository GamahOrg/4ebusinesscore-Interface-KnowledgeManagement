import CustomLineChart from "./LineCharts";
import { useIntl } from "react-intl";

const TopRatingStatistics = () => {
  const intl = useIntl();

  const data = {
    labels: [
      intl.formatMessage({ id: "Question1" }),
      intl.formatMessage({ id: "Question2" }),
      intl.formatMessage({ id: "Question3" }),
      intl.formatMessage({ id: "Question4" }),
      intl.formatMessage({ id: "Question5" }),
    ],
    datasets: [
      {
        label: "",
        data: [15, 18, 22, 17, 25],
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  };
  return <CustomLineChart chartData={data} />;
};

export default TopRatingStatistics;
