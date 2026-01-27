import { FC, useEffect } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../../store/store";
import TotalStatistics from "./TotalStatistics";
import SecondAccordion from "./SecondAccordion";
import ThirdAccordion from "./ThirdAccordion";
import FourthAccordion from "./FourthAccordion";
import FifthAccordion from "./FifthAccordion";
import SeventhAccordion from "./SeventhAccordion";
import EightthAccordion from "./EightthAccordion";
import NinthAccordion from "./NinthAccordion";
import TenthAccordion from "./TenthAccordion";
import EleventhAccordion from "./EleventhAccordion";
import TwelfthAccordion from "./TwelfthAccordion";
import ThirteenthAccordion from "./ThirteenthAccordion";
import FourteenthAccordion from "./FourteenthAccordion";
import FifteenthAccordion from "./FifteenthAccordion";
import SixteenthAccordion from "./SixteenthAccordion";
import SeventeenthAccordion from "./SeventeenthAccordion";
import EighteenthAccordion from "./EighteenthAccordion";
import NinetenthAccordion from "./NinetenthAccordion";
import TwentiethAccordion from "./TwentiethAccordion";
import TwentyOneAccordion from "./TwentyOneAccordion";
import TwentyTwoAccordion from "./TwentyTwoAccordion";
import { Accordion } from "react-bootstrap";
import { 
  fetchBlogIndex, 
  fetchAskExpertIndex, 
  fetchChallengeIndex, 
  fetchIdeaBankIndex, 
  fetchKnowledgeIndex, 
  fetchUserAndIOrgIndicators 
} from "../../../../features/indicators/indicatorsSlice";

