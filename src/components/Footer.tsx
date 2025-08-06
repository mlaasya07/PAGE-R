import React, { useEffect, useState } from 'react';
import { Heart, Coffee, Brain } from 'lucide-react';

const taglines = [
  "This pager never sleeps.",
  "Page before panic.",
  "You are not your last mistake.",
  "Brain. Heart. Gut.",
  "Interns make it worse.",
  "Vitals don't lie. Doctors do.",
  "Grey skies, Grey’s nights.",
  "Trust the labs. Doubt the patient.",
  "Check pulse, then ego.",
  "Page once. Pray twice.",
  "Rounds. Regret. Repeat.",
  "Where caffeine ends, chaos begins.",
  "Patients first, pizza second.",
  "This is your callroom cry.",
  "Vitals stable. Sanity questionable.",
  "On call. Off limits.",
  "Scrub in. Suck it up.",
  "Pain is subjective. Charts aren't.",
  "Bleed less. Breathe more.",
  "No code is ever routine.",
  "Happiness is post-call sleep.",
  "Stat doesn’t mean instant.",
  "This isn’t Grey’s. It’s worse.",
  "You can’t chart that feeling.",
  "Trust the pain, not the face.",
  "You live. You page. You cry.",
  "Rounds never end.",
  "That’s not coffee, that’s survival.",
  "Clinically dead inside.",
  "Diagnose now. Cry later.",
  "Your mistake just beeped.",
  "Vitals say no. Nurse says run.",
  "Where sarcasm meets science.",
  "Paging Dr. Chaos.",
  "Laughter’s not chartable.",
  "Welcome to the no-sleep zone.",
  "Trust me, I watched House.",
  "IV in. Regret out.",
  "Signs vague. Prognosis worse.",
  "It’s never lupus. Until it is.",
  "CT before CPR.",
  "If in doubt, MRI it out.",
  "The spleen is never innocent.",
  "Don’t trust normal vitals.",
  "This is your friendly panic.",
  "Hope isn't a treatment plan.",
  "Vitals dropped? So did my will.",
  "Chart first, scream later.",
  "Caffeine counts as hydration.",
  "Sleep is a myth.",
  "Paging dignity… lost in trauma bay.",
  "Take a breath. Just not theirs.",
  "Vitals are a suggestion.",
  "Ethics on standby.",
  "This is your emotional support footer.",
  "Mask on. Feelings off.",
  "That sound? Probably me dying.",
  "Stable ≠ safe.",
  "Rounds: where joy goes to die.",
  "Paging someone competent...",
  "There's a code for that.",
  "You can’t intubate that attitude.",
  "Triage your feelings.",
  "Don’t check vitals, check vibes.",
  "Blood pressure? More like plot pressure.",
  "Tachycardic and terrified.",
  "Vitals are the vibes of medicine.",
  "Emotionally bradycardic.",
  "This is your brain on night shift.",
  "You can't discharge trauma.",
  "Code Blue? More like Code Meh.",
  "Diagnosis: chronic overthinking.",
  "Please hold, your life is buffering.",
  "Charting: the silent scream.",
  "Vitals trending toward doom.",
  "Burnout in progress.",
  "Sanity: PRN.",
  "Doctor of sarcasm, MD.",
  "If sarcasm cured, I’d be God.",
  "This hospital runs on regret.",
  "Where dreams go to crash.",
  "Pulse? Optional. Coffee? Not.",
  "Vitals calibrated. Sanity pending.",
  "Memory intact. Ego bruised.",
  "Running on 2 hours of sleep and 3 espresso shots.",
  "404: Diagnosis not found.",
  "Trust me, I'm almost a doctor.",
  "Caffeine: Stat. Hope: Low.",
  "Clinical chaos in progress.",
  "Vitals. Vices. Vengeance.",
  "Emotionally unavailable, medically trained.",
  "Today's diagnosis: Imposter Syndrome.",
  "Operating at 60% sarcasm, 40% cortisol.",
  "Neurons firing. Morals rewiring.",
  "More stable than the patient. Barely.",
  "Surgeon by title, disaster by habit.",
  "Vitals normal, ethics questionable.",
  "License pending emotional regulation.",
  "Dreaming of scalpels and salary.",
  "Heartbeat steady. Schedule unholy.",
  "Still not your therapist.",
  "Trying not to flatline today.",
  "Brainstorming malpractice-free ideas.",
  "Hoping it’s just a caffeine tremor.",
  "Prescribing rest I’ll never take.",
  "Clinically dead inside. Still practicing.",
  "Resuscitating motivation… please stand by.",
  "Definitely not in this for the money.",
  "Between rounds and breakdowns.",
  "Exams passed. Emotions failed.",
  "Every patient is a mystery. So am I.",
  "Do no harm. Unless provoked.",
  "Paging sanity... no response.",
  "Trained for emergencies. Not emotions.",
  "Still better than WebMD.",
  "Vital signs good. Life choices bad.",
  "Sleep-deprived, yet slightly qualified.",
  "Running on sarcasm and saline.",
  "More drama than the ICU.",
  "Conscious but not coherent.",
  "Wearing scrubs to hide the chaos.",
  "Medical accuracy not guaranteed.",
  "Half human, half caffeine.",
  "Rebooting bedside manner...",
  "Check pulse. Check pride. Move on.",
  "Diagnosing problems I also have.",
  "Healing others to avoid healing self.",
  "If found unconscious, blame finals.",
  "Scrubbed in. Zoned out.",
  "Empathy.exe has crashed.",
  "Vitals okay. Soul buffering.",
  "Is it burnout or personality?",
  "Laughter is the best medicine. Unless it's sepsis.",
  "Alert but not oriented x3.",
  "Stethoscope on. Hope off.",
  "Living in a medical montage.",
  "Not emotionally available post-call.",
  "Panic: Internally. Professional: Externally.",
  "My coping mechanisms have coping mechanisms.",
  "Beneath this lab coat is a gremlin.",
  "Treating symptoms, ignoring mine.",
  "Second-guessing diagnoses and life choices.",
  "Caffeine: Infused. Reality: Denied.",
  "Here for the scrubs. Stayed for the trauma.",
  "Today's plan: Don’t cry in the supply room.",
  "Cursed with clinical knowledge.",
  "Sweating confidence, bleeding doubt.",
  "Taking vitals, ignoring mine.",
  "Mood: Intubated.",
  "Mentally in Grey Sloan.",
  "Dreamt of charts again. It’s a problem.",
  "Triage my emotions, please.",
  "Anatomy memorized. Feelings, not so much.",
  "Resting doctor face.",
  "I diagnose in my sleep. Literally.",
  "One missed call away from collapse.",
  "Plot twist: It was psych all along.",
  "Technically qualified. Emotionally glitching.",
  "This stethoscope hears my screams.",
  "Compassion in one hand, caffeine in the other.",
  "Vitals: Fine. Me: Debatable.",
  "Paging sense of purpose...",
  "This chart is neater than my life.",
];

