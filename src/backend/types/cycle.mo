module {
  public type CycleRecord = {
    id : Text;
    startDate : Text;
    periodDays : Nat;
    cycleLengthDays : Nat;
    notes : ?Text;
    createdAt : Int;
  };

  public type CyclePrediction = {
    nextPeriodStart : Text;
    ovulationDate : Text;
    fertileWindowStart : Text;
    fertileWindowEnd : Text;
    currentPhase : Text;
    dayOfCycle : Nat;
  };
};
