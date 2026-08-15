import React, { useState } from 'react';

export default function AIAssistant() {
  const [prompt, setPrompt] = useState('');
  const [taskType, setTaskType] = useState('Lecture Notes Summarizer');
  const [difficulty, setDifficulty] = useState('Medium');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  
  // History of generated items
  const [history, setHistory] = useState([
    {
      id: 1,
      task: 'Quiz Questions Generator',
      topic: 'DBMS B-Trees',
      date: 'Today, 11:30 AM',
    },
    {
      id: 2,
      task: 'Lecture Notes Summarizer',
      topic: 'Data Preprocessing & EDA',
      date: 'Yesterday',
    }
  ]);

  // Quick prompt chips
  const suggestedPrompts = [
    'DBMS B-Trees & B+ Trees',
    'SQL Joins & Normalization',
    'Supervised Learning Regression',
    'Python EDA with Seaborn',
    'Dynamic Programming LCS',
  ];

  // AI Content Generator Handler
  const handleGenerate = (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse('');

    setTimeout(() => {
      let generatedText = '';

      if (taskType === 'Quiz Questions Generator') {
        generatedText = `✨ **AI GENERATED QUIZ QUESTIONS: "${prompt.toUpperCase()}"**\n\n` +
          `**Difficulty:** ${difficulty}\n` +
          `--------------------------------------------------\n\n` +
          `**Q1. What is the main structural advantage of B+ Trees over standard B-Trees?**\n` +
          `a) B+ Trees store data pointers exclusively in leaf nodes, allowing faster sequential scanning.\n` +
          `b) B+ Trees use less disk space.\n` +
          `c) B+ Trees do not require node splitting.\n` +
          `d) B+ Trees eliminate internal nodes completely.\n` +
          `👉 *Correct Answer: a*\n\n` +
          `**Q2. In relational indexing, what is the search time complexity of a balanced m-way search tree?**\n` +
          `a) O(N)\n` +
          `b) O(log_m N)\n` +
          `c) O(N^2)\n` +
          `d) O(1)\n` +
          `👉 *Correct Answer: b*\n\n` +
          `**Q3. Briefly explain the difference between Clustered and Non-Clustered Indexing.**\n` +
          `*Rubric: Award 2 marks if student states clustered index dictates physical row ordering.*`;
      } else if (taskType === 'Lecture Notes Summarizer') {
        generatedText = `✨ **LECTURE SUMMARY & KEY TAKEAWAYS: "${prompt.toUpperCase()}"**\n\n` +
          `**Core Executive Summary:**\n` +
          `This module focuses on optimization strategies for ${prompt}. Key goals include reducing search latency, minimizing memory overhead, and handling scaling in production.\n\n` +
          `📌 **Key Learning Objectives:**\n` +
          `1. Structural properties and node balance invariants.\n` +
          `2. Time complexity derivation for insertions, deletions, and lookup operations.\n` +
          `3. Real-world application in database storage engines (e.g., MySQL InnoDB, PostgreSQL).\n\n` +
          `💡 **Recommended Faculty Talking Points:**\n` +
          `- Draw comparison diagrams between Binary Search Trees vs B-Trees.\n` +
          `- Emphasize disk block I/O efficiency over RAM speed constraints.`;
      } else if (taskType === 'Assignment Rubric Creator') {
        generatedText = `✨ **ASSIGNMENT RUBRIC & GRADING CRITERIA: "${prompt.toUpperCase()}"**\n\n` +
          `**Total Marks:** 20 Marks\n\n` +
          `1. **Correctness & Logic Implementation (10 Marks):**\n` +
          `   - 10 Marks: Flawless algorithm logic with edge cases handled.\n` +
          `   - 5-8 Marks: Minor syntax/logic bugs but overall flow is correct.\n` +
          `   - <5 Marks: Incomplete submission.\n\n` +
          `2. **Time & Space Complexity Report (5 Marks):**\n` +
          `   - Clear derivation of asymptotic bounds.\n\n` +
          `3. **Code Style & Documentation (5 Marks):**\n` +
          `   - Well-commented functions and modular structure.`;
      } else {
        generatedText = `✨ **LESSON PLAN: "${prompt.toUpperCase()}"**\n\n` +
          `**Duration:** 50 Minutes Lecture\n\n` +
          `- **00-10 Mins:** Recap of previous lecture & introductory problem statement.\n` +
          `- **10-30 Mins:** Core concept breakdown of ${prompt} with blackboard/slides.\n` +
          `- **30-40 Mins:** Live code / SQL query execution demo.\n` +
          `- **40-50 Mins:** Q&A session & assignment announcement.`;
      }

      setResponse(generatedText);
      setHistory((prev) => [
        {
          id: Date.now(),
          task: taskType,
          topic: prompt,
          date: 'Just now',
        },
        ...prev,
      ]);
      setLoading(false);
    }, 1200);
  };

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    alert('Copied AI generated content to clipboard!');
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Faculty AI Assistant</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Auto-generate quizzes, lesson plans, and assignment rubrics using AI
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Generator Form (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-5">
          
          <form onSubmit={handleGenerate} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Task Type Dropdown */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Select Task</label>
                <select
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="Lecture Notes Summarizer">Lecture Notes Summarizer</option>
                  <option value="Quiz Questions Generator">Quiz Questions Generator</option>
                  <option value="Assignment Rubric Creator">Assignment Rubric Creator</option>
                  <option value="Lesson Plan Generator">Lesson Plan Generator</option>
                </select>
              </div>

              {/* Topic Keyword Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Topic Keyword / Subject</label>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. DBMS B-Trees, Python EDA, SQL Joins"
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>

            {/* Difficulty Selector for Quizzes */}
            {taskType === 'Quiz Questions Generator' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Difficulty Level</label>
                <div className="flex gap-2">
                  {['Easy', 'Medium', 'Hard'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setDifficulty(lvl)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition ${
                        difficulty === lvl
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Suggested Chips */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-extrabold uppercase text-slate-400">Popular Topics:</p>
              <div className="flex flex-wrap gap-1.5">
                {suggestedPrompts.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPrompt(chip);
                    }}
                    className="px-3 py-1 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-600 text-[11px] font-bold rounded-xl transition active:scale-95"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⚙️</span>
                  <span>AI is Generating Content...</span>
                </>
              ) : (
                <>
                  <span>✨ Generate Content</span>
                </>
              )}
            </button>
          </form>

          {/* AI Response Output Box */}
          {response && (
            <div className="space-y-3 pt-4 border-t border-slate-100 animate-fadeIn">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  ✓ Generated Successfully
                </span>
                
                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                  >
                    📋 Copy Text
                  </button>
                  <button
                    onClick={() => alert('Saved to Content Library!')}
                    className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold text-xs rounded-xl transition"
                  >
                    💾 Save to Library
                  </button>
                </div>
              </div>

              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed whitespace-pre-line max-h-[350px] overflow-y-auto">
                {response}
              </div>
            </div>
          )}

        </div>

        {/* Previous History Log Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-3">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
              Recent AI Generations
            </h3>

            <div className="space-y-2.5">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setPrompt(item.topic);
                    setTaskType(item.task);
                  }}
                  className="p-3 bg-slate-50 hover:bg-indigo-50/60 border border-slate-100 hover:border-indigo-100 rounded-2xl cursor-pointer transition space-y-1"
                >
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-md">
                    {item.task}
                  </span>
                  <p className="text-xs font-bold text-slate-800 line-clamp-1">{item.topic}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{item.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}