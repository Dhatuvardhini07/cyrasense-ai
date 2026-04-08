import QuizLib "../lib/quiz";
import QuizTypes "../types/quiz";

mixin (quizProgress : QuizLib.ProgressState) {
  public query func getDailyQuizzes() : async [QuizTypes.QuizQuestion] {
    QuizLib.getDailyQuizzes();
  };

  public shared ({ caller }) func submitQuizAnswer(questionId : Text, selectedIndex : Nat) : async QuizTypes.QuizResult {
    QuizLib.submitQuizAnswer(quizProgress, caller, questionId, selectedIndex);
  };

  public shared query ({ caller }) func getUserProgress() : async QuizTypes.UserProgress {
    QuizLib.getUserProgress(quizProgress, caller);
  };
};
