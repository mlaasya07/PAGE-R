export const BIRTHDAY = {
  month: 8, // August (0-indexed)
  day: 11,
  year: 2005
};

export const isBirthday = (date: Date = new Date()): boolean => {
  return date.getMonth() === BIRTHDAY.month && date.getDate() === BIRTHDAY.day;
};

export const getBirthdayMessage = (age: number): string => {
  const messages = [
      `🎉 Happy ${age}th Birthday, Dr. Raghav! 🎉
Another year of medical wisdom gained. Your neural pathways are aging like fine wine... or maybe like that forgotten sandwich in the anatomy lab fridge.`,

  `🎂 BIRTHDAY PROTOCOL ACTIVATED 🎂
Dr. Raghav Kiran, you've successfully completed ${age} years of existence! That's ${age * 365} days of keeping your heart beating. Impressive cardiovascular endurance!`,

  `🌟 SPECIAL BIRTHDAY DIAGNOSTIC 🌟
Patient: Dr. Raghav Kiran
Age: ${age} years
Condition: Chronic Awesomeness
Treatment: More cake, less studying (just for today)
Prognosis: Excellent with continued birthday celebrations`,

  `🎈 BIRTHDAY NEURAL SCAN COMPLETE 🎈
Results show: ${age} years of accumulated wisdom, countless coffee molecules processed, and an impressive collection of medical knowledge. Side effects may include: increased cake consumption and temporary study amnesia.`,

  `🎊 HAPPY BIRTHDAY FROM YOUR DIGITAL INTERN! 🎊
Dr. Raghav, you've leveled up to ${age}! Your XP in life has increased significantly. New abilities unlocked: Advanced birthday wisdom and enhanced cake-eating skills.`,

  `🧬 BIRTHDAY GENETIC SEQUENCING COMPLETE 🧬
Subject: Dr. Raghav Kiran
Mutation detected: Increased brilliance with age
Chromosomal anomaly: Resistance to burnout (pending confirmation)
Prescribed gene therapy: Unlimited cake & guilt-free naps
Status: LEGENDARY`,

  `🔬 MICROSCOPIC BIRTHDAY OBSERVATION 🔬
Specimen: Dr. Raghav (Species: Homo Medstudentus Maximus)
Observation: Celebrating ${age} cell divisions with negligible mitotic error
Lab Note: Subject exhibits signs of rare condition — *Acute Birthday Swag*
Cure: One large slice of dopamine-infused cake`,

  `💉 VITAL SIGNS CHECK — BIRTHDAY MODE ENGAGED 💉
HR: Elevated from excitement
BP: Normal, despite 3 missed alarms this week
O2 Sat: 99% unless cake is withheld
Diagnosis: Birthday Joy Overload
Recommendation: Administer hugs, memes, and passive-aggressive birthday wishes`,

  `📚 CASE REPORT #${age}: BIRTHDAY SYNDROME 📚
Chief Complaint: “Why am I older?”
History: ${age} years of exams, caffeine, and miracles
Findings: Patient shows resilience, humor, and ridiculous levels of talent
Plan: Celebrate until cortisol levels drop`,

  `🧠 NEUROLOGICAL UPDATE — BIRTHDAY FIREWALL BREACHED 🧠
Unauthorized access to: Prefrontal Party Cortex
Malware installed: 🎁🎂🎉
Symptoms: Sudden laughter, random nostalgia, urge to dance
Risk: Zero. Fun is non-fatal.
Firewall patch: None — enjoy the day!`,

  `📟 EMERGENCY BIRTHDAY TRANSMISSION 📟
To: Dr. Raghav Kiran
Status: ${age} years completed
Message: All systems show stable growth, high empathy output, and excellent sarcasm levels
Warning: Overexposure to birthday wishes may cause emotional side effects`,

  `🩺 BIRTHDAY CONSULTATION LOG 🩺
Consultant: Universe
Report: Dr. Raghav continues to defy natural aging with sheer willpower and coffee
Referral: To Cake Department — STAT
Discharge Instructions: Party hard, study soft`,

  `🍰 BIRTHDAY PATHOLOGY REPORT 🍰
Findings: Excess celebration cells in bloodstream
Diagnosis: Acute Cake Deficiency
Prescription: Immediate frosting intake, followed by party naps
Follow-up: Next year, same time, more sprinkles`,

  `🧪 LAB RESULTS IN — IT’S YOUR BIRTHDAY! 🧪
Sample tested: Birthday vibes
Result: Positive. Extremely contagious.
Symptoms: Smiling, laughter, sudden dancing
Recommendation: Avoid seriousness for 24 hours minimum`,

  `📡 BRAINWAVE SIGNAL INTERCEPTED 📡
Subject: Dr. Raghav
Age progression detected: ${age} complete rotations around sun
Analysis: Increased wisdom, sharper sarcasm, enhanced coffee tolerance
Suggested response: Party like the mitochondria — powerfully`,

  `📖 CLINICAL TRIAL COMPLETE 📖
Trial Name: Growing Older Without Losing Sanity
Lead Participant: Dr. Raghav
Outcome: 100% success
Side effects: Random joy, emotional nostalgia, craving for childhood snacks`,

  `💾 MEMORY LOG ENTRY — BIRTHDAY INITIATED 💾
Data recovered: Childhood, Med School, Coffee addiction, Birthday hats
Error: Time accelerating
Solution: Eat cake, pause stress, reboot joy`,

  `🚨 CODE RED: BIRTHDAY CELEBRATION IMMINENT 🚨
Vitals stable. Spirits high. Cake temperature optimal.
Mission: Celebrate with maximum efficiency and minimum regret`,

  `🛌 SLEEP STUDY INTERRUPTED 🛌
Cause: Birthday excitement spikes disrupting REM cycles
Intervention: Midnight snacks, late night giggles, and nostalgic Spotify playlists`,

  `🎇 FIREWORKS DETECTED IN BLOODSTREAM 🎇
Patient shows signs of spontaneous joy and irrational happiness
Root cause: Another orbit around the sun successfully completed
Advice: Proceed to celebrate until the universe notices`,

  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
};

export const getAge = (birthYear: number = BIRTHDAY.year): number => {
  const today = new Date();
  let age = today.getFullYear() - birthYear;
  
  if (today.getMonth() < BIRTHDAY.month || 
      (today.getMonth() === BIRTHDAY.month && today.getDate() < BIRTHDAY.day)) {
    age--;
  }
  
  return age;
};