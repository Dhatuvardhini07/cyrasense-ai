module {
  public type QuizQuestion = {
    id : Text;
    question : Text;
    options : [Text];
    correctIndex : Nat;
    explanation : Text;
  };

  public type UserProgress = {
    totalPoints : Nat;
    quizzesCompletedToday : Nat;
    lastQuizDate : Text;
    totalCompleted : Nat;
  };

  public type QuizResult = {
    correct : Bool;
    explanation : Text;
    pointsEarned : Nat;
  };
};
