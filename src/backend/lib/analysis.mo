import CycleTypes "../types/cycle";
import LogTypes "../types/log";
import AnalysisTypes "../types/analysis";
import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Float "mo:core/Float";

module {
  public type CycleState = Map.Map<Principal, List.List<CycleTypes.CycleRecord>>;
  public type LogState = Map.Map<Principal, List.List<LogTypes.DailyLog>>;

  func getAverageLength(list : List.List<CycleTypes.CycleRecord>) : Float {
    let count = list.size();
    if (count == 0) return 28.0;
    let total = list.foldLeft(0, func(acc, r) = acc + r.cycleLengthDays);
    total.toFloat() / count.toFloat();
  };

  func sortedRecords(list : List.List<CycleTypes.CycleRecord>) : [CycleTypes.CycleRecord] {
    list.sort<CycleTypes.CycleRecord>(func(a, b) = if (a.startDate < b.startDate) #less else if (a.startDate > b.startDate) #greater else #equal).toArray();
  };

  public func analyzeCurrentCycle(
    cycleState : CycleState,
    logState : LogState,
    caller : Principal,
  ) : AnalysisTypes.AnalysisResult {
    let cycleList = switch (cycleState.get(caller)) {
      case null List.empty<CycleTypes.CycleRecord>();
      case (?l) l;
    };

    if (cycleList.isEmpty()) {
      return {
        isNormal = true;
        guidance = "Continue monitoring";
        guidanceLevel = "monitor";
        reasoning = "No cycle data recorded yet. Start tracking your cycle to receive personalized insights.";
        delayDays = null;
      };
    };

    let avgLength = getAverageLength(cycleList);
    let records = sortedRecords(cycleList);
    let lastRecord = records[records.size() - 1];
    let count = records.size();

    // Check if last 3 cycles show increasing length pattern
    let increasingPattern = if (count >= 3) {
      let r1 = records[count - 3];
      let r2 = records[count - 2];
      let r3 = records[count - 1];
      r2.cycleLengthDays > r1.cycleLengthDays and r3.cycleLengthDays > r2.cycleLengthDays;
    } else false;

    // For delay: cycleLengthDays of last record compared to average
    let lastLength : Float = lastRecord.cycleLengthDays.toFloat();
    let avgLengthNat : Nat = if (cycleList.isEmpty()) 28 else {
      let total = cycleList.foldLeft(0, func(acc, r) = acc + r.cycleLengthDays);
      total / cycleList.size();
    };
    let delayFloat = lastLength - avgLength;
    let isDelayed = delayFloat > 7.0;
    let delayDays : ?Int = if (isDelayed and lastRecord.cycleLengthDays > avgLengthNat) {
      ?(lastRecord.cycleLengthDays.toInt() - avgLengthNat.toInt())
    } else null;

    if (isDelayed) {
      {
        isNormal = false;
        guidance = "Your cycle appears delayed. This can be due to multiple reasons such as stress or hormonal changes. If relevant, you may consider a pregnancy test for clarity.";
        guidanceLevel = "consult";
        reasoning = "Your last recorded cycle length (" # lastRecord.cycleLengthDays.toText() # " days) is more than 7 days longer than your average (" # avgLengthNat.toText() # " days). Delays can be caused by stress, hormonal changes, weight fluctuations, or other factors.";
        delayDays;
      };
    } else if (increasingPattern) {
      {
        isNormal = false;
        guidance = "Focus on lifestyle adjustments";
        guidanceLevel = "lifestyle";
        reasoning = "Your last three cycles show a progressively increasing length pattern. This may indicate hormonal fluctuations. Consider reviewing sleep, stress levels, and nutrition.";
        delayDays = null;
      };
    } else {
      {
        isNormal = true;
        guidance = "Continue monitoring";
        guidanceLevel = "monitor";
        reasoning = "Your cycle pattern appears within normal variation. Keep tracking consistently for more accurate insights over time.";
        delayDays = null;
      };
    };
  };

  public func getMonthlyReport(
    cycleState : CycleState,
    logState : LogState,
    caller : Principal,
  ) : AnalysisTypes.MonthlyReport {
    let cycleList = switch (cycleState.get(caller)) {
      case null List.empty<CycleTypes.CycleRecord>();
      case (?l) l;
    };
    let logList = switch (logState.get(caller)) {
      case null List.empty<LogTypes.DailyLog>();
      case (?l) l;
    };

    let cycleLength : Nat = if (cycleList.isEmpty()) 28 else {
      let records = sortedRecords(cycleList);
      records[records.size() - 1].cycleLengthDays;
    };

    let avgLength = getAverageLength(cycleList);

    // Average pain level from logs
    let painLogs = logList.filter(func(l) = (switch (l.painLevel) { case (?_) true; case null false }));
    let avgPainLevel : Float = if (painLogs.isEmpty()) 0.0 else {
      let total = painLogs.foldLeft(0, func(acc, l) {
        let pain = switch (l.painLevel) { case (?p) p; case null 0 };
        acc + pain
      });
      total.toFloat() / painLogs.size().toFloat();
    };

    // Common symptoms: count frequency
    let symptomCounts = Map.empty<Text, Nat>();
    logList.forEach<LogTypes.DailyLog>(func(l) {
      for (s in l.symptoms.values()) {
        let current = switch (symptomCounts.get(s)) { case (?n) n; case null 0 };
        symptomCounts.add(s, current + 1);
      };
    });
    // Get top symptoms sorted by count
    let symptomList = List.fromIter<(Text, Nat)>(symptomCounts.entries());
    let sortedSymptoms = symptomList.sort(func(a, b) = if (a.1 > b.1) #less else if (a.1 < b.1) #greater else #equal);
    let commonSymptoms = sortedSymptoms.map(func(s) = s.0).toArray();
    let topSymptoms = if (commonSymptoms.size() > 5) commonSymptoms.sliceToArray(0, 5) else commonSymptoms;

    // Pattern insight
    let avgLengthNat2 : Nat = if (cycleList.isEmpty()) 28 else {
      let total = cycleList.foldLeft(0, func(acc, r) = acc + r.cycleLengthDays);
      total / cycleList.size();
    };
    let diffFloat = cycleLength.toFloat() - avgLength;
    let patternInsight = if (diffFloat > 2.0) {
      "This cycle is slightly longer than your average of " # avgLengthNat2.toText() # " days. Minor variations are normal."
    } else if (diffFloat < -2.0) {
      "This cycle is slightly shorter than your average of " # avgLengthNat2.toText() # " days. Minor variations are normal."
    } else {
      "This cycle length is consistent with your personal average of " # avgLengthNat2.toText() # " days."
    };

    let nextSteps = if (avgPainLevel > 7.0) {
      "Consider professional consultation — your average pain level this cycle was notably high."
    } else if (avgPainLevel > 4.0) {
      "Focus on lifestyle adjustments — gentle exercise, heat therapy, and hydration may help manage discomfort."
    } else {
      "Continue monitoring your cycle. You are doing great with consistent tracking!"
    };

    { cycleLength; avgPainLevel; commonSymptoms = topSymptoms; patternInsight; nextSteps };
  };
};
