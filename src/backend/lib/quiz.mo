import Types "../types/quiz";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";

module {
  public type ProgressState = Map.Map<Principal, Types.UserProgress>;

  // Bank of 32 women's health quiz questions
  let questionBank : [Types.QuizQuestion] = [
    {
      id = "q01";
      question = "How many phases does the typical menstrual cycle have?";
      options = ["2", "3", "4", "5"];
      correctIndex = 2;
      explanation = "The menstrual cycle has 4 phases: menstrual, follicular, ovulation, and luteal.";
    },
    {
      id = "q02";
      question = "What is the average length of a menstrual cycle?";
      options = ["21 days", "28 days", "35 days", "14 days"];
      correctIndex = 1;
      explanation = "The average cycle is about 28 days, though 21–35 days is considered normal.";
    },
    {
      id = "q03";
      question = "On which day of a 28-day cycle does ovulation typically occur?";
      options = ["Day 7", "Day 10", "Day 14", "Day 21"];
      correctIndex = 2;
      explanation = "Ovulation typically occurs around day 14 of a 28-day cycle, about 14 days before the next period.";
    },
    {
      id = "q04";
      question = "Which hormone triggers ovulation?";
      options = ["Estrogen", "Progesterone", "Luteinizing hormone (LH)", "FSH"];
      correctIndex = 2;
      explanation = "A surge of Luteinizing Hormone (LH) triggers the release of the egg from the follicle during ovulation.";
    },
    {
      id = "q05";
      question = "How long can sperm survive in the female reproductive tract?";
      options = ["12 hours", "1–2 days", "Up to 5 days", "Up to 10 days"];
      correctIndex = 2;
      explanation = "Sperm can survive up to 5 days in the female reproductive tract, which is why the fertile window spans several days before ovulation.";
    },
    {
      id = "q06";
      question = "What does cervical mucus look like at peak fertility?";
      options = ["Thick and white", "Yellow and clumpy", "Clear and stretchy (like egg white)", "Absent"];
      correctIndex = 2;
      explanation = "At peak fertility around ovulation, cervical mucus becomes clear, slippery, and stretchy — similar to raw egg white.";
    },
    {
      id = "q07";
      question = "Which nutrient is especially important to replenish during menstruation?";
      options = ["Calcium", "Iron", "Vitamin C", "Zinc"];
      correctIndex = 1;
      explanation = "Iron is lost through menstrual blood loss. Iron-rich foods like leafy greens, lentils, and red meat help replenish it.";
    },
    {
      id = "q08";
      question = "What does PMS stand for?";
      options = ["Periodic Menstrual Syndrome", "Premenstrual Syndrome", "Post-Menstrual Stress", "Pre-Monthly Symptoms"];
      correctIndex = 1;
      explanation = "PMS stands for Premenstrual Syndrome — a group of physical and emotional symptoms occurring 1–2 weeks before menstruation.";
    },
    {
      id = "q09";
      question = "Which phase of the cycle is associated with the highest energy levels?";
      options = ["Menstrual", "Follicular / Ovulation", "Luteal", "All phases are equal"];
      correctIndex = 1;
      explanation = "Rising estrogen during the follicular phase and peak estrogen at ovulation create the highest energy and mental clarity in the cycle.";
    },
    {
      id = "q10";
      question = "What mineral helps reduce PMS symptoms like cramps and mood changes?";
      options = ["Calcium", "Iron", "Magnesium", "Sodium"];
      correctIndex = 2;
      explanation = "Magnesium helps relax muscles, reduce cramps, and stabilize mood. It is found in dark leafy greens, nuts, seeds, and dark chocolate.";
    },
    {
      id = "q11";
      question = "Which condition is characterized by tissue growing outside the uterus?";
      options = ["PCOS", "Endometriosis", "Fibroids", "Bacterial vaginosis"];
      correctIndex = 1;
      explanation = "Endometriosis occurs when tissue similar to the uterine lining grows outside the uterus, often causing pain and fertility challenges.";
    },
    {
      id = "q12";
      question = "What is PCOS?";
      options = ["A uterine infection", "A hormonal disorder involving the ovaries", "A type of endometriosis", "A vitamin deficiency"];
      correctIndex = 1;
      explanation = "PCOS (Polycystic Ovary Syndrome) is a hormonal disorder where the ovaries may produce excess androgens and develop small cysts.";
    },
    {
      id = "q13";
      question = "How often is a gynecological checkup recommended for most women?";
      options = ["Every 5 years", "Only when symptoms appear", "Annually or as advised by a doctor", "Every 10 years"];
      correctIndex = 2;
      explanation = "Annual gynecological checkups are recommended for most women to monitor reproductive health, do screenings, and address any concerns early.";
    },
    {
      id = "q14";
      question = "What type of exercise is most suitable during the menstrual phase?";
      options = ["High-intensity interval training", "Heavy weightlifting", "Gentle yoga and walking", "Sprint training"];
      correctIndex = 2;
      explanation = "During menstruation, gentle movement like yoga, stretching, and light walking is ideal to relieve cramps without overexerting the body.";
    },
    {
      id = "q15";
      question = "Which vitamin is especially recommended for women planning pregnancy?";
      options = ["Vitamin B12", "Vitamin D", "Folic acid (Vitamin B9)", "Vitamin K"];
      correctIndex = 2;
      explanation = "Folic acid (Vitamin B9) is crucial before and during early pregnancy to support neural tube development and reduce the risk of birth defects.";
    },
    {
      id = "q16";
      question = "What is the luteal phase primarily dominated by?";
      options = ["Estrogen", "Progesterone", "FSH", "LH"];
      correctIndex = 1;
      explanation = "The luteal phase (after ovulation) is dominated by progesterone, which prepares the uterine lining for potential implantation.";
    },
    {
      id = "q17";
      question = "Heavy menstrual bleeding is medically known as:";
      options = ["Dysmenorrhea", "Amenorrhea", "Menorrhagia", "Menarche"];
      correctIndex = 2;
      explanation = "Menorrhagia is the medical term for abnormally heavy or prolonged menstrual bleeding. Dysmenorrhea refers to painful periods, and amenorrhea is absent periods.";
    },
    {
      id = "q18";
      question = "What is the first menstrual period called?";
      options = ["Menarche", "Menopause", "Menorrhagia", "Metrorrhagia"];
      correctIndex = 0;
      explanation = "Menarche is the term for a girl's first menstrual period, which typically occurs between ages 10 and 16.";
    },
    {
      id = "q19";
      question = "How many days before ovulation does the fertile window typically begin?";
      options = ["1 day", "3 days", "5 days", "7 days"];
      correctIndex = 2;
      explanation = "Because sperm can survive up to 5 days, the fertile window begins 5 days before ovulation. Having intercourse in this window maximizes conception chances.";
    },
    {
      id = "q20";
      question = "Reducing caffeine intake can help with which menstrual symptom?";
      options = ["Heavy bleeding", "Breast tenderness and PMS anxiety", "Irregular cycles", "Iron deficiency"];
      correctIndex = 1;
      explanation = "Caffeine can intensify breast tenderness and anxiety associated with PMS. Reducing intake in the luteal phase may help ease these symptoms.";
    },
    {
      id = "q21";
      question = "Which food group is most beneficial during the luteal phase for mood stability?";
      options = ["Refined sugars", "Complex carbohydrates (oats, whole grains, sweet potato)", "Fried foods", "Carbonated drinks"];
      correctIndex = 1;
      explanation = "Complex carbohydrates stabilize blood sugar, which helps regulate mood fluctuations and energy crashes common in the luteal phase.";
    },
    {
      id = "q22";
      question = "What is amenorrhea?";
      options = ["Painful periods", "Absence of menstruation", "Heavy periods", "Irregular periods"];
      correctIndex = 1;
      explanation = "Amenorrhea refers to the absence of menstrual periods. Primary amenorrhea means periods have never started; secondary means they have stopped.";
    },
    {
      id = "q23";
      question = "How long is the typical menstrual bleeding phase?";
      options = ["1–2 days", "2–7 days", "8–10 days", "14 days"];
      correctIndex = 1;
      explanation = "Menstrual bleeding typically lasts 2–7 days, with 3–5 days being most common. Anything consistently outside this range may be worth discussing with a doctor.";
    },
    {
      id = "q24";
      question = "Which of the following is a sign of ovulation?";
      options = ["Heavy bleeding", "Clear, egg-white cervical mucus", "Thick, white discharge", "No symptoms"];
      correctIndex = 1;
      explanation = "Clear, stretchy, egg-white cervical mucus is a classic sign of ovulation. It helps sperm travel to the egg.";
    },
    {
      id = "q25";
      question = "What does basal body temperature (BBT) tracking help identify?";
      options = ["Menstrual flow volume", "Ovulation (temperature rises slightly after ovulation)", "Hormone levels", "Cervical health"];
      correctIndex = 1;
      explanation = "BBT rises slightly (0.2–0.5°C) after ovulation due to progesterone. Tracking BBT over months helps identify ovulation patterns.";
    },
    {
      id = "q26";
      question = "Which lifestyle factor most commonly disrupts menstrual cycle regularity?";
      options = ["Drinking water", "Chronic stress", "Regular sleep", "Moderate exercise"];
      correctIndex = 1;
      explanation = "Chronic stress elevates cortisol, which can suppress reproductive hormones and disrupt cycle regularity. Stress management is important for menstrual health.";
    },
    {
      id = "q27";
      question = "Omega-3 fatty acids, found in salmon and flaxseed, benefit menstrual health by:";
      options = ["Increasing estrogen", "Reducing inflammation and cramps", "Stopping periods", "Increasing iron levels"];
      correctIndex = 1;
      explanation = "Omega-3 fatty acids have anti-inflammatory properties that can reduce the production of prostaglandins responsible for menstrual cramps.";
    },
    {
      id = "q28";
      question = "When is it appropriate to seek medical advice about your period?";
      options = ["Never — periods are always normal", "Only if bleeding lasts more than 14 days", "If you experience severe pain, very heavy bleeding, or periods stop unexpectedly", "Only after age 40"];
      correctIndex = 2;
      explanation = "Severe pain, unusually heavy bleeding, or unexpected absence of periods are all signs worth discussing with a healthcare provider to rule out underlying conditions.";
    },
    {
      id = "q29";
      question = "What is perimenopause?";
      options = ["The first menstrual period", "The transition period leading up to menopause", "A type of PMS", "Menstruation during pregnancy"];
      correctIndex = 1;
      explanation = "Perimenopause is the transitional phase before menopause, typically beginning in the mid-40s, characterized by hormonal fluctuations and irregular cycles.";
    },
    {
      id = "q30";
      question = "How does the thyroid gland affect menstrual health?";
      options = ["It has no effect on periods", "Both underactive and overactive thyroid can cause irregular periods", "Only an overactive thyroid affects periods", "Thyroid only affects bone health"];
      correctIndex = 1;
      explanation = "Both hypothyroidism and hyperthyroidism can disrupt menstrual regularity. The thyroid plays a key role in hormonal balance throughout the body.";
    },
    {
      id = "q31";
      question = "Which of the following best describes the follicular phase?";
      options = ["After ovulation, body prepares for pregnancy", "Uterine lining sheds", "Follicles develop and estrogen rises, preparing for ovulation", "Progesterone peaks"];
      correctIndex = 2;
      explanation = "In the follicular phase (overlapping with menstruation and continuing after), follicles in the ovaries develop and estrogen rises, thickening the uterine lining.";
    },
    {
      id = "q32";
      question = "What is a normal range for cycle length?";
      options = ["Exactly 28 days", "25–30 days", "21–35 days", "14–28 days"];
      correctIndex = 2;
      explanation = "A menstrual cycle between 21 and 35 days is considered within the normal range. The 28-day cycle is an average, not a strict standard.";
    },
  ];

  func todayDateText() : Text {
    let now = Time.now();
    let secondsSinceEpoch : Int = now / 1_000_000_000;
    let daysSinceEpoch : Int = secondsSinceEpoch / 86400;
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

  public func getDailyQuizzes() : [Types.QuizQuestion] {
    // Rotate based on current day to serve different 10 questions each day
    let now : Int = Time.now();
    let secondsSinceEpoch : Int = now / 1_000_000_000;
    let daysSinceEpoch : Int = secondsSinceEpoch / 86400;
    let dayIndex : Nat = Int.abs(daysSinceEpoch);
    let total = questionBank.size(); // 32
    let start = (dayIndex * 10) % total;
    let result = Array.tabulate(10, func(i) {
      questionBank[(start + i) % total];
    });
    result;
  };

  func findQuestion(id : Text) : ?Types.QuizQuestion {
    questionBank.find<Types.QuizQuestion>(func(q) = (q.id == id));
  };

  public func submitQuizAnswer(
    state : ProgressState,
    caller : Principal,
    questionId : Text,
    selectedIndex : Nat,
  ) : Types.QuizResult {
    let question = switch (findQuestion(questionId)) {
      case null Runtime.trap("Question not found: " # questionId);
      case (?q) q;
    };

    let correct = selectedIndex == question.correctIndex;
    let pointsEarned : Nat = if (correct) 10 else 0;
    let today = todayDateText();

    let current = switch (state.get(caller)) {
      case (?p) p;
      case null ({
        totalPoints = 0;
        quizzesCompletedToday = 0;
        lastQuizDate = "";
        totalCompleted = 0;
      });
    };

    let todayCount = if (current.lastQuizDate == today) current.quizzesCompletedToday else 0;

    let updated : Types.UserProgress = {
      totalPoints = current.totalPoints + pointsEarned;
      quizzesCompletedToday = todayCount + 1;
      lastQuizDate = today;
      totalCompleted = current.totalCompleted + 1;
    };
    state.add(caller, updated);

    { correct; explanation = question.explanation; pointsEarned };
  };

  public func getUserProgress(
    state : ProgressState,
    caller : Principal,
  ) : Types.UserProgress {
    let today = todayDateText();
    switch (state.get(caller)) {
      case null ({
        totalPoints = 0;
        quizzesCompletedToday = 0;
        lastQuizDate = today;
        totalCompleted = 0;
      });
      case (?p) {
        // Reset daily count if last quiz was on a different day
        if (p.lastQuizDate != today) {
          { p with quizzesCompletedToday = 0; lastQuizDate = today };
        } else p;
      };
    };
  };
};