const Footer: React.FC = () => {
  const [taglineIndex, setTaglineIndex] = useState<number>(() => {
    return Number(localStorage.getItem("taglineIndex")) || 0;
  });

  useEffect(() => {
    const savedTime = Number(localStorage.getItem("taglineTimestamp")) || 0;
    const now = Date.now();

    // If an hour has passed, update tagline
    if (now - savedTime > 3600000) {
      const newIndex = (taglineIndex + 1) % taglines.length;
      setTaglineIndex(newIndex);
      localStorage.setItem("taglineIndex", String(newIndex));
      localStorage.setItem("taglineTimestamp", String(now));
    }

    // Set a timer to rotate in exactly 1 hour
    const timeout = setTimeout(() => {
      const nextIndex = (taglineIndex + 1) % taglines.length;
      setTaglineIndex(nextIndex);
      localStorage.setItem("taglineIndex", String(nextIndex));
      localStorage.setItem("taglineTimestamp", String(Date.now()));
    }, 3600000); // 1 hour

    return () => clearTimeout(timeout);
  }, [taglineIndex]);

  return (
    <footer className="sticky bottom-0 bg-black border-t border-green-400 font-terminal text-green-400 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span>PAGE-R v11.08.05</span>
            <span className="opacity-50">|</span>
            <span className="opacity-75">Neural Interface Active</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-xs">VITALS: STABLE</span>
            </div>
            <div className="flex items-center space-x-1">
              <Coffee className="w-4 h-4 text-amber-400" />
              <span className="text-xs">CAFFEINE: LOW</span>
            </div>
            <div className="flex items-center space-x-1">
              <Brain className="w-4 h-4 text-blue-400" />
              <span className="text-xs">MEMORY: SYNCED</span>
            </div>
          </div>

          <div className="text-xs opacity-50 italic">
            {taglines[taglineIndex]}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
