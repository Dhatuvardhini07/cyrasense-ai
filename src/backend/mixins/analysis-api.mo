import AnalysisLib "../lib/analysis";
import CycleLib "../lib/cycle";
import LogLib "../lib/log";
import AnalysisTypes "../types/analysis";

mixin (cycles : CycleLib.State, logs : LogLib.State) {
  public shared ({ caller }) func analyzeCurrentCycle() : async AnalysisTypes.AnalysisResult {
    AnalysisLib.analyzeCurrentCycle(cycles, logs, caller);
  };

  public shared ({ caller }) func getMonthlyReport() : async AnalysisTypes.MonthlyReport {
    AnalysisLib.getMonthlyReport(cycles, logs, caller);
  };
};
