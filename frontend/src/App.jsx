import React, { useState, useEffect } from 'react';
import { Phone, Building2, Cpu, Activity, Calendar, Settings, Sparkles } from 'lucide-react';
import VoiceCallModal from './components/VoiceCallModal';
import TranscriptFeed from './components/TranscriptFeed';
import LeadQualificationCard from './components/LeadQualificationCard';
import PropertyBrochure from './components/PropertyBrochure';
import CalendarBookings from './components/CalendarBookings';
import SettingsModal from './components/SettingsModal';
import { fetchPropertyDetails, fetchLeadState, fetchBookings } from './services/api';

export default function App() {
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [propertyData, setPropertyData] = useState(null);
  const [lead, setLead] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [turns, setTurns] = useState([
    {
      userText: "Hello, can you tell me what 3 BHK units cost and schedule a site visit?",
      agentResponse: "Our 3 BHK Premium units start at $265,000 (₹2.10 Cr) for 1,850 sq.ft. I've reserved a guided site visit for Saturday at 11:00 AM with complimentary chauffeur pickup!",
      latency: 385,
      tool: "book_site_visit",
      rag: { category: "Unit Configurations & Pricing", content: "3 BHK Premium 1,850 sq.ft. starting $265,000." }
    }
  ]);

  useEffect(() => {
    async function loadData() {
      const pData = await fetchPropertyDetails();
      setPropertyData(pData);
      const lData = await fetchLeadState();
      setLead(lData);
      const bData = await fetchBookings();
      setBookings(bData);
    }
    loadData();
  }, []);

  const handleNewTurn = (turnData) => {
    setTurns(prev => [...prev, turnData]);
    if (turnData.updatedLead) {
      setLead(turnData.updatedLead);
    }
  };

  const handleAddBooking = (newBooking) => {
    setBookings(prev => [newBooking, ...prev]);
  };

  const handleDeleteBooking = (id) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  const handleClearTurns = () => {
    setTurns([]);
  };

  const handleUpdateLead = (updatedLead) => {
    setLead(updatedLead);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Header Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-sky-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-600/30">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
                EstateVoice AI <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-normal border border-indigo-500/30">v1.0</span>
              </h1>
              <p className="text-xs text-slate-400">Voice AI Agent & Real Estate Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCallOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95 ring-2 ring-indigo-500/40"
            >
              <Phone className="w-4 h-4 animate-bounce" /> Start Voice Call
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Pipeline Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* KPI Telemetry Banner */}
        <div className="grid grid-cols-4 gap-4">
          <div className="glass-card rounded-2xl p-4 flex items-center justify-between border-l-4 border-l-indigo-500">
            <div>
              <span className="text-xs text-slate-400 font-medium">Agent Turn Latency</span>
              <p className="text-xl font-bold font-mono text-emerald-400 mt-0.5">385 ms</p>
            </div>
            <Activity className="w-6 h-6 text-indigo-400" />
          </div>

          <div className="glass-card rounded-2xl p-4 flex items-center justify-between border-l-4 border-l-sky-500">
            <div>
              <span className="text-xs text-slate-400 font-medium">Vector RAG Retrieval</span>
              <p className="text-xl font-bold font-mono text-sky-400 mt-0.5">Active</p>
            </div>
            <Cpu className="w-6 h-6 text-sky-400" />
          </div>

          <div className="glass-card rounded-2xl p-4 flex items-center justify-between border-l-4 border-l-emerald-500">
            <div>
              <span className="text-xs text-slate-400 font-medium">Site Visits Confirmed</span>
              <p className="text-xl font-bold font-mono text-slate-100 mt-0.5">{bookings.length}</p>
            </div>
            <Calendar className="w-6 h-6 text-emerald-400" />
          </div>

          <div className="glass-card rounded-2xl p-4 flex items-center justify-between border-l-4 border-l-amber-500">
            <div>
              <span className="text-xs text-slate-400 font-medium">BANT Qualification Score</span>
              <p className="text-xl font-bold font-mono text-amber-400 mt-0.5">{lead?.bant_score || 75} / 100</p>
            </div>
            <Sparkles className="w-6 h-6 text-amber-400" />
          </div>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Property Specs & Brochure */}
          <div className="col-span-12 lg:col-span-4">
            <PropertyBrochure
              propertyData={propertyData}
              onRequestCallBack={() => setIsCallOpen(true)}
            />
          </div>

          {/* Middle Column: Live Transcript & Telemetry */}
          <div className="col-span-12 lg:col-span-4">
            <TranscriptFeed
              turns={turns}
              onClearTurns={handleClearTurns}
            />
          </div>

          {/* Right Column: Lead Scoring & Site Visits */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <LeadQualificationCard
              lead={lead}
              onUpdateLead={handleUpdateLead}
            />
            <CalendarBookings
              bookings={bookings}
              onAddBooking={handleAddBooking}
              onDeleteBooking={handleDeleteBooking}
            />
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500 font-mono">
        <span>EstateVoice AI • Real Estate Voice Sales Agent Platform</span>
      </footer>

      {/* Modals */}
      <VoiceCallModal
        isOpen={isCallOpen}
        onClose={() => setIsCallOpen(false)}
        onNewTurn={handleNewTurn}
        activeLead={lead}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

    </div>
  );
}
