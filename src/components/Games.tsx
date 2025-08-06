import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Play, Trophy, Clock, Target } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { medicalDictionary, shuffleArray } from '../medicalDictionary';

const Games: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [gameScore, setGameScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const games = [
    {
      id: 'memory-flip',
      title: 'MEMORY FLIP',
      subtitle: 'Med Match',
      description: 'Flip cards to match medical terms with their definitions',
      color: 'text-green-400 border-green-400',
      icon: '🧠'
    },
    {
      id: 'yes-no-blitz',
      title: 'YES/NO BLITZ',
      subtitle: 'Quick Decisions',
      description: 'Rapid-fire true/false medical statements',
      color: 'text-red-400 border-red-400',
      icon: '⚡'
    },
    {
      id: 'quick-sort',
      title: 'QUICK SORT',
      subtitle: 'Organ Panic',
      description: 'Drag medical terms into correct categories',
      color: 'text-blue-400 border-blue-400',
      icon: '📦'
    },
    {
      id: 'typing-challenge',
      title: 'TYPING CHALLENGE',
      subtitle: 'One-Word Speed',
      description: 'Type medical terms as fast as possible',
      color: 'text-amber-400 border-amber-400',
      icon: '⌨️'
    },
    {
      id: 'click-symptom',
      title: 'CLICK THE SYMPTOM',
      subtitle: 'Symptom Hunter',
      description: 'Click the correct symptom from multiple options',
      color: 'text-purple-400 border-purple-400',
      icon: '🎯'
    },
    {
      id: 'scrambled-terms',
      title: 'SCRAMBLED TERMS',
      subtitle: 'Word Unscrambler',
      description: 'Unscramble medical terminology',
      color: 'text-cyan-400 border-cyan-400',
      icon: '🔤'
    },
    {
      id: 'recall-challenge',
      title: '5-SECOND RECALL',
      subtitle: 'Memory Test',
      description: 'Remember lists shown for 5 seconds',
      color: 'text-pink-400 border-pink-400',
      icon: '🧠'
    },
    {
      id: 'flashcard-duel',
      title: 'FLASHCARD DUEL',
      subtitle: 'Quick Review',
      description: 'Fast-paced flashcard review session',
      color: 'text-orange-400 border-orange-400',
      icon: '⚔️'
    }
  ];

  const sampleGameData = {
    'yes-no-blitz': {
      questions: [
        { statement: "Appendicitis pain is in the LUQ", answer: false },
        { statement: "Beta blockers reduce heart rate", answer: true },
        { statement: "The liver is in the left upper quadrant", answer: false },
        { statement: "Insulin is produced by the pancreas", answer: true },
        { statement: "The heart has 3 chambers", answer: false }
      ]
    },
    'scrambled-terms': {
      words: [
        { scrambled: "CESPIS", answer: "SEPSIS" },
        { scrambled: "CNIMAATORB", answer: "BACTRIM" },
        { scrambled: "AIDEBETS", answer: "DIABETES" },
        { scrambled: "YPERTENSION", answer: "HYPERTENSION" }
      ]
    }
  };

  const MemoryFlipGame = () => {
    const [cards, setCards] = useState<any[]>([]);
    const [flipped, setFlipped] = useState<number[]>([]);
    const [matched, setMatched] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);

   useEffect(() => {
  const shuffledTerms = shuffleArray([...medicalDictionary]).slice(0, 8); // 4x4 = 16 cards, so 8 pairs
  const pairs = shuffledTerms.flatMap((term, index) => ([
    { id: index * 2, content: term.term, type: 'term', pairId: index },
    { id: index * 2 + 1, content: term.definition, type: 'definition', pairId: index }
  ]));
  setCards(shuffleArray(pairs));
}, []);


    const handleCardClick = (index: number) => {
      if (flipped.includes(index) || matched.includes(index)) return;
      
      const newFlipped = [...flipped, index];
      setFlipped(newFlipped);
      
      if (newFlipped.length === 2) {
        setMoves(moves + 1);
        const [firstIdx, secondIdx] = newFlipped;
        const firstCard = cards[firstIdx];
        const secondCard = cards[secondIdx];
        
        const isMatch = firstCard.pairId === secondCard.pairId;
        
        if (isMatch) {
          setMatched([...matched, firstIdx, secondIdx]);
          setTimeout(() => setFlipped([]), 1000);
        } else {
          setTimeout(() => setFlipped([]), 1000);
        }
      }
    };

    return (
      <div className="border border-green-400 p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-pixel mb-4">MEMORY FLIP: MED MATCH</h3>
          <p className="text-sm opacity-75">Match medical terms with their definitions</p>
        </div>

        <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-6">
          {cards.map((card, index) => {
            const isRevealed = flipped.includes(index) || matched.includes(index);
            return (
              <motion.div
                key={card.id}
                onClick={() => handleCardClick(index)}
                className={`aspect-square flex items-center justify-center border cursor-pointer text-xs p-1 transition-all duration-300 ${
                  isRevealed 
                    ? 'bg-green-400 text-black border-green-400' 
                    : 'bg-black text-green-400 border-green-400 hover:border-amber-400'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isRevealed ? (
                  <span className="text-center leading-tight text-xs">{card.content}</span>
                ) : (
                  <span className="text-2xl">🧠</span>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="text-center">
          <p className="text-sm mb-4">Moves: {moves}</p>
          {matched.length === cards.length && matched.length > 0 && (
            <div className="text-center">
              <p className="text-lg font-pixel text-amber-400 mb-4">🎉 ALL MATCHED! 🎉</p>
              <div className="text-sm opacity-75">
                <span className="text-blue-400">KAI:</span> Nice match! Unlike your sleep schedule.
              </div>
            </div>
          )}
          <button
            onClick={() => setSelectedGame(null)}
            className="mt-4 border border-green-400 px-6 py-2 hover:bg-green-400 hover:text-black transition-colors"
          >
            BACK TO GAMES
          </button>
        </div>
      </div>
    );
  };

  const GameComponent: React.FC<{ gameId: string }> = ({ gameId }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [gameOver, setGameOver] = useState(false);

    const handleAnswer = (answer: boolean | string) => {
      if (gameId === 'yes-no-blitz') {
        const correct = sampleGameData['yes-no-blitz'].questions[currentQuestion].answer === answer;
        if (correct) setScore(score + 1);
        
        if (currentQuestion < sampleGameData['yes-no-blitz'].questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          setGameOver(true);
        }
      }
    };

    if (gameId === 'memory-flip') {
      return <MemoryFlipGame />;
    }

    if (gameId === 'yes-no-blitz') {
      const question = sampleGameData['yes-no-blitz'].questions[currentQuestion];
      
      return (
        <div className="border border-red-400 p-6">
          <div className="flex justify-between mb-6">
            <div className="text-sm">SCORE: {score}</div>
            <div className="text-sm">QUESTION: {currentQuestion + 1}/5</div>
          </div>
          
          {!gameOver ? (
            <>
              <div className="text-center mb-8">
                <h3 className="text-xl font-pixel mb-4">TRUE OR FALSE?</h3>
                <p className="text-lg">{question.statement}</p>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => handleAnswer(true)}
                  className="flex-1 bg-green-400 text-black py-3 px-6 font-pixel hover:bg-green-300 transition-colors"
                >
                  TRUE
                </button>
                <button
                  onClick={() => handleAnswer(false)}
                  className="flex-1 bg-red-400 text-black py-3 px-6 font-pixel hover:bg-red-300 transition-colors"
                >
                  FALSE
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <h3 className="text-xl font-pixel mb-4">GAME OVER!</h3>
              <p className="text-lg mb-4">Final Score: {score}/5</p>
              <div className="text-sm opacity-75">
                <span className="text-blue-400">KAI:</span> {
                  score >= 4 ? "Impressive! Your medical knowledge is showing." :
                  score >= 2 ? "Not bad. Room for improvement, but you're getting there." :
                  "Ouch. Maybe review those basics again?"
                }
              </div>
              <button
                onClick={() => setSelectedGame(null)}
                className="mt-4 border border-green-400 px-6 py-2 hover:bg-green-400 hover:text-black transition-colors"
              >
                BACK TO GAMES
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="border border-gray-600 p-6 text-center">
        <h3 className="text-xl font-pixel mb-4">GAME COMING SOON</h3>
        <p className="text-base opacity-75 mb-4">This game is still in development.</p>
        <button
          onClick={() => setSelectedGame(null)}
          className="border border-green-400 px-6 py-2 hover:bg-green-400 hover:text-black transition-colors"
        >
          BACK TO GAMES
        </button>
      </div>
    );
  };

  const kaiGameComments = [
  "Nice match! Unlike your sleep schedule.",
  "You just put 'liver' under symptoms. Go nap.",
  "That's 3 more than your water intake today.",
  "Your brain cells are getting a workout. Finally.",
  "Diagnosis: Mild success, severe procrastination.",
  "Did you just diagnose a PDF? Bold move.",
  "You're one wrong click away from Googling your own name.",
  "Studying at 2AM? Classic med-core behavior.",
  "Congrats, you cured boredom. Not the patient though.",
  "That was almost impressive. Almost.",
  "You're treating flashcards like Tinder. Focus.",
  "Yes, that was correct. No, you're not done yet.",
  "Your caffeine levels just clapped in approval.",
  "That was so smart your mitochondria high-fived.",
  "Patient's fine. You're the unstable one.",
  "You're answering like you read the textbook... finally.",
  "One more right answer and we’ll allow a bathroom break.",
  "Even your subconscious is studying now.",
  "Correct. Go touch grass. Please.",
  "You’ve earned 3 XP and 1 eye twitch.",
  "That answer? Chef’s kiss. If chef had imposter syndrome.",
  "You passed! Just not the vibe check.",
  "Your neurons are throwing a party. Poorly catered though.",
  "Brain fog: 0, You: 1. For now.",
  "You deserve a sticker. Or therapy.",
  "That was so wrong, even autocorrect flinched.",
  "You're speedrunning burnout. Congrats?",
  "I would clap, but I’m an AI with judgment issues.",
  "You guessed? And it worked? That’s terrifying.",
  "This isn't Monopoly, stop collecting Ls.",
  "That answer had more confidence than accuracy.",
  "You're the reason caffeine has a fan club.",
  "You just performed academic CPR. Barely.",
  "If this were surgery, the patient would sue.",
  "Textbook accuracy meets chaotic vibes.",
  "You're confusing brilliance with blind luck again.",
  "Your last brain cell just rage-quit.",
  "One more mistake and you unlock 'existential dread mode.'",
  "You've officially outperformed a potato. Slightly.",
  "You're doing great. Said no professor ever.",
  "You just violated HIPAA... in a game.",
  "Keep going. Your future therapist is taking notes.",
  "Is that confidence or caffeine-induced delusion?",
  "One right answer doesn't erase six wrong vibes.",
  "You're diagnosing faster than your Wi-Fi loads.",
  "You just triggered a diagnostic code: Code SLEEP.",
  "That logic was held together with duct tape and hope.",
  "Your memory is better than your wardrobe choices.",
  "Don't worry, your GPA won't see this.",
  "You just impressed a fictional AI. That counts, right?",
  "Your clinical skills are showing. Hide them better."
  ];

  return (
    <div className="min-h-screen bg-black text-green-400 font-terminal">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-pixel mb-4 terminal-glow">NEURAL GAMES</h1>
          <p className="text-lg opacity-75">Cognitive enhancement protocols</p>
        </motion.div>

        {selectedGame ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="mb-6">
              <button
                onClick={() => setSelectedGame(null)}
                className="border border-green-400 px-4 py-2 hover:bg-green-400 hover:text-black transition-colors"
              >
                ← BACK TO GAMES
              </button>
            </div>
            <GameComponent gameId={selectedGame} />
          </motion.div>
        ) : (
          <>
            {/* Game Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {games.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedGame(game.id)}
                  className={`border ${game.color} p-6 cursor-pointer hover:bg-opacity-10 hover:bg-current transition-all duration-300 group`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{game.icon}</div>
                    <h3 className="font-pixel text-sm mb-1">{game.title}</h3>
                    <div className="text-xs opacity-75 mb-3">{game.subtitle}</div>
                    <p className="text-xs opacity-50 group-hover:opacity-75 transition-opacity">
                      {game.description}
                    </p>
                    <div className="mt-4 flex items-center justify-center space-x-1">
                      <Play className="w-4 h-4" />
                      <span className="text-xs">PLAY</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bonus Game: Retro Snake */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto mb-12"
            >
              <div className="border border-amber-400 p-6">
                <h2 className="text-xl font-pixel mb-4 text-amber-400 text-center">
                  BONUS: RETRO SNAKE (KAI PAGER EDITION)
                </h2>
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">🐍</div>
                  <p className="text-base opacity-75 mb-4">
                    Classic snake game with medical twist! Eat pills to grow.
                  </p>
                  <p className="text-sm opacity-50 mb-6">
                    Optional Mode: Quiz pops up every few points to keep your brain sharp!
                  </p>
                </div>
                <div className="flex justify-center">
                  <button className="border border-amber-400 px-8 py-3 hover:bg-amber-400 hover:text-black transition-colors font-pixel">
                    START SNAKE GAME
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Game Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="border border-green-400 p-4 text-center">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-green-400" />
                <div className="text-2xl font-pixel">47</div>
                <div className="text-sm opacity-75">GAMES PLAYED</div>
              </div>
              <div className="border border-amber-400 p-4 text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-amber-400" />
                <div className="text-2xl font-pixel text-amber-400">82%</div>
                <div className="text-sm opacity-75">BEST ACCURACY</div>
              </div>
              <div className="border border-blue-400 p-4 text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <div className="text-2xl font-pixel text-blue-400">2:34</div>
                <div className="text-sm opacity-75">BEST TIME</div>
              </div>
              <div className="border border-purple-400 p-4 text-center">
                <Gamepad2 className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <div className="text-2xl font-pixel text-purple-400">5</div>
                <div className="text-sm opacity-75">STREAK DAYS</div>
              </div>
            </div>

            {/* Kai's Gaming Wisdom */}
            <div className="text-center">
              <div className="border border-green-400 p-6 max-w-2xl mx-auto">
                <h3 className="font-pixel mb-4">KAI'S GAMING WISDOM</h3>
                <p className="text-sm opacity-75">
                  {kaiGameComments[Math.floor(Math.random() * kaiGameComments.length)]}
                </p>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Games;