"use client";

import { useState } from 'react';

export default function Home() {
  const [equation, setEquation] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      const { a, b, d, isSimpleRecurrence, isLinearRecurrence } = parseRecurrence(equation);
      let solution;

      if (isLinearRecurrence) {
        solution = solveLinearRecurrence();
      } else {
        solution = solveRecurrenceUsingMastersTheorem(a, b, d, isSimpleRecurrence);
      }
      setResult(solution);
    } catch (error) {
      setResult('Invalid input. Please enter in the form T(N) = aT(N/b) + O(N^d), T(N) = aT(N) + O(N^d), or T(N) = c_1T(N-1) + c_2T(N-2) + ... + O(1).');
    }
  };

  const parseRecurrence = (equation) => {
    const regexWithB = /T\(N\)\s*=\s*(\d*)T\(N\/(\d+)\)\s*\+\s*O\(N(?:\^(\d+))?\)/; // Matches T(N) = aT(N/b) + O(N^d)
    const regexWithoutB = /T\(N\)\s*=\s*(\d*)T\(N\)\s*\+\s*O\(N(?:\^(\d+))?\)/; // Matches T(N) = aT(N) + O(N^d)
    const regexSimple = /T\(N\)\s*=\s*T\(N\/(\d+)\)\s*\+\s*O\(1\)/; // Matches T(N) = T(N/b) + O(1)
    const regexLinear = /T\(N\)\s*=\s*((?:c_\d+T\(N-\d+\)\s*\+\s*)*O\(1\))/; // Matches linear recurrences like T(N) = c_1T(N-1) + c_2T(N-2) + ... + O(1)

    let match = equation.match(regexWithB);
    if (match) {
      const a = match[1] ? parseInt(match[1], 10) : 1;
      const b = parseInt(match[2], 10);
      const d = match[3] ? parseInt(match[3], 10) : 1;
      return { a, b, d, isSimpleRecurrence: false, isLinearRecurrence: false };
    }

    match = equation.match(regexWithoutB);
    if (match) {
      const a = match[1] ? parseInt(match[1], 10) : 1;
      const d = match[2] ? parseInt(match[2], 10) : 1;
      return { a, b: 1, d, isSimpleRecurrence: true, isLinearRecurrence: false };
    }

    match = equation.match(regexSimple);
    if (match) {
      const b = parseInt(match[1], 10);
      return { a: 1, b, d: 0, isSimpleRecurrence: false, isLinearRecurrence: false };
    }

    match = equation.match(regexLinear);
    if (match) {
      return { a: 1, b: 1, d: 0, isSimpleRecurrence: false, isLinearRecurrence: true }; // Treating linear recurrences as having a constant cost
    }

    throw new Error('Invalid format');
  };

  const solveRecurrenceUsingMastersTheorem = (a, b, d, isSimpleRecurrence) => {
    const logBA = Math.log(a) / Math.log(b); // Calculate log_b(a)

    if (isSimpleRecurrence) {
      if (a === 1) {
        return `O(N^${d})`; // Case where a = 1
      } else {
        return `O(${a}^N * N^${d})`; // Case where a > 1
      }
    }

    if (logBA > d) {
      return `Divide and Conquer Recurrence: O(N^${logBA.toFixed(2)})`; // Case 1
    } else if (logBA === d) {
      return `Divide and Conquer Recurrence: O(N^${d} * log N)`; // Case 2
    } else {
      return `Divide and Conquer Recurrence: O(N^${d})`; // Case 3
    }
  };

  const solveLinearRecurrence = () => {
    return `This is a linear recurrence relation. The solution typically involves solving the characteristic equation.`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-6 shadow-md">
        <h1 className="text-3xl font-extrabold text-center tracking-wide">Recurrence Relation Solver</h1>
        <p className="text-center text-lg mt-2">Solve recurrence relations using Master&apos;s Theorem!</p>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center py-8">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <label htmlFor="equation" className="text-lg font-semibold mb-2 text-gray-700">
              Enter Recurrence Relation:
            </label>
            <input
              type="text"
              id="equation"
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
              placeholder="e.g., T(N) = 3T(N/2) + O(1)"
              className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />

            <button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-4 rounded-md shadow-lg hover:from-pink-500 hover:to-purple-500 transition duration-300">
              Solve
            </button>
          </form>

          {result && (
            <div className="mt-6 bg-gray-50 p-4 rounded-md shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Solution</h2>
              <p className="text-gray-700">{result}</p>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-4 text-center shadow-inner">
        <p>&copy; {new Date().getFullYear()} Recurrence Solver. All rights reserved.</p>
      </footer>
    </div>
  );
}
