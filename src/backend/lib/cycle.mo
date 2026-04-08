import Types "../types/cycle";
import Common "../types/common";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Float "mo:core/Float";

module {
  public type State = Map.Map<Principal, List.List<Types.CycleRecord>>;

  // Date helpers — dates stored as "YYYY-MM-DD" text
  // Parse date text to days since epoch (approx, day-level)
  func parseDate(d : Text) : ?Int {
    let parts = d.split(#char '-');
    let arr = parts.toArray();
    if (arr.size() != 3) return null;
    switch (Nat.fromText(arr[0]), Nat.fromText(arr[1]), Nat.fromText(arr[2])) {
      case (?y, ?m, ?day) {
        // Convert to approximate days (Gregorian formula)
        let iy : Int = y;
        let im : Int = m;
        let id : Int = day;
        let a = (14 - im) / 12;
        let yr = iy + 4800 - a;
        let mo = im + 12 * a - 3;
        let jdn = id + (153 * mo + 2) / 5 + 365 * yr + yr / 4 - yr / 100 + yr / 400 - 32045;
        ?jdn;
      };
      case _ null;
    };
  };

  func addDays(d : Text, n : Int) : Text {
    switch (parseDate(d)) {
      case null d;
      case (?jdn) {
        let newJdn = jdn + n;
        // Convert JDN back to Gregorian
        let a = newJdn + 32044;
        let b = (4 * a + 3) / 146097;
        let c = a - (146097 * b) / 4;
        let dd = (4 * c + 3) / 1461;
        let e = c - (1461 * dd) / 4;
        let mm = (5 * e + 2) / 153;
        let day = e - (153 * mm + 2) / 5 + 1;
        let month = mm + 3 - 12 * (mm / 10);
        let year = 100 * b + dd - 4800 + mm / 10;
        let pad2 = func(x : Int) : Text {
          let t = x.toText();
          if (t.size() < 2) "0" # t else t;
        };
        year.toText() # "-" # pad2(month) # "-" # pad2(day);
      };
    };
  };

  func daysBetween(from : Text, to : Text) : Int {
    switch (parseDate(from), parseDate(to)) {
      case (?f, ?t) t - f;
      case _ 0;
    };
  };

  // Get today's date as YYYY-MM-DD (approximate, based on IC time)
  func todayText() : Text {
    let now = Time.now(); // nanoseconds
    let secondsSinceEpoch : Int = now / 1_000_000_000;
    let daysSinceEpoch : Int = secondsSinceEpoch / 86400;
    // Unix epoch = Jan 1, 1970 = JDN 2440588
    let jdn = daysSinceEpoch + 2440588;
    let a = jdn + 32044;
    let b = (4 * a + 3) / 146097;
    let c = a - (146097 * b) / 4;
    let dd = (4 * c + 3) / 1461;
    let e = c - (1461 * dd) / 4;
    let mm = (5 * e + 2) / 153;
    let day = e - (153 * mm + 2) / 5 + 1;
    let month = mm + 3 - 12 * (mm / 10);
    let year = 100 * b + dd - 4800 + mm / 10;
    let pad2 = func(x : Int) : Text {
      let t = x.toText();
      if (t.size() < 2) "0" # t else t;
    };
    year.toText() # "-" # pad2(month) # "-" # pad2(day);
  };

  public func addCycleRecord(
    state : State,
    caller : Principal,
    record : Types.CycleRecord,
  ) : Common.Result<(), Text> {
    let userRecords = switch (state.get(caller)) {
      case (?list) list;
      case null List.empty<Types.CycleRecord>();
    };
    userRecords.add(record);
    state.add(caller, userRecords);
    #ok(());
  };

  public func getCycleHistory(
    state : State,
    caller : Principal,
  ) : [Types.CycleRecord] {
    switch (state.get(caller)) {
      case null [];
      case (?list) {
        let sorted = list.sort(func(a, b) = switch (parseDate(a.startDate), parseDate(b.startDate)) {
          case (?da, ?db) {
            if (da < db) #less
            else if (da > db) #greater
            else #equal;
          };
          case _ #equal;
        });
        sorted.toArray();
      };
    };
  };

  public func getAverageCycleLength(
    state : State,
    caller : Principal,
  ) : Float {
    switch (state.get(caller)) {
      case null 28.0;
      case (?list) {
        let count = list.size();
        if (count == 0) return 28.0;
        let total = list.foldLeft(0, func(acc, r) = acc + r.cycleLengthDays);
        total.toFloat() / count.toFloat();
      };
    };
  };

  public func getCurrentCyclePrediction(
    state : State,
    caller : Principal,
  ) : ?Types.CyclePrediction {
    switch (state.get(caller)) {
      case null null;
      case (?list) {
        if (list.isEmpty()) return null;
        // Find most recent record
        let sorted = list.sort(func(a, b) = switch (parseDate(a.startDate), parseDate(b.startDate)) {
          case (?da, ?db) {
            if (da < db) #less
            else if (da > db) #greater
            else #equal;
          };
          case _ #equal;
        });
        let lastRecord = switch (sorted.last()) {
          case null return null;
          case (?r) r;
        };
        let count = list.size();
        let avgLength : Int = if (count == 0) 28 else {
          let total = list.foldLeft(0, func(acc, r) = acc + r.cycleLengthDays);
          total / count;
        };

        let today = todayText();
        let dayOfCycle : Int = daysBetween(lastRecord.startDate, today) + 1;
        let safeDay : Nat = if (dayOfCycle < 1) 1 else Int.abs(dayOfCycle);

        let nextPeriodStart = addDays(lastRecord.startDate, avgLength);
        let ovulationDate = addDays(nextPeriodStart, -14);
        let fertileWindowStart = addDays(ovulationDate, -5);
        let fertileWindowEnd = addDays(ovulationDate, 1);

        let currentPhase = if (safeDay <= 5) "menstrual"
          else if (safeDay <= 13) "follicular"
          else if (safeDay <= 16) "ovulation"
          else "luteal";

        ?{
          nextPeriodStart;
          ovulationDate;
          fertileWindowStart;
          fertileWindowEnd;
          currentPhase;
          dayOfCycle = safeDay;
        };
      };
    };
  };
};
