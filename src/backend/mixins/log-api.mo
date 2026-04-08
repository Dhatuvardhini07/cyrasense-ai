import LogLib "../lib/log";
import LogTypes "../types/log";
import Common "../types/common";

mixin (logs : LogLib.State) {
  public shared ({ caller }) func saveDailyLog(log : LogTypes.DailyLog) : async Common.Result<(), Text> {
    LogLib.saveDailyLog(logs, caller, log);
  };

  public shared query ({ caller }) func getDailyLogs(startDate : Text, endDate : Text) : async [LogTypes.DailyLog] {
    LogLib.getDailyLogs(logs, caller, startDate, endDate);
  };

  public shared query ({ caller }) func getLogForDate(date : Text) : async ?LogTypes.DailyLog {
    LogLib.getLogForDate(logs, caller, date);
  };
};