const ReportsIndicators: FC = () => {
  const intl = useIntl();

  const EN_LANG = "en";
  let selectedLang: any = localStorage.getItem("i18nConfig");
  try {
    selectedLang = JSON.parse(selectedLang).selectedLang;
  } catch (err) {}

  const dispatch = useAppDispatch();

  const {
    blogIndicators,
    askExpertIndicators,
    challengesIndicators,
    ideaBankIndicators,
    knowledgeIndicators,
    userAndIOrgIndicators,
  } = useSelector((state: RootState) => state.knowledgeIndicators);

  useEffect(() => {
    dispatch(fetchBlogIndex());
    dispatch(fetchAskExpertIndex());
    dispatch(fetchChallengeIndex());
    dispatch(fetchIdeaBankIndex());
    dispatch(fetchKnowledgeIndex());
    dispatch(fetchUserAndIOrgIndicators());
  }, [dispatch]);

  const statisticsData = [
    {
      id: "1",
      title: intl.formatMessage({ id: "IndicatorsBlogs" }),
      content: blogIndicators ? <TotalStatistics /> : null,
      cols: "mb-3 col-12",
    },
    {
      id: "2",
      title: intl.formatMessage({ id: "BlogLiks" }),
      content: blogIndicators ? <ThirdAccordion /> : null,
      cols: "mb-3 col-12 col-md-6",
    },
    {
      id: "3",
      title: intl.formatMessage({ id: "BlogComments" }),
      content: blogIndicators ? <NinthAccordion /> : null,
      cols: "mb-3 col-12 col-md-6",
    },
    {
      id: "4",
      title: intl.formatMessage({ id: "IndicatorsAskExpert" }),
      content: askExpertIndicators ? <TenthAccordion /> : null,
      cols: "mb-3 col-12",
    },
    {
      id: "5",
      title: intl.formatMessage({ id: "Specializations" }),
      content: askExpertIndicators ? <EleventhAccordion /> : null,
      cols: "mb-3 col-12 col-md-6",
    },
    {
      id: "6",
      title: intl.formatMessage({ id: "ExpertQuestions" }),
      content: askExpertIndicators ? <SeventhAccordion /> : null,
      cols: "mb-3 col-12 col-md-6",
    },
    {
      id: "7",
      title: intl.formatMessage({ id: "IndicatorsChallenges" }),
      content: challengesIndicators ? <TwelfthAccordion /> : null,
      cols: "mb-3 col-12",
    },
    {
      id: "8",
      title: intl.formatMessage({ id: "ChallengeComments" }),
      content: challengesIndicators ? <FourthAccordion /> : null,
      cols: "mb-3 col-12",
    },
    {
      id: "9",
      title: intl.formatMessage({ id: "IndicatorsIdeaBank" }),
      content: ideaBankIndicators ? <ThirteenthAccordion /> : null,
      cols: "mb-3 col-12",
    },
    {
      id: "10",
      title: intl.formatMessage({ id: "IndicatorsKnowledge" }),
      content: knowledgeIndicators ? <FourteenthAccordion /> : null,
      cols: "mb-3 col-12",
    },
    {
      id: "11",
      title: intl.formatMessage({ id: "CountOfViews" }),
      content: knowledgeIndicators ? <FifteenthAccordion /> : null,
      cols: "mb-3 col-12 col-md-6",
    },
    {
      id: "12",
      title: intl.formatMessage({ id: "CountOfRates" }),
      content: knowledgeIndicators ? <SixteenthAccordion /> : null,
      cols: "mb-3 col-12 col-md-6",
    },
    {
      id: "13",
      title: intl.formatMessage({ id: "IndicatorsUserAndOrg" }),
      content: userAndIOrgIndicators ? <SeventeenthAccordion /> : null,
      cols: "mb-3 col-12 col-md-6",
    },
    {
      id: "14",
      title: intl.formatMessage({ id: "CountOfSubKnowledgesOrgs" }),
      content: userAndIOrgIndicators ? <EighteenthAccordion /> : null,
      cols: "mb-3 col-12 col-md-6",
    },
    {
      id: "15",
      title: intl.formatMessage({ id: "CountOfSubKnowledgesUsers" }),
      content: userAndIOrgIndicators ? <NinetenthAccordion /> : null,
      cols: "mb-3 col-12 col-md-6",
    },
    {
      id: "16",
      title: intl.formatMessage({ id: "CountOfType" }),
      content: userAndIOrgIndicators ? <TwentiethAccordion /> : null,
      cols: "mb-3 col-12 col-md-6",
    },
    {
      id: "17",
      title: intl.formatMessage({ id: "CountOfKnowledgesOrgs" }),
      content: userAndIOrgIndicators ? <TwentyOneAccordion /> : null,
      cols: "mb-3 col-12 col-md-6",
    },
    {
      id: "18",
      title: intl.formatMessage({ id: "CountOfSubKnowledges" }),
      content: userAndIOrgIndicators ? <TwentyTwoAccordion /> : null,
      cols: "mb-3 col-12 col-md-6",
    },
  ];

  return (
    <div className="card card-xl-stretch mb-xl-8">
      <div className="card-body pt-0 mt-8">
        <div className="row">
          {statisticsData
            .filter((item) => item.content !== null)
            .map((item, index) => (
              <div className={item.cols} key={item.id}>
                <Accordion defaultActiveKey={`${index + 1}`}>
                  <Accordion.Item
                    eventKey={item.id}
                    className={`standards-accordion-button ${
                      index !== 0 ? "mt-5" : "mb-3"
                    }`}
                  >
                    <Accordion.Header
                      className={`border-${
                        selectedLang == EN_LANG ? "start" : "end"
                      } d-flex border-primary border-4 border-bottom-0 bg-transparent`}
                    >
                      <span className="text-primary h3 fw-bolder d-flex align-items-center">
                        <i
                          className={`fa-solid fa-angle-${
                            selectedLang == EN_LANG ? "right" : "left"
                          } fs-2x mx-2`}
                        ></i>
                        {item.title}
                      </span>
                    </Accordion.Header>
                    <Accordion.Body>{item.content}</Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export { ReportsIndicators };
