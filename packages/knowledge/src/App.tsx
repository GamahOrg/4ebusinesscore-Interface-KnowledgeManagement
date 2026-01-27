import "./App.css";
import { Route, Routes } from "react-router-dom";
import { KnowledgeAskExpert } from "./app/pages/knowledge/ask-expert/knowledge-ask-expert";
import { KnowledgeIdeasBank } from "./app/pages/knowledge/ideas-bank/knowledge-ideas-bank";
import { KnowledgeAskChallenge } from "./app/pages/knowledge/ask-challenge/knowledge-ask-challenge";
import { KnowledgeAskChallengeDetailsUser } from "./app/pages/knowledge/ask-challenge/knowledge-ask-challenge-details-user";
import { KnowledgeAskChallengeDetailsAdmin } from "./app/pages/knowledge/ask-challenge/knowledge-ask-challenge-details-admin";
import { KnowledgeBlogging } from "./app/pages/knowledge/blogging/knowledge-blogging";
import { KnowledgeBloggingDetailsUser } from "./app/pages/knowledge/blogging/knowledge-blogging-details-user";
import { KnowledgeBloggingDetailsAdmin } from "./app/pages/knowledge/blogging/knowledge-blogging-details-admin";
import { KnowledgeGeneralKnowledge } from "./app/pages/knowledge/general-knowledge/knowledge-general-knowledge";
import { KnowledgeAddNewKnowledge } from "./app/pages/knowledge/general-knowledge/knowledge-add-new-knowledge";
import { KnowledgeAddKnowledge } from "./app/pages/knowledge/general-knowledge/knowledge-add-knowledge";
import { KnowledgeKnowledgeList } from "./app/pages/knowledge/general-knowledge/knowledge-knowledge-list";
import { KnowledgeKnowledgeableContent } from "./app/pages/knowledge/general-knowledge/knowledge-knowledgeable-content";
import { KnowledgeOwnKnowledge } from "./app/pages/knowledge/own-knowledge/knowledge-own-knowledge";
import { KnowledgeOwnAddNewKnowledge } from "./app/pages/knowledge/own-knowledge/knowledge-own-add-new-knowledge";
import { KnowledgeOwnAddKnowledge } from "./app/pages/knowledge/own-knowledge/knowledge-own-add-knowledge";
import { KnowledgeOwnKnowledgeList } from "./app/pages/knowledge/own-knowledge/knowledge-own-knowledge-list";
import { KnowledgeOwnKnowledgeableContent } from "./app/pages/knowledge/own-knowledge/knowledge-own-knowledgeable-content";
import { KnowledgePostingRequests } from "./app/pages/knowledge/posting-requests/knowledge-posting-requests";
import KnowledgePostingRequestsDetails from "./app/pages/knowledge/posting-requests/Knowledge-posting-requests-details";
import { KnowledgeMyQuestions } from "./app/pages/knowledge/my-questions/knowledge-my-questions";
import KnowledgeMyQuestionDetails from "./app/pages/knowledge/my-questions/knowledge-my-question-details";
import { KonwledgeExpert } from "./app/pages/knowledge/ask-expert/konwledge-expert";
import { KnowledgeAddQuestion } from "./app/pages/knowledge/ask-expert/knowledge-add-question";
import { KnowledgeProfileExpert } from "./app/pages/knowledge/ask-expert/knowledge-profile-expert";
import { KonwledgeQuestionDetails } from "./app/pages/knowledge/ask-expert/konwledge-question-details";
import { KnowledgeIdeasBankDetails } from "./app/pages/knowledge/ideas-bank/konwledge-ideas-bank-details";
import { KnowledgeExperts } from "./app/pages/knowledge/experts/knowledge-experts";
import { KnowledgeExpertsProfile } from "./app/pages/knowledge/experts/knowledge-experts-profile";
import { KnowledgeExpertsAddExpert } from "./app/pages/knowledge/experts/knowledge-experts-add-expert";
import { KnowledgeExpertsEditExpert } from "./app/pages/knowledge/experts/knowledge-experts-edit-expert";
import { Provider } from "react-redux";
import store from "./app/store/store";
import { KnowledgeEditKnowledge } from "./app/pages/knowledge/general-knowledge/knowledge-edit-knowledge";
import { KnowledgeEditOwnKnowledge } from "./app/pages/knowledge/own-knowledge/knowledge-own-edit-knowledge";
import { KnowledgeMyQuestionsAskExpert } from "./app/pages/knowledge/my-questions/knowledge-my-questions-askExpert";
import KnowledgeMyQuestionDetailsAskExpert from "./app/pages/knowledge/my-questions/knowledge-my-question-details-askExpert";
import KnowledgeIndicators from "./app/pages/knowledge/knowledge-indicators/knowledge-indicators";
import { DynamicWorkSpace } from "@npm-react/react-redux-routing";

