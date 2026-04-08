import Map "mo:core/Map";
import List "mo:core/List";

import ProfileLib "lib/profile";
import CycleLib "lib/cycle";
import LogLib "lib/log";
import QuizLib "lib/quiz";
import ChatLib "lib/chat";

import ProfileApi "mixins/profile-api";
import CycleApi "mixins/cycle-api";
import LogApi "mixins/log-api";
import AnalysisApi "mixins/analysis-api";
import ChatApi "mixins/chat-api";
import SelfCareApi "mixins/selfcare-api";
import QuizApi "mixins/quiz-api";

actor {
  let profiles : ProfileLib.State = Map.empty();
  let cycles : CycleLib.State = Map.empty();
  let logs : LogLib.State = Map.empty();
  let chats : ChatLib.State = Map.empty();
  let quizProgress : QuizLib.ProgressState = Map.empty();

  include ProfileApi(profiles);
  include CycleApi(cycles);
  include LogApi(logs);
  include AnalysisApi(cycles, logs);
  include ChatApi(chats);
  include SelfCareApi();
  include QuizApi(quizProgress);
};
