import React, { useState } from 'react';
import { Target, DollarSign, UserCheck, Flame, Calendar, Download, RefreshCw, Check } from 'lucide-react';

export default function LeadQualificationCard({ lead, onUpdateLead }) {
  const [budget, setBudget] = useState(lead?.budget || "$200,000 - $300,000");
  const [authority, setAuthority] = useState(lead?.authority || "Self & Spouse");
  const [need, setNeed] = useState(lead?.need || "3 BHK Premium");
  const [timeline, setTimeline] = useState(lead?.timeline || "Within 3 Months");

  const score = lead?.bant_score || 75;
  const level = lead?.qualification_level || "Warm Lead ⚡";

  const handleExportLead = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(lead || {
      lead_id: "LEAD-2026-089",
      name: "Prospective Buyer",
      score,
      level,
      budget,
      authority,
      need,
      timeline
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `BANT_Lead_${lead?.lead_id || '2026-089'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleUpdate = (field, val) => {
    let newBudget = budget;
    let newAuth = authority;
    let newNeed = need;
    let newTime = timeline;

    if (field === 'budget') { setBudget(val); newBudget = val; }
    if (field === 'authority') { setAuthority(val); newAuth = val; }
    if (field === 'need') { setNeed(val); newNeed = val; }
    if (field === 'timeline') { setTimeline(val); newTime = val; }

    let newScore = 25;
    if (newBudget) newScore += 25;
    if (newNeed) newScore += 25;
    if (newTime) newScore += 25;

    let newLevel = "Cold Inquiry ❄️";
    if (newScore >= 75) newLevel = "Hot Lead 🔥";
    else if (newScore >= 50) newLevel = "Warm Lead ⚡";

    onUpdateLead({
      ...lead,
      budget: newBudget,
      authority: newAuth,
      need: newNeed,
      timeline: newTime,
      bant_score: newScore,
      qualification_level: newLevel
    });
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-slate-100 text-sm">BANT Lead Qualification</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold font-mono">
            {level}
          </span>
          <button
            onClick={handleExportLead}
            className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-xs"
            title="Export Lead Data JSON"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Score Bar */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
        <div className="flex items-center justify-between text-xs font-mono mb-1.5">
          <span className="text-slate-400">Lead Conversion Score</span>
          <span className="text-emerald-400 font-bold">{score} / 100</span>
        </div>
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-sky-400 via-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Interactive Criteria Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-2.5">
          <span className="text-[11px] font-semibold text-indigo-300 flex items-center gap-1 mb-1">
            <DollarSign className="w-3 h-3" /> Budget Range
          </span>
          <select
            value={budget}
            onChange={(e) => handleUpdate('budget', e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs font-mono"
          >
            <option>$150k - $200k</option>
            <option>$200,000 - $300,000</option>
            <option>$300k - $500k</option>
          </select>
        </div>

        <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-2.5">
          <span className="text-[11px] font-semibold text-indigo-300 flex items-center gap-1 mb-1">
            <UserCheck className="w-3 h-3" /> Decision Authority
          </span>
          <select
            value={authority}
            onChange={(e) => handleUpdate('authority', e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs"
          >
            <option>Individual Buyer</option>
            <option>Self & Spouse</option>
            <option>Family Investor</option>
          </select>
        </div>

        <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-2.5">
          <span className="text-[11px] font-semibold text-indigo-300 flex items-center gap-1 mb-1">
            <Flame className="w-3 h-3" /> Unit Requirement
          </span>
          <select
            value={need}
            onChange={(e) => handleUpdate('need', e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs"
          >
            <option>2 BHK Executive</option>
            <option>3 BHK Premium</option>
            <option>4 BHK Royal Penthouse</option>
          </select>
        </div>

        <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-2.5">
          <span className="text-[11px] font-semibold text-indigo-300 flex items-center gap-1 mb-1">
            <Calendar className="w-3 h-3" /> Purchase Timeline
          </span>
          <select
            value={timeline}
            onChange={(e) => handleUpdate('timeline', e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs"
          >
            <option>Immediate (&lt; 30 Days)</option>
            <option>Within 3 Months</option>
            <option>6+ Months Investment</option>
          </select>
        </div>
      </div>
    </div>
  );
}
