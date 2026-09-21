import React, { useState } from 'react';
import { Calendar, Car, Phone, Plus, CheckCircle2, User, Clock, Trash2, Download } from 'lucide-react';

export default function CalendarBookings({ bookings, onAddBooking, onDeleteBooking }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("2026-09-28");
  const [timeSlot, setTimeSlot] = useState("11:00 AM");
  const [unit, setUnit] = useState("3 BHK Premium");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    onAddBooking({
      id: `VST-${1000 + bookings.length + 1}`,
      customer_name: name,
      phone,
      date,
      time_slot: timeSlot,
      unit_interest: unit,
      chauffeur_pickup: true,
      status: "Confirmed"
    });
    setName("");
    setPhone("");
    setShowAddModal(false);
  };

  const handleExportCSV = () => {
    let csv = "ID,Customer Name,Phone,Date,Time Slot,Unit Interest,Chauffeur Pickup,Status\n";
    bookings.forEach(b => {
      csv += `"${b.id}","${b.customer_name}","${b.phone}","${b.date}","${b.time_slot}","${b.unit_interest}","Included","${b.status}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Site_Visit_Appointments_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-panel rounded-2xl p-5 space-y-4 border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sky-400" />
            Scheduled Site Visits
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Automated bookings confirmed by Aria Voice Agent</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs border border-slate-700 flex items-center gap-1"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
          <button
            onClick={() => setShowAddModal(!showAddModal)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-colors shadow-md shadow-indigo-600/30"
          >
            <Plus className="w-3.5 h-3.5" /> Add Visit
          </button>
        </div>
      </div>

      {showAddModal && (
        <form onSubmit={handleSubmit} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-indigo-300">Quick Appointment Booking</h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <input
              type="text"
              placeholder="Customer Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500"
              required
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500"
              required
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono"
            />
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
            >
              <option>10:00 AM</option>
              <option>11:00 AM</option>
              <option>02:00 PM</option>
              <option>04:30 PM</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800/80 text-slate-400 font-mono text-[11px]">
              <th className="pb-2 font-medium">Customer</th>
              <th className="pb-2 font-medium">Date & Slot</th>
              <th className="pb-2 font-medium">Unit Interest</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-slate-900/40 transition-colors">
                <td className="py-2.5">
                  <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    {b.customer_name}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                    <Phone className="w-2.5 h-2.5" /> {b.phone}
                  </span>
                </td>
                <td className="py-2.5">
                  <div className="font-mono text-slate-200">{b.date}</div>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-2.5 h-2.5 text-sky-400" /> {b.time_slot}
                  </span>
                </td>
                <td className="py-2.5 text-slate-300">{b.unit_interest}</td>
                <td className="py-2.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> Confirmed
                  </span>
                </td>
                <td className="py-2.5 text-right">
                  <button
                    onClick={() => onDeleteBooking(b.id)}
                    className="p-1 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded transition-colors"
                    title="Cancel Booking"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