function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route index path="/" element={<DynamicWorkSpace />} />
        <Route path="/knowledge-ask-expert" element={<KnowledgeAskExpert />} />
        <Route path="/knowledge-ideas-bank" element={<KnowledgeIdeasBank />} />
        <Route
          path="/knowledge-ask-challenge"
          element={<KnowledgeAskChallenge />}
        />
        <Route
          path="/knowledge-ask-challenge/challenge-details/:id"
          element={<KnowledgeAskChallengeDetailsUser />}
        />
        <Route
          path="/knowledge-ask-challenge/challenge-details-admin/:id"
          element={<KnowledgeAskChallengeDetailsAdmin />}
        />
        <Route path="/knowledge-blogging" element={<KnowledgeBlogging />} />
        <Route
          path="/knowledge-blogging/blog-details/:id"
          element={<KnowledgeBloggingDetailsUser />}
        />
        <Route
          path="/knowledge-blogging/blog-details-admin/:id"
          element={<KnowledgeBloggingDetailsAdmin />}
        />
        <Route
          path="/knowledge-general-knowledge"
          element={<KnowledgeGeneralKnowledge />}
        />
        <Route
          path="/knowledge-general-knowledge/add-new"
          element={<KnowledgeAddNewKnowledge />}
        />
        <Route
          path="/knowledge-general-knowledge/list/add/:id"
          element={<KnowledgeAddKnowledge />}
        />
        <Route
          path="/knowledge-general-knowledge/list/edit/:id"
          element={<KnowledgeEditKnowledge />}
        />
        <Route
          path="/knowledge-general-knowledge/list/:id"
          element={<KnowledgeKnowledgeList />}
        />
        <Route
          path="/knowledge-general-knowledge/list/details/:id/:subId"
          element={<KnowledgeKnowledgeableContent />}
        />
        <Route
          path="/knowledge-own-knowledge"
          element={<KnowledgeOwnKnowledge />}
        />
        <Route
          path="/knowledge-own-knowledge/add-new"
          element={<KnowledgeOwnAddNewKnowledge />}
        />
        <Route
          path="/knowledge-own-knowledge/list/add/:id"
          element={<KnowledgeOwnAddKnowledge />}
        />
        <Route
          path="/knowledge-own-knowledge/list/edit/:id"
          element={<KnowledgeEditOwnKnowledge />}
        />
        <Route
          path="/knowledge-own-knowledge/list/:id"
          element={<KnowledgeOwnKnowledgeList />}
        />
        <Route
          path="/knowledge-own-knowledge/list/details/:id/:subId"
          element={<KnowledgeOwnKnowledgeableContent />}
        />
        <Route
          path="/knowledge-posting-requests"
          element={<KnowledgePostingRequests />}
        />
        <Route
          path="/knowledge-posting-requests/:department/:id/details"
          element={<KnowledgePostingRequestsDetails />}
        />
        <Route
          path="/knowledge-my-questions"
          element={<KnowledgeMyQuestions />}
        />
        <Route
          path="/knowledge-ask-expert/knowledge-my-questions-ask-expert"
          element={<KnowledgeMyQuestionsAskExpert />}
        />

        <Route
          path="/knowledge-my-questions/knowledge-my-question-details/:id"
          element={<KnowledgeMyQuestionDetails />}
        />
        <Route
          path="/knowledge-my-question-details-ask-expert/:id"
          element={<KnowledgeMyQuestionDetailsAskExpert />}
        />
        <Route
          path="/knowledge-ask-expert/knowledge-expert"
          element={<KonwledgeExpert />}
        />
        <Route
          path="/knowledge-ask-expert/knowledge-add-question"
          element={<KnowledgeAddQuestion />}
        />
        <Route
          path="/knowledge-profile-expert/:id"
          element={<KnowledgeProfileExpert />}
        />
        <Route
          path="/knowledge-ask-expert/knowledge-question-details/:id"
          element={<KonwledgeQuestionDetails />}
        />
        <Route
          path="/knowledge-ideas-bank/knowledge-idea-bank-details/:id"
          element={<KnowledgeIdeasBankDetails />}
        />
        <Route path="/knowledge-experts" element={<KnowledgeExperts />} />
        <Route
          path="/knowledge-experts/knowledge-experts-profile/:id"
          element={<KnowledgeExpertsProfile />}
        />
        <Route
          path="/knowledge-experts-add-expert"
          element={<KnowledgeExpertsAddExpert />}
        />
        <Route
          path="/knowledge-experts/knowledge-experts-edit-expert/:id"
          element={<KnowledgeExpertsEditExpert />}
        />
        <Route path="/knowledge-indicators" element={<KnowledgeIndicators />} />
      </Routes>
    </Provider>
  );
}

export default App;
