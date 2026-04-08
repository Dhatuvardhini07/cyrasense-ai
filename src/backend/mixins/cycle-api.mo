import CycleLib "../lib/cycle";
import CycleTypes "../types/cycle";
import Common "../types/common";

mixin (cycles : CycleLib.State) {
  public shared ({ caller }) func addCycleRecord(record : CycleTypes.CycleRecord) : async Common.Result<(), Text> {
    CycleLib.addCycleRecord(cycles, caller, record);
  };

  public shared query ({ caller }) func getCycleHistory() : async [CycleTypes.CycleRecord] {
    CycleLib.getCycleHistory(cycles, caller);
  };

  public shared query ({ caller }) func getCurrentCyclePrediction() : async ?CycleTypes.CyclePrediction {
    CycleLib.getCurrentCyclePrediction(cycles, caller);
  };

  public shared query ({ caller }) func getAverageCycleLength() : async Float {
    CycleLib.getAverageCycleLength(cycles, caller);
  };
};
