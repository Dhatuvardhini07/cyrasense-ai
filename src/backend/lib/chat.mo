import Types "../types/chat";
import Common "../types/common";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";

module {
  public type State = Map.Map<Principal, List.List<Types.ChatMessage>>;

  // Rule-based response engine for women's health topics
  type TopicRule = { keywords : [Text]; response : Text };

  let topicRules : [TopicRule] = [
    {
      keywords = ["menstrual cycle", "period", "monthly cycle", "cycle length", "cycle days"];
      response = "The menstrual cycle is a monthly series of changes your body goes through in preparation for the possibility of pregnancy. A typical cycle lasts 21–35 days, with bleeding lasting 2–7 days. Tracking your cycle helps you understand your body's unique patterns and predict upcoming periods.";
    },
    {
      keywords = ["ovulation", "ovulate", "ovulat"];
      response = "Ovulation is the release of a mature egg from the ovary, typically occurring around day 14 of a 28-day cycle. Signs of ovulation include a slight rise in basal body temperature, changes in cervical mucus (becoming clear and stretchy), and mild pelvic pain. Ovulation is when fertility is highest.";
    },
    {
      keywords = ["fertile window", "fertility", "fertile days", "best time to conceive"];
      response = "Your fertile window spans about 6 days — the 5 days before ovulation and the day of ovulation itself. Sperm can survive up to 5 days in the reproductive tract, so intercourse in this window maximizes the chance of conception. Tracking ovulation signs helps identify this window accurately.";
    },
    {
      keywords = ["pcos", "polycystic", "polycystic ovary"];
      response = "Polycystic Ovary Syndrome (PCOS) is a hormonal condition affecting women of reproductive age. Common signs include irregular periods, excess androgen levels, and small cysts on the ovaries. Management includes lifestyle changes, balanced nutrition, regular exercise, and medical guidance from a gynecologist. If you suspect PCOS, consult a healthcare professional for proper diagnosis.";
    },
    {
      keywords = ["endometriosis", "endometrial"];
      response = "Endometriosis occurs when tissue similar to the uterine lining grows outside the uterus, often causing pelvic pain, painful periods, and sometimes fertility challenges. It is a real medical condition that deserves proper diagnosis and care. If you experience severe cramps, heavy bleeding, or chronic pelvic pain, please consult a gynecologist.";
    },
    {
      keywords = ["pms", "premenstrual syndrome", "premenstrual", "mood swings before period"];
      response = "Premenstrual Syndrome (PMS) refers to physical and emotional symptoms that occur 1–2 weeks before your period. Common symptoms include bloating, breast tenderness, mood changes, fatigue, and food cravings. Gentle exercise, adequate sleep, reducing caffeine and salt, and stress management can help ease PMS symptoms.";
    },
    {
      keywords = ["pregnancy", "pregnant", "am i pregnant", "conception"];
      response = "Pregnancy begins when a fertilized egg implants in the uterine lining. Early signs include a missed period, tender breasts, nausea, fatigue, and frequent urination. A home pregnancy test can detect pregnancy as early as the first day of a missed period. For certainty and guidance, consult a healthcare provider.";
    },
    {
      keywords = ["nutrition", "food", "diet", "eating", "what to eat"];
      response = "Nutrition during your cycle matters. During menstruation, focus on iron-rich foods (leafy greens, lentils, red meat) to replenish blood loss. In the follicular phase, fresh fruits and vegetables support energy. Around ovulation, antioxidant-rich foods are beneficial. In the luteal phase, magnesium-rich foods (nuts, seeds, dark chocolate) help reduce PMS symptoms. Staying hydrated throughout the cycle is essential.";
    },
    {
      keywords = ["exercise", "workout", "physical activity", "yoga", "movement"];
      response = "Exercise benefits vary by cycle phase. During menstruation, gentle yoga, walking, or stretching is ideal — avoid intense exertion if cramps are severe. The follicular and ovulation phases are great for higher-intensity workouts as energy is naturally higher. The luteal phase suits moderate activity like swimming, pilates, or light strength training. Always listen to your body.";
    },
    {
      keywords = ["pain", "cramps", "dysmenorrhea", "painful period", "period pain"];
      response = "Menstrual cramps (dysmenorrhea) are caused by uterine contractions triggered by prostaglandins. Mild to moderate cramps are common and normal. Relief methods include heat therapy (heating pad on the lower abdomen), gentle exercise, hydration, and over-the-counter pain relievers if needed. If pain is severe, disrupts daily life, or doesn't respond to usual relief, consult a doctor as it may indicate an underlying condition.";
    },
    {
      keywords = ["irregular period", "irregular cycle", "missed period", "late period", "delayed period"];
      response = "Irregular periods can result from many factors: stress, significant weight changes, intense exercise, thyroid disorders, PCOS, or transitional life stages. Occasional irregularity is common. If your cycle is consistently irregular over several months, or if you experience no period for 3+ months (and are not pregnant), it is worth consulting a healthcare professional to identify the cause.";
    },
    {
      keywords = ["spotting", "light bleeding", "breakthrough bleeding"];
      response = "Spotting between periods can occur for various reasons including hormonal fluctuations, implantation (in early pregnancy), ovulation, or other factors. Occasional spotting is often harmless, but persistent or unexplained spotting should be evaluated by a healthcare provider.";
    },
    {
      keywords = ["vaginal discharge", "discharge", "cervical mucus", "white discharge"];
      response = "Vaginal discharge is a normal part of reproductive health. It changes throughout the cycle: clear and stretchy around ovulation, thicker and white in the luteal phase. Abnormal discharge — if it has a strong odor, unusual color (yellow/green), or is accompanied by itching — may indicate an infection and warrants medical attention.";
    },
    {
      keywords = ["hygiene", "menstrual hygiene", "period hygiene", "sanitary", "tampon", "pad", "menstrual cup"];
      response = "Good menstrual hygiene is important for comfort and health. Change pads or tampons every 4–6 hours. Menstrual cups can be worn up to 12 hours. Wash hands before and after changing products. Choose breathable cotton underwear. Avoid scented products in the vaginal area. Proper hygiene reduces the risk of infection and discomfort.";
    },
    {
      keywords = ["stress", "anxiety", "mental health", "emotional", "mood"];
      response = "Stress and emotional wellbeing are closely connected to menstrual health. Chronic stress can disrupt hormonal balance and affect cycle regularity. Practices like mindfulness, deep breathing, adequate sleep, and gentle movement support both mental and reproductive health. It is completely valid for your emotional state to vary across your cycle.";
    },
    {
      keywords = ["sleep", "insomnia", "rest", "fatigue", "tired"];
      response = "Sleep quality can fluctuate throughout the menstrual cycle. Progesterone in the luteal phase can cause drowsiness, while hormonal shifts before menstruation may disrupt sleep. Aim for 7–9 hours per night. A consistent sleep schedule, reducing screen time before bed, and keeping your room cool can help improve sleep quality.";
    },
    {
      keywords = ["perimenopause", "menopause", "hot flash", "hot flush"];
      response = "Perimenopause is the transition period before menopause, typically beginning in the mid-40s, during which hormone levels fluctuate. Symptoms include irregular periods, hot flashes, sleep changes, and mood shifts. Menopause is confirmed after 12 consecutive months without a period. A healthcare provider can guide you through this transition with appropriate support.";
    },
    {
      keywords = ["thyroid", "thyroid health", "hypothyroid", "hyperthyroid"];
      response = "The thyroid gland plays a significant role in regulating menstrual health. Both hypothyroidism (underactive) and hyperthyroidism (overactive) can cause irregular periods, heavy bleeding, or missed periods. If you suspect a thyroid issue alongside menstrual irregularities, a blood test can help identify thyroid function. Consult a healthcare professional for evaluation.";
    },
    {
      keywords = ["weight", "body weight", "bmi", "underweight", "overweight"];
      response = "Body weight can influence menstrual health. Both low body weight and obesity can disrupt hormonal balance and affect cycle regularity. Significant, rapid weight changes often impact periods. Maintaining a balanced diet, regular physical activity, and a healthy relationship with food supports overall reproductive health. For personalized guidance, consult a healthcare provider.";
    },
    {
      keywords = ["vitamin", "supplement", "iron", "folic acid", "omega", "magnesium"];
      response = "Certain nutrients are particularly important for reproductive health. Iron supports recovery from menstrual blood loss. Folic acid is essential for those planning pregnancy. Magnesium may help reduce PMS symptoms. Omega-3 fatty acids support hormonal balance. Vitamin D plays a role in overall hormonal function. Always consult a healthcare provider before starting supplements.";
    },
    {
      keywords = ["birth control", "contraception", "pill", "iud", "contraceptive"];
      response = "Various contraceptive methods are available, each working differently. Hormonal methods (pills, patches, hormonal IUDs) regulate hormones and can affect cycle patterns. Barrier methods do not affect hormones. Choosing the right method depends on your health, lifestyle, and goals. Consult a gynecologist for personalized guidance on contraceptive options.";
    },
    {
      keywords = ["trying to conceive", "ttc", "getting pregnant", "infertility"];
      response = "When trying to conceive, tracking your cycle to identify the fertile window is a great first step. Track ovulation signs: basal body temperature, cervical mucus changes, and timing relative to your cycle length. Maintaining a healthy lifestyle, reducing stress, and taking folic acid are recommended. If you have been trying for 12 months (or 6 months if over 35) without success, consult a reproductive health specialist.";
    },
    {
      keywords = ["heavy bleeding", "menorrhagia", "heavy period", "flooding"];
      response = "Heavy menstrual bleeding (menorrhagia) is defined as soaking through a pad or tampon every hour for several consecutive hours, or periods lasting longer than 7 days. While some variation is normal, consistently heavy bleeding may indicate fibroids, hormonal imbalance, polyps, or other conditions. Please consult a healthcare provider for evaluation and appropriate management.";
    },
    {
      keywords = ["sexually transmitted", "std", "sti", "infection", "bacterial vaginosis", "yeast infection"];
      response = "Reproductive health includes being aware of infections. Bacterial vaginosis and yeast infections are common and treatable. STIs require proper testing and treatment. If you notice unusual symptoms — abnormal discharge, odor, itching, burning, or sores — consult a healthcare provider for diagnosis. Regular gynecological checkups are an important part of overall health.";
    },
    {
      keywords = ["gynaecologist", "gynecologist", "doctor", "specialist", "see a doctor", "medical advice"];
      response = "Regular gynecological checkups are an important part of your health routine. A gynecologist can help with cycle concerns, family planning, reproductive health, and screenings. If you experience persistent pain, unusual symptoms, or significant changes in your cycle, please make an appointment with a qualified healthcare professional.";
    },
  ];

  func matchResponse(message : Text) : Text {
    let lower = message.toLower();
    for (rule in topicRules.values()) {
      for (keyword in rule.keywords.values()) {
        if (lower.contains(#text keyword)) {
          return rule.response;
        };
      };
    };
    "I focus on women's health topics. Let me assist you within that. You can ask me about your menstrual cycle, ovulation, fertility, PMS, nutrition, exercise, hygiene, or general women's wellness.";
  };

  public func sendChatMessage(
    state : State,
    caller : Principal,
    message : Text,
  ) : async* Text {
    let history = switch (state.get(caller)) {
      case (?list) list;
      case null List.empty<Types.ChatMessage>();
    };
    let now = Time.now();

    let userMsg : Types.ChatMessage = {
      role = "user";
      content = message;
      timestamp = now;
    };
    history.add(userMsg);

    let responseText = matchResponse(message);

    let botMsg : Types.ChatMessage = {
      role = "assistant";
      content = responseText;
      timestamp = now + 1;
    };
    history.add(botMsg);
    state.add(caller, history);

    responseText;
  };

  public func getChatHistory(
    state : State,
    caller : Principal,
  ) : [Types.ChatMessage] {
    switch (state.get(caller)) {
      case null [];
      case (?list) list.toArray();
    };
  };
};
