import React from 'react';
import { MessageSquare, Bot, User, Zap, Database, Clock, Trash2, Download } from 'lucide-react';

export default function TranscriptFeed({ turns, onClearTurns }) {

  const handleExportTranscript = () => {
    let text = "==================================================\n";
    text += "ESTATEVOICE CONVERSATIONAL TRANSCRIPT LOG\n";
    text += "==================================================\n\n";

    turns.forEach((t, i) => {
      text += `[Turn ${i+1}]\n`;
      text += `Buyer: ${t.userText}\n`;
      text += `Aria (Agent): ${t.agentResponse}\n`;
      if (t.latency) text += `Latency: ${t.latency}ms | Tool Executed: ${t.tool || 'None'}\n`;
      text += "--------------------------------------------------\n\n";
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Voice_Transcript_Log_${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-panel rounded-2xl p-5 h-full flex flex-col border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          Live Transcript & Telemetry
        </h3>
        
        <div className="flex items-center gap-2">
          {turns.length > 0 && (
            <>
              <button
                onClick={handleExportTranscript}
                className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs border border-slate-700"
                title="Export Transcript Log"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onClearTurns}
                className="p-1 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded transition-colors"
                title="Clear Logs"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
            {turns.length} Turn{turns.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1 max-h-[520px]">
        {turns.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center text-slate-500 text-xs">
            <Bot className="w-8 h-8 mb-2 opacity-40" />
            <p>No active transcript turns logged yet.</p>
            <p className="text-[11px] text-slate-600 mt-1">Click "Start Voice Session" or request a call to talk to Aria.</p>
          </div>
        ) : (
          turns.map((turn, idx) => (
            <div key={idx} className="space-y-2">
              {/* User Turn */}
              <div className="flex gap-3 items-start justify-end">
                <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-2xl rounded-tr-none p-3 max-w-[85%] text-xs text-indigo-100">
                  <div className="flex items-center gap-1.5 font-semibold text-[11px] text-indigo-300 mb-1">
                    <User className="w-3 h-3" /> Buyer
                  </div>
                  <p>{turn.userText}</p>
                </div>
              </div>

              {/* Agent Turn */}
              <div className="flex gap-3 items-start">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 text-white shadow-md">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl rounded-tl-none p-3 max-w-[90%] text-xs text-slate-200">
                  <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400 mb-1">
                    <span className="font-semibold text-slate-200 flex items-center gap-1">
                      Aria Voice Agent
                    </span>
                    <div className="flex items-center gap-2">
                      {turn.latency && (
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" /> {turn.latency}ms
                        </span>
                      )}
                      {turn.tool && (
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 flex items-center gap-1">
                          <Zap className="w-2.5 h-2.5" /> {turn.tool}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="leading-relaxed">{turn.agentResponse}</p>

                  {/* RAG Context Drawer */}
                  {turn.rag && (
                    <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                      <Database className="w-3 h-3 text-sky-400 shrink-0" />
                      <span className="text-sky-300 font-semibold">{turn.rag.category}:</span>
                      <span className="truncate">{turn.rag.content}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
