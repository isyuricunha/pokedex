'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Trophy } from 'lucide-react';
import { getPokemon, getPokemonArtwork, formatPokemonName } from '@/lib/api/pokeapi';
import { getRandomPokemonId, generateWrongAnswers, shuffleArray, saveQuizScore, updateQuizStreak, getQuizStreak, getHighScores } from '@/lib/utils/quiz';
import { Pokemon } from '@/lib/types/pokemon';

type QuizMode = 'silhouette' | 'stats' | 'type' | 'menu';

export default function QuizPage() {
  const [mode, setMode] = useState<QuizMode>('menu');
  const [currentPokemon, setCurrentPokemon] = useState<Pokemon | null>(null);
  const [options, setOptions] = useState<{ id: number; name: string }[]>([]);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [streak, setStreak] = useState(getQuizStreak());
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const loadNewQuestion = async () => {
    setLoading(true);
    setShowResult(false);
    setSelectedAnswer(null);

    const pokemonId = getRandomPokemonId();
    const wrongIds = generateWrongAnswers(pokemonId);
    
    try {
      const pokemon = await getPokemon(pokemonId);
      const wrongPokemon = await Promise.all(
        wrongIds.map(id => getPokemon(id))
      );

      const allOptions = shuffleArray([
        { id: pokemon.id, name: pokemon.name },
        ...wrongPokemon.map(p => ({ id: p.id, name: p.name }))
      ]);

      setCurrentPokemon(pokemon);
      setOptions(allOptions);
    } catch (error) {
      console.error('Error loading quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (selectedId: number) => {
    if (showResult || !currentPokemon) return;

    setSelectedAnswer(selectedId);
    setShowResult(true);
    setQuestionsAnswered(prev => prev + 1);

    const correct = selectedId === currentPokemon.id;
    if (correct) {
      setScore(prev => prev + 1);
    }

    const newStreak = updateQuizStreak(correct);
    setStreak(newStreak);

    if (questionsAnswered + 1 >= 10) {
      saveQuizScore({
        mode,
        score: correct ? score + 1 : score,
        totalQuestions: 10,
        date: Date.now(),
      });
    }
  };

  const handleNext = () => {
    if (questionsAnswered >= 10) {
      setMode('menu');
      setScore(0);
      setQuestionsAnswered(0);
    } else {
      loadNewQuestion();
    }
  };

  const startQuiz = (quizMode: QuizMode) => {
    setMode(quizMode);
    setScore(0);
    setQuestionsAnswered(0);
    loadNewQuestion();
  };

  useEffect(() => {
    if (mode !== 'menu' && !currentPokemon) {
      loadNewQuestion();
    }
  }, [mode]);

  if (mode === 'menu') {
    const highScores = {
      silhouette: getHighScores('silhouette', 5),
      stats: getHighScores('stats', 5),
      type: getHighScores('type', 5),
    };

    return (
      <div className="min-h-screen bg-bg-primary">
        <header className="sticky top-0 z-50 bg-bg-primary/95 backdrop-blur-sm border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to PokéDex
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-text-primary mb-2">🎮 Pokémon Quiz</h1>
          <p className="text-text-secondary mb-8">Test your Pokémon knowledge!</p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <button
              onClick={() => startQuiz('silhouette')}
              className="bg-bg-secondary border-2 border-border hover:border-accent rounded-2xl p-6 transition-all hover:scale-105"
            >
              <h3 className="text-2xl font-bold text-text-primary mb-2">👤 Silhouette Quiz</h3>
              <p className="text-text-secondary">Guess the Pokémon from its silhouette</p>
            </button>

            <button
              onClick={() => startQuiz('stats')}
              className="bg-bg-secondary border-2 border-border hover:border-accent rounded-2xl p-6 transition-all hover:scale-105"
            >
              <h3 className="text-2xl font-bold text-text-primary mb-2">📊 Stats Quiz</h3>
              <p className="text-text-secondary">Guess the Pokémon from its stats</p>
            </button>

            <button
              onClick={() => startQuiz('type')}
              className="bg-bg-secondary border-2 border-border hover:border-accent rounded-2xl p-6 transition-all hover:scale-105"
            >
              <h3 className="text-2xl font-bold text-text-primary mb-2">⚡ Type Quiz</h3>
              <p className="text-text-secondary">Test your type knowledge</p>
            </button>
          </div>

          {/* Streak Display */}
          <div className="bg-gradient-to-br from-accent/20 to-accent/5 border-2 border-accent/30 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-accent" />
              Your Streak
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-text-secondary text-sm">Current Streak</p>
                <p className="text-3xl font-bold text-accent">{streak.current}</p>
              </div>
              <div>
                <p className="text-text-secondary text-sm">Best Streak</p>
                <p className="text-3xl font-bold text-text-primary">{streak.best}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (loading || !currentPokemon) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-2xl font-bold text-accent animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <header className="sticky top-0 z-50 bg-bg-primary/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setMode('menu')}
              className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Menu
            </button>
            <div className="text-text-primary font-bold">
              Score: {score}/{questionsAnswered} | Streak: {streak.current}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-bg-secondary border border-border rounded-2xl p-8 mb-6">
          <p className="text-center text-text-secondary mb-6">
            Question {questionsAnswered + 1}/10
          </p>

          {mode === 'silhouette' && (
            <div className="relative w-full aspect-square mb-6 bg-bg-primary rounded-2xl overflow-hidden">
              <Image
                src={getPokemonArtwork(currentPokemon.id)}
                alt="Pokemon silhouette"
                fill
                className={`object-contain ${showResult ? '' : 'brightness-0'}`}
              />
            </div>
          )}

          {mode === 'stats' && (
            <div className="mb-6 space-y-2">
              {currentPokemon.stats.map(stat => (
                <div key={stat.stat.name} className="flex justify-between items-center">
                  <span className="text-text-secondary capitalize">{stat.stat.name.replace('-', ' ')}</span>
                  <span className="text-accent font-bold">{stat.base_stat}</span>
                </div>
              ))}
            </div>
          )}

          <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">
            Who's that Pokémon?
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {options.map(option => (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.id)}
                disabled={showResult}
                className={`py-4 px-6 rounded-xl font-medium transition-all ${
                  showResult
                    ? option.id === currentPokemon.id
                      ? 'bg-green-500/20 border-2 border-green-500 text-green-500'
                      : option.id === selectedAnswer
                      ? 'bg-red-500/20 border-2 border-red-500 text-red-500'
                      : 'bg-bg-primary border border-border text-text-secondary'
                    : 'bg-bg-primary border-2 border-border text-text-primary hover:border-accent'
                }`}
              >
                {formatPokemonName(option.name)}
              </button>
            ))}
          </div>

          {showResult && (
            <div className="mt-6">
              <button
                onClick={handleNext}
                className="w-full bg-accent hover:bg-accent/90 text-white py-3 rounded-xl font-bold transition-colors"
              >
                {questionsAnswered >= 10 ? 'Finish Quiz' : 'Next Question'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
