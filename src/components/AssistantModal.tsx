import React, { useState } from 'react';
import { 
  X, 
  Bot, 
  Send, 
  Sparkles, 
  HelpCircle, 
  Building2, 
  Loader2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { LandProject } from '../types';

interface AssistantModalProps {
  project: LandProject;
  projectsList: LandProject[];
  onClose: () => void;
  onSelectProject: (id: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  source?: string;
}

export const AssistantModal: React.FC<AssistantModalProps> = ({
  project,
  projectsList,
  onClose,
  onSelectProject,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: `Hello Officer. I am the LandPulse Decision Support Assistant. I am currently calibrated for **${project.code}** (${project.name}). Ask me about specific statutory bottlenecks, pending awards, or legal stays.`,
      source: 'LandPulse AI Core',
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickQuestions = [
    'Why is this project high risk?',
    'Which factor contributes most to the delay?',
    'What should the officer review first?',
    'How has project risk changed over time?',
    'Which projects in Maharashtra are at critical risk?',
  ];

  const handleSend = async (qToSend?: string) => {
    const query = qToSend || inputQuestion.trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: query,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query, projectId: project.id }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-' + Date.now(),
          sender: 'assistant',
          text: data.reply || 'No response generated.',
          source: data.source || 'gemini-3.8-flash',
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-' + Date.now(),
          sender: 'assistant',
          text: `Regarding ${project.code}: Delay risk is driven primarily by ${project.topDrivers[0]?.factor} (+${project.topDrivers[0]?.shapContribution} pts) at the ${project.currentStage} milestone. Direct SLAO intervention is recommended.`,
          source: 'LandPulse Heuristic Fallback',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-2xl w-full h-[600px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">LandPulse AI Assistant</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-bold font-mono">
                  Context: {project.code}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Specialized decision-support advisor for RFCTLARR Act 2013 acquisition procedures
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-100/60 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Suggested:
          </span>
          {quickQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="text-[11px] px-2.5 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-full border border-slate-200 shrink-0 transition-colors text-left"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Message List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white text-slate-800 border border-slate-200 shadow-2xs space-y-1'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
                {m.source && (
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100 flex items-center justify-between">
                    <span>Source: {m.source}</span>
                    <span className="text-slate-400">Non-binding Advisory</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-lg p-3 text-xs flex items-center gap-2 text-slate-500 shadow-2xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                <span>Consulting LandPulse predictive heuristics...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder={`Ask about ${project.code} delay drivers, compensation, or legal references...`}
              disabled={isLoading}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-blue-600"
            />
            <button
              type="submit"
              disabled={!inputQuestion.trim() || isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-md text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
          <div className="text-[10px] text-slate-400 text-center mt-2">
            DoLR AI Assistant runs Gemini models server-side. Predictions are decision-support estimates.
          </div>
        </div>
      </div>
    </div>
  );
};
