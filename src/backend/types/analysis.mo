module {
  public type AnalysisResult = {
    isNormal : Bool;
    guidance : Text;
    guidanceLevel : Text;
    reasoning : Text;
    delayDays : ?Int;
  };

  public type MonthlyReport = {
    cycleLength : Nat;
    avgPainLevel : Float;
    commonSymptoms : [Text];
    patternInsight : Text;
    nextSteps : Text;
  };
};
