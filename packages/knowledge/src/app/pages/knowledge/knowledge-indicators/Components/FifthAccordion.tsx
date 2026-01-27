import CustomLineChart from "./LineCharts";
import { useIntl } from "react-intl";

const FifthAccordion = () => {
  const intl = useIntl();

  const data = {
    labels: [
      intl.formatMessage({ id: "SpecificKnowledge" }),
      intl.formatMessage({ id: "ManagementKnowledge" }),
      intl.formatMessage({ id: "NationalKnowledge" }),
      intl.formatMessage({ id: "EthicalKnowledge" }),
    ],
    datasets: [
      {
        label: "",
        data: [5, 15, 12, 20],
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  };
  return <CustomLineChart chartData={data} />;
};

export default FifthAccordion;
