import React, { useState } from 'react';
import { Settings, Key, Sliders, Shield, Save, Check } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose }) {
  const [mode, setMode] = useState("local");
  const [openaiKey, setOpenaiKey] = useState("");
  const [elevenlabsKey, setElevenlabsKey] = useState("");
  const [vapiToken, setVapiToken] = useState("");
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md glass-panel rounded-2xl p-6 border border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <h3 className="font-bold text-slate-100 flex items-center gap-2">
            <Settings className="w-4 h-4 text-indigo-400" />
            Voice Pipeline & API Settings
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs">✕</button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Execution Engine Mode
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setMode("local")}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between ${
                  mode === 'local' 
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200' 
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <span className="font-bold">Zero-Cost Local Mode</span>
                <span className="text-[10px] text-slate-400 mt-1">100% Free • Browser Web Speech + Local RAG</span>
              </button>

              <button
                type="button"
                onClick={() => setMode("cloud")}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between ${
                  mode === 'cloud' 
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200' 
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <span className="font-bold">Production API Mode</span>
                <span className="text-[10px] text-slate-400 mt-1">OpenAI + ElevenLabs + Vapi / Twilio</span>
              </button>
            </div>
          </div>

          {mode === 'cloud' && (
            <div className="space-y-3 pt-2 border-t border-slate-800 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 flex items-center gap-1">
                  <Key className="w-3 h-3 text-amber-400" /> OpenAI API Key
                </label>
                <input
                  type="password"
                  placeholder="sk-..."
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-600"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 flex items-center gap-1">
                  <Key className="w-3 h-3 text-sky-400" /> ElevenLabs API Key
                </label>
                <input
                  type="password"
                  placeholder="xi-..."
                  value={elevenlabsKey}
                  onChange={(e) => setElevenlabsKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-600"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 flex items-center gap-1">
                  <Key className="w-3 h-3 text-emerald-400" /> Vapi Public Public Token
                </label>
                <input
                  type="password"
                  placeholder="vapi-public-..."
                  value={vapiToken}
                  onChange={(e) => setVapiToken(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-600"
                />
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              {saved ? "Saved!" : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
