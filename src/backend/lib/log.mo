import Types "../types/log";
import Common "../types/common";
import Map "mo:core/Map";
import List "mo:core/List";

module {
  public type State = Map.Map<Principal, List.List<Types.DailyLog>>;

  public func saveDailyLog(
    state : State,
    caller : Principal,
    log : Types.DailyLog,
  ) : Common.Result<(), Text> {
    let userLogs = switch (state.get(caller)) {
      case (?list) list;
      case null List.empty<Types.DailyLog>();
    };
    // Replace existing log for same date, or add new
    let existing = userLogs.findIndex(func(l) = (l.date == log.date));
    switch (existing) {
      case (?idx) { userLogs.put(idx, log) };
      case null { userLogs.add(log) };
    };
    state.add(caller, userLogs);
    #ok(());
  };

  public func getDailyLogs(
    state : State,
    caller : Principal,
    startDate : Text,
    endDate : Text,
  ) : [Types.DailyLog] {
    switch (state.get(caller)) {
      case null [];
      case (?list) {
        list.filter<Types.DailyLog>(func(l) = (l.date >= startDate and l.date <= endDate)).toArray();
      };
    };
  };

  public func getLogForDate(
    state : State,
    caller : Principal,
    date : Text,
  ) : ?Types.DailyLog {
    switch (state.get(caller)) {
      case null null;
      case (?list) { list.find<Types.DailyLog>(func(l) = (l.date == date)) };
    };
  };
};
