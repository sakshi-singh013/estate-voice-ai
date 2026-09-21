import React, { useState } from 'react';
import { Building2, ShieldCheck, MapPin, Calculator, Download, PhoneCall, CheckCircle2, FileText } from 'lucide-react';

export default function PropertyBrochure({ propertyData, onRequestCallBack }) {
  const [selectedUnit, setSelectedUnit] = useState("3 BHK Premium");
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [tenureYears, setTenureYears] = useState(20);
  const [activeTab, setActiveTab] = useState("units"); // 'units' | 'amenities' | 'location'

  const unitPrices = {
    "2 BHK Executive": 185000,
    "3 BHK Premium": 265000,
    "4 BHK Royal Penthouse": 420000
  };

  const unitAreas = {
    "2 BHK Executive": "1,280 sq.ft.",
    "3 BHK Premium": "1,850 sq.ft.",
    "4 BHK Royal Penthouse": "2,950 sq.ft."
  };

  const currentCost = unitPrices[selectedUnit] || 265000;
  const downPayment = (downPaymentPct / 100) * currentCost;
  const loanAmt = currentCost - downPayment;
  const interestRate = 8.35;
  const monthlyRate = (interestRate / 100) / 12;
  const n = tenureYears * 12;
  const emi = (loanAmt * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);

  const handleDownloadBrochure = () => {
    const brochureText = `
==================================================
GREENFIELD HEIGHTS LUXURY RESIDENCES
Brochure & Pricing Summary (CapStone Project Edition)
==================================================

Developer: Greenfield Infrastructure & Realty Ltd.
Location: Outer Ring Road, Silicon Corridor, Bengaluru
RERA Reg: PRM/KA/RERA/1251/310/PR/240921/006899
Handover: December 2026

Selected Unit: ${selectedUnit} (${unitAreas[selectedUnit]})
Base Price: $${currentCost.toLocaleString()}
Estimated Down Payment (${downPaymentPct}%): $${Math.round(downPayment).toLocaleString()}
Estimated Monthly EMI (8.35% APR, ${tenureYears} yrs): $${Math.round(emi).toLocaleString()}/mo

Amenities:
- 25,000 sq.ft. Central Clubhouse
- Temperature-Controlled Olympic Infinity Pool
- Co-working Hub & Private Conference Pods
- 100% EV Charging Bays & 3-Tier Facial Security

Contact Sales AI Specialist: Aria (+91 98765 43210)
    `;
    const blob = new Blob([brochureText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Greenfield_Heights_Brochure_${selectedUnit.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-panel rounded-2xl p-5 space-y-5 border border-slate-800">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">Greenfield Heights Residences</h2>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono">
              RERA Verified
            </span>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            Outer Ring Road, Silicon Corridor, Bengaluru
          </p>
        </div>

        <button
          onClick={handleDownloadBrochure}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
          title="Download Brochure Summary TXT"
        >
          <Download className="w-3.5 h-3.5 text-indigo-400" /> Download PDF
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800/80 gap-4 text-xs font-semibold text-slate-400">
        <button
          onClick={() => setActiveTab("units")}
          className={`pb-2 border-b-2 transition-colors ${activeTab === 'units' ? 'border-indigo-500 text-indigo-300' : 'border-transparent hover:text-slate-200'}`}
        >
          Unit Pricing & Specs
        </button>
        <button
          onClick={() => setActiveTab("amenities")}
          className={`pb-2 border-b-2 transition-colors ${activeTab === 'amenities' ? 'border-indigo-500 text-indigo-300' : 'border-transparent hover:text-slate-200'}`}
        >
          Project Amenities
        </button>
        <button
          onClick={() => setActiveTab("location")}
          className={`pb-2 border-b-2 transition-colors ${activeTab === 'location' ? 'border-indigo-500 text-indigo-300' : 'border-transparent hover:text-slate-200'}`}
        >
          Location Advantages
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'units' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2.5">
            {Object.keys(unitPrices).map((uName) => (
              <button
                key={uName}
                onClick={() => setSelectedUnit(uName)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedUnit === uName
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-100 shadow-md'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="truncate">{uName}</span>
                  {selectedUnit === uName && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                </div>
                <p className="text-sm font-bold text-white font-mono mt-1">${unitPrices[uName].toLocaleString()}</p>
                <span className="text-[10px] text-slate-400">{unitAreas[uName]}</span>
              </button>
            ))}
          </div>

          {/* Interactive Calculator */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-indigo-400" /> EMI & Mortgage Estimator
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                ${Math.round(emi).toLocaleString()} / month
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 text-[11px] block mb-1">Down Payment ({downPaymentPct}%):</label>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={downPaymentPct}
                  onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-800 rounded-lg h-1.5 cursor-pointer"
                />
                <span className="text-slate-300 font-mono text-[11px] font-semibold">${Math.round(downPayment).toLocaleString()}</span>
              </div>

              <div>
                <label className="text-slate-400 text-[11px] block mb-1">Loan Tenure:</label>
                <select
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-xs font-mono"
                >
                  <option value={10}>10 Years</option>
                  <option value={15}>15 Years</option>
                  <option value={20}>20 Years</option>
                  <option value={25}>25 Years</option>
                  <option value={30}>30 Years</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'amenities' && (
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
          {[
            "25,000 sq.ft. Central Clubhouse",
            "Temperature-Controlled Infinity Pool",
            "Co-working Hub with High-Speed WiFi",
            "100% EV Charging Station per spot",
            "3-Tier Facial Recognition Security",
            "Zen Meditation & Organic Roof Park",
            "Floodlit Tennis & Squash Courts",
            "24/7 Multi-Specialty Clinic"
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 bg-slate-950/40 border border-slate-800 rounded-lg p-2.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'location' && (
        <div className="space-y-2 text-xs text-slate-300">
          <div className="p-2.5 bg-slate-950/40 border border-slate-800 rounded-lg flex items-center justify-between">
            <span>Purple Line Metro Extension</span>
            <span className="font-mono text-emerald-400">2 Mins Walk</span>
          </div>
          <div className="p-2.5 bg-slate-950/40 border border-slate-800 rounded-lg flex items-center justify-between">
            <span>Embassy & Prestige Tech Parks</span>
            <span className="font-mono text-emerald-400">5 Mins Drive</span>
          </div>
          <div className="p-2.5 bg-slate-950/40 border border-slate-800 rounded-lg flex items-center justify-between">
            <span>Columbia Asia Hospital</span>
            <span className="font-mono text-emerald-400">10 Mins Drive</span>
          </div>
          <div className="p-2.5 bg-slate-950/40 border border-slate-800 rounded-lg flex items-center justify-between">
            <span>Kempegowda International Airport</span>
            <span className="font-mono text-emerald-400">35 Mins Drive</span>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">Want custom floor modifications?</span>
        <button
          onClick={onRequestCallBack}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-indigo-600/30"
        >
          <PhoneCall className="w-3.5 h-3.5" /> Request Voice Call
        </button>
      </div>
    </div>
  );
}
