import Types "../types/selfcare";

module {
  public func getSelfCareForPhase(phase : Text) : [Types.SelfCareItem] {
    let lower = phase.toLower();
    if (lower == "menstrual") {
      [
        {
          phase = "menstrual";
          category = "rest";
          title = "Prioritize Rest & Recovery";
          description = "Your body is working hard during menstruation. Honor your need for rest and gentle self-care.";
          tips = [
            "Allow yourself extra sleep — 8–9 hours if possible",
            "Take short naps if fatigue is strong",
            "Reduce demanding commitments where you can",
            "Use a warm heating pad on your lower abdomen to ease cramps",
            "Wear comfortable, breathable clothing",
          ];
        },
        {
          phase = "menstrual";
          category = "nutrition";
          title = "Iron-Rich & Comforting Foods";
          description = "Replenish nutrients lost during menstruation with iron-rich, anti-inflammatory foods.";
          tips = [
            "Eat leafy greens: spinach, kale, and Swiss chard for iron",
            "Include lentils, beans, and tofu for plant-based iron",
            "Pair iron-rich foods with vitamin C (citrus, bell peppers) for better absorption",
            "Warm soups, stews, and herbal teas are soothing and hydrating",
            "Reduce salt and processed foods to minimize bloating",
            "Dark chocolate (70%+) provides magnesium and can ease cravings",
          ];
        },
        {
          phase = "menstrual";
          category = "movement";
          title = "Gentle Movement";
          description = "Light movement can relieve cramps and boost mood without overexerting your body.";
          tips = [
            "Try restorative or yin yoga: child's pose, supine twist, gentle forward folds",
            "Short, slow walks in fresh air can lift energy gently",
            "Avoid high-intensity workouts if you feel unwell — rest is productive too",
            "Gentle stretching for the lower back and hips can ease discomfort",
            "Deep breathing exercises reduce tension and support relaxation",
          ];
        },
        {
          phase = "menstrual";
          category = "hygiene";
          title = "Menstrual Hygiene Care";
          description = "Consistent hygiene during your period keeps you comfortable and prevents infections.";
          tips = [
            "Change pads or tampons every 4–6 hours",
            "Menstrual cups can be worn up to 12 hours — ensure proper cleaning",
            "Wash hands thoroughly before and after changing products",
            "Avoid scented products or sprays in the vaginal area",
            "Wear breathable cotton underwear",
            "Shower daily or as needed — warm water eases cramps too",
          ];
        },
      ];
    } else if (lower == "follicular" or lower == "ovulation") {
      [
        {
          phase = "follicular";
          category = "energy";
          title = "Harness Your Rising Energy";
          description = "Estrogen is rising and so is your energy and mental clarity. This is a great time for new starts and social engagement.";
          tips = [
            "Take on new projects, set goals, or try something new",
            "Social energy is high — connect with friends or collaborate",
            "Your brain is sharp: ideal for learning, strategizing, and creative work",
            "You may feel more confident and outgoing — lean into it",
            "This phase is great for planning and decision-making",
          ];
        },
        {
          phase = "follicular";
          category = "movement";
          title = "Active & Energizing Exercise";
          description = "Your body is primed for activity. Make the most of higher stamina and motivation.";
          tips = [
            "Cardio workouts: running, cycling, dancing, or HIIT",
            "Strength training is highly effective during this phase",
            "Try group fitness classes for social and physical benefits",
            "Outdoor activities: hiking, swimming, or sports",
            "Gradually increase workout intensity as energy builds",
          ];
        },
        {
          phase = "follicular";
          category = "nutrition";
          title = "Light & Energizing Foods";
          description = "Support your active phase with fresh, nourishing foods.";
          tips = [
            "Fresh fruits and vegetables, especially cruciferous ones (broccoli, cauliflower) support estrogen metabolism",
            "Fermented foods (yogurt, kimchi) support gut health and hormone balance",
            "Lean proteins support muscle recovery from increased exercise",
            "Stay well hydrated — especially if exercising more",
            "Smoothies with greens, berries, and seeds are energizing",
          ];
        },
        {
          phase = "ovulation";
          category = "hygiene";
          title = "Ovulation Phase Hygiene";
          description = "Natural changes in cervical mucus are normal during ovulation. Simple hygiene supports comfort.";
          tips = [
            "Increased discharge around ovulation is normal — clear and stretchy mucus indicates peak fertility",
            "Breathable cotton underwear keeps you comfortable",
            "Avoid douching — the vagina is self-cleaning",
            "Change underwear regularly for freshness",
            "Mild, unscented intimate wash or plain water is sufficient",
          ];
        },
      ];
    } else if (lower == "luteal") {
      [
        {
          phase = "luteal";
          category = "nutrition";
          title = "Nourishing & Calming Nutrition";
          description = "Support your body through the progesterone-dominant phase with foods that ease PMS and stabilize mood.";
          tips = [
            "Magnesium-rich foods: dark leafy greens, pumpkin seeds, almonds, dark chocolate",
            "Reduce caffeine — it can amplify anxiety and breast tenderness",
            "Complex carbohydrates (oats, sweet potato, whole grains) stabilize blood sugar and mood",
            "Omega-3 rich foods (salmon, flaxseed, walnuts) reduce inflammation",
            "Reduce sodium to minimize bloating and water retention",
            "Eat regular, balanced meals to prevent energy crashes",
          ];
        },
        {
          phase = "luteal";
          category = "movement";
          title = "Calming & Moderate Movement";
          description = "Moderate exercise supports mood and reduces PMS while respecting your body's slower pace.";
          tips = [
            "Pilates and yoga are excellent for the luteal phase",
            "Moderate swimming or light cycling are comfortable options",
            "Avoid pushing through exhaustion — rest when needed",
            "Walking in nature can help reduce pre-menstrual anxiety",
            "Stretching and foam rolling support muscle recovery",
          ];
        },
        {
          phase = "luteal";
          category = "wellbeing";
          title = "Emotional & Mental Wellbeing";
          description = "The luteal phase can bring emotional shifts. Nurture your mental health with compassionate practices.";
          tips = [
            "Journaling can help process emotions and track patterns",
            "Mindfulness meditation, even 10 minutes daily, reduces PMS-related anxiety",
            "Set gentle boundaries with your schedule — it is okay to slow down",
            "Warm baths with Epsom salts soothe muscles and calm the mind",
            "Connect with supportive friends or family",
            "Get to bed earlier as progesterone can increase fatigue",
          ];
        },
        {
          phase = "luteal";
          category = "hygiene";
          title = "Preparing for Your Next Period";
          description = "Get ready for menstruation with simple hygiene and self-care preparation.";
          tips = [
            "Stock up on menstrual products so you are prepared",
            "Keep a change of underwear and supplies accessible",
            "Wear comfortable clothing as bloating may increase",
            "Maintain consistent hygiene routines",
            "If acne is a concern in this phase, a gentle skincare routine can help",
          ];
        },
      ];
    } else {
      // Default: general women's health self-care
      [
        {
          phase = "general";
          category = "wellness";
          title = "Everyday Women's Wellness";
          description = "General self-care habits that support your health throughout every phase of your cycle.";
          tips = [
            "Track your cycle consistently for better personal insights",
            "Stay well hydrated — aim for 8 glasses of water daily",
            "Prioritize 7–9 hours of quality sleep",
            "Engage in regular physical activity you enjoy",
            "Maintain a balanced diet rich in whole foods",
            "Schedule regular gynecological checkups",
            "Manage stress through mindfulness, movement, or creative outlets",
          ];
        },
      ];
    };
  };
};
