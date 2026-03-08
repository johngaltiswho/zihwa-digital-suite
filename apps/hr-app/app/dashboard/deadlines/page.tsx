"use client"

import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, AlertCircle, Search,
  Loader2, X, ChevronLeft, ChevronRight,
  Pencil, Trash2, ShieldCheck, Clock, Zap, Landmark
} from 'lucide-react';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
// ✅ Proper types replacing all `any`
type Company = {
  id: string
  name: string
}

type Deadline = {
  id: string
  title: string
  type: string
  priority: string
  status: string
  dueDate: string
  companyId: string
  company?: { name: string }
}

type DeadlineFormData = {
  title: string
  companyId: string
  type: string
  priority: string
  dueDate: string
}
const DeadlinesPage = () => {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  const [viewDate, setViewDate] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Deadline | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('all');

  // NEW: track which date was clicked to highlight in list view
  const [highlightedDate, setHighlightedDate] = useState<string | null>(null);

  const [formData, setFormData] = useState<DeadlineFormData>({  // ✅ Type applied here
    title: '', companyId: '', type: 'PF_RETURN', priority: 'MEDIUM', dueDate: ''
  });

  // Refs for highlighted rows so we can scroll to them
  const highlightedRowRefs = useRef<{ [key: string]: HTMLTableRowElement | null }>({});

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [dRes, cRes] = await Promise.all([
        fetch('/api/compliance/deadlines'),
        fetch('/api/companies')
      ]);
      const dData = await dRes.json();
      const cData = await cRes.json();
      setDeadlines(Array.isArray(dData) ? dData : []);
      setCompanies(Array.isArray(cData) ? cData : []);
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  // When switching to list view with a highlighted date, scroll to first highlighted row
  useEffect(() => {
    if (viewMode === 'list' && highlightedDate) {
      // Small timeout to allow DOM to render
      setTimeout(() => {
        const firstKey = Object.keys(highlightedRowRefs.current).find(
          key => key.startsWith(highlightedDate) && highlightedRowRefs.current[key]
        );
        if (firstKey && highlightedRowRefs.current[firstKey]) {
          highlightedRowRefs.current[firstKey]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [viewMode, highlightedDate]);

  const handleAutoSetMonthlyDeadlines = async () => {
    if (companies.length === 0) return alert("Register a company first.");
    const year = viewDate.getFullYear();
    const month = String(viewDate.getMonth() + 1).padStart(2, '0');
    const deadlineDate = `${year}-${month}-15`;
    const requirements = [
      { title: "Monthly PF Return Filing", type: "PF_RETURN", dueDate: deadlineDate },
      { title: "Monthly ESI Contribution", type: "ESI_RETURN", dueDate: deadlineDate }
    ];
    try {
      for (const req of requirements) {
        await fetch('/api/compliance/deadlines', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...req, companyId: companies[0].id, priority: 'HIGH' })
        });
      }
      fetchData();
      alert("PF and ESI Deadlines registered for the 15th of this month.");
    } catch { alert("Auto-set failed"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this requirement from audit trail?")) return;
    await fetch(`/api/compliance/deadlines/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handleEdit = (item: Deadline) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      companyId: item.companyId,
      type: item.type,
      priority: item.priority,
      dueDate: item.dueDate.split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingItem ? `/api/compliance/deadlines/${editingItem.id}` : '/api/compliance/deadlines';
    const method = editingItem ? 'PATCH' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setEditingItem(null);
        fetchData();
        setFormData({ title: '', companyId: '', type: 'PF_RETURN', priority: 'MEDIUM', dueDate: '' });
      } else {
        const err = await res.json();
        console.error('Save failed:', err);
        alert(`Failed to save: ${err.error || res.statusText}`);
      }
    } catch (e: unknown) {    // ✅ unknown + type narrowing
      console.error('Save error:', e);
      alert(`Error: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  };
  // NEW: handle clicking a calendar date that has tasks
  const handleDateClick = (dateStr: string, dayTasks: Deadline[]) => {
    if (dayTasks.length === 0) return;
    setHighlightedDate(dateStr);
    setViewMode('list');
  };

  // Clear highlight when user manually changes view or searches
  const handleViewModeChange = (mode: 'calendar' | 'list') => {
    setViewMode(mode);
    if (mode === 'calendar') setHighlightedDate(null);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setHighlightedDate(null);
  };

  const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const firstDay = (y: number, m: number) => new Date(y, m, 1).getDay();

  const filtered = deadlines.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesComp = selectedCompany === 'all' || d.companyId === selectedCompany;
    return matchesSearch && matchesComp;
  });

  const stats = {
    overdue: deadlines.filter(d => new Date(d.dueDate) < new Date() && d.status !== 'COMPLETED').length,
    pending: deadlines.filter(d => d.status !== 'COMPLETED').length,
    readiness: deadlines.length ? Math.round((deadlines.filter(d => d.status === 'COMPLETED').length / deadlines.length) * 100) : 0
  };

  if (isLoading) return <div className="p-10 flex justify-center w-full"><Loader2 className="animate-spin text-gray-900" /></div>;

  return (
    <div className="w-full -px-12 -mt-5 space-y-4 bg-[#fafbfc]">

      {/* Header */}
      <div className="flex justify-between items-center w-full">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Compliance</h1>
          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Audit Trail & Regulatory Monitoring</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleAutoSetMonthlyDeadlines}
            className="h-10 border-indigo-100 text-indigo-700 bg-indigo-10 font-bold text-[10px] uppercase flex items-center gap-2"
          >
            <Zap className="w-3.5 h-3.5" /> Auto-Set PF/ESI (15th)
          </Button>
          <Button
            onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
            className="bg-[#0f172a] text-white h-10 px-6 rounded-xl font-bold text-xs shadow-md"
          >
            <Plus className="w-4 h-4 mr-1" /> New Requirement
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {[
          { label: 'Critical Overdue', val: stats.overdue, icon: <AlertCircle className="text-rose-500 w-4 h-4"/>, color: 'text-rose-600' },
          { label: 'Pending Deadlines', val: stats.pending, color: 'text-gray-900', icon: <Clock className="w-4 h-4 text-gray-400" /> },
          { label: 'Compliance Readiness', val: `${stats.readiness}%`, color: 'text-emerald-600', icon: <ShieldCheck className="w-4 h-4" /> }
        ].map((s, i) => (
          <div key={i} className="bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex justify-between">{s.label} {s.icon}</p>
            <p className={`text-2xl font-semibold ${s.color}`}>{s.val.toString().padStart(2, '0')}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm items-center relative z-20">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            className="pl-10 h-10 border-none bg-gray-50 rounded-lg text-xs font-bold text-gray-900"
            placeholder="Filter by requirement name..."
            value={searchQuery}
            onChange={e => handleSearchChange(e.target.value)}
          />
        </div>
        <select
          className="h-8 border-none bg-gray-100 rounded-lg px-4 text-xs font-bold text-gray-900 outline-none min-w-[200px] appearance-none"
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
          <option value="all">All Organizations</option>
          {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
          <button
            onClick={() => handleViewModeChange('calendar')}
            className={`h-8 px-4 text-[10px] font-bold rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
          >
            Calendar View
          </button>
          <button
            onClick={() => handleViewModeChange('list')}
            className={`h-8 px-4 text-[10px] font-bold rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
          >
            Detailed List
          </button>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3 animate-in fade-in duration-500">
          {/* Month nav */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-medium font-black text-gray-900 uppercase tracking-tighter">
                {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Monthly Statutory Grid</p>
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-900 transition-all border border-gray-100"><ChevronLeft className="w-3.5 h-3.5"/></button>
              <button onClick={() => setViewDate(new Date())} className="px-3 h-7 bg-gray-50 rounded-lg text-[9px] font-bold text-gray-900 uppercase tracking-widest hover:bg-gray-100 border border-gray-100">Today</button>
              <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-900 transition-all border border-gray-100"><ChevronRight className="w-3.5 h-3.5"/></button>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 gap-1">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
              <div key={d} className="text-center text-[12px] font-bold text-gray-400 pb-2">{d}</div>
            ))}
            {Array.from({ length: firstDay(viewDate.getFullYear(), viewDate.getMonth()) }).map((_, i) => <div key={i} />)}
            {Array.from({ length: daysInMonth(viewDate.getFullYear(), viewDate.getMonth()) }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayTasks = filtered.filter(d => d.dueDate.startsWith(dateStr));
              const isToday = new Date().toDateString() === new Date(viewDate.getFullYear(), viewDate.getMonth(), day).toDateString();
              const isHovered = hoveredDate === dateStr;
              const isClickable = dayTasks.length > 0;

              return (
                <div
                  key={day}
                  onMouseEnter={() => setHoveredDate(dateStr)}
                  onMouseLeave={() => setHoveredDate(null)}
                  onClick={() => handleDateClick(dateStr, dayTasks)}
                  className={`h-8 rounded-lg border flex flex-col items-center justify-center relative transition-all duration-200
                    ${isClickable ? 'cursor-pointer' : 'cursor-default'}
                    ${isToday
                      ? 'bg-gray-900 border-gray-900 shadow-md'
                      : dayTasks.length > 0
                        ? 'bg-white border-gray-200 hover:border-indigo-400 hover:shadow-sm hover:bg-indigo-50/40'
                        : 'bg-transparent border-transparent hover:bg-gray-50'
                    }`}
                >
                  <span className={`text-[11px] font-bold leading-none ${isToday ? 'text-white' : 'text-gray-900'}`}>{day}</span>

                  {dayTasks.length > 0 && !isToday && (
                    <div className="flex gap-0.5 mt-0.5">
                      {dayTasks.slice(0, 3).map((t, idx) => (
                        <div key={idx} className={`w-1 h-1 rounded-full ${t.status === 'COMPLETED' ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                      ))}
                    </div>
                  )}

                  {/* Hover tooltip */}
                  {isHovered && dayTasks.length > 0 && (
                    <div className="absolute bottom-full mb-2 w-52 bg-[#0f172a] text-white p-3 rounded-xl shadow-2xl z-[100] animate-in fade-in slide-in-from-bottom-1 border border-white/10">
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 border-b border-white/10 pb-1">
                        {day} {viewDate.toLocaleString('default', { month: 'short' })}
                      </p>
                      {dayTasks.map(t => (
                        <div key={t.id} className="text-[10px] font-bold py-0.5 flex items-center justify-between gap-2">
                          <span className="truncate">{t.title}</span>
                          <div className={`w-1.5 h-1.5 flex-shrink-0 rounded-full ${t.status === 'COMPLETED' ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
          {/* Highlighted date banner */}
          {highlightedDate && (
            <div className="flex items-center justify-between px-10 py-3 bg-indigo-50 border-b border-indigo-100">
              <p className="text-[11px] font-bold text-gray-600 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-400 inline-block animate-pulse" />
                Showing deadlines for{' '}
                {new Date(highlightedDate + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
              <button
                onClick={() => setHighlightedDate(null)}
                className="text-[10px] font-bold text-gray-400 hover:text-indigo-700 flex items-center gap-1 transition-colors"
              >
                <X className="w-3 h-3" /> Clear filter
              </button>
            </div>
          )}

          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-[10px] text-gray-400 font-bold uppercase tracking-widest border-b">
              <tr>
                <th className="px-10 py-5">Filing Name</th>
                <th className="px-10 py-5">Deadline</th>
                <th className="px-10 py-5">Status</th>
                <th className="px-10 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-10 py-10 text-center text-xs text-gray-400 font-bold">No compliance records found.</td>
                </tr>
              )}
              {filtered.map((item) => {
                const itemDateStr = item.dueDate.split('T')[0];
                const isHighlighted = highlightedDate !== null && itemDateStr === highlightedDate;

                return (
                  <tr
                    key={item.id}
                    ref={el => {
                      if (isHighlighted) {
                        highlightedRowRefs.current[`${itemDateStr}-${item.id}`] = el;
                      }
                    }}
                    className={`group transition-all duration-300
                      ${isHighlighted
                        ? 'bg-indigo-50/70 border-l-4 border-l-indigo-400'
                        : highlightedDate
                          ? 'opacity-40 hover:opacity-70 hover:bg-gray-50/50'
                          : 'hover:bg-gray-50/50'
                      }`}
                  >
                    <td className="px-10 py-5">
                      <div className={`font-bold text-[13px] flex items-center gap-2 ${isHighlighted ? 'text-indigo-900' : 'text-gray-900'}`}>
                        {item.title.includes('PF') ? <Landmark className={`w-3.5 h-3.5 ${isHighlighted ? 'text-indigo-500' : 'text-blue-500'}`} /> : <ShieldCheck className={`w-3.5 h-3.5 ${isHighlighted ? 'text-indigo-500' : 'text-orange-500'}`} />}
                        {item.title}
                        {isHighlighted && (
                          <span className="ml-1 px-1.5 py-0.5 text-[8px] font-black bg-indigo-100 text-indigo-600 rounded-md uppercase tracking-wider">
                            Selected
                          </span>
                        )}
                      </div>
                      <div className="text-[9px] font-bold text-gray-400 mt-1 uppercase">{item.company?.name}</div>
                    </td>
                    <td className={`px-10 py-5 font-bold text-xs ${isHighlighted ? 'text-indigo-700' : 'text-gray-900'}`}>
                      {new Date(item.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-10 py-5">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md border uppercase ${item.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-10 py-5 text-right">
                      <div className={`flex justify-end gap-2 transition-opacity ${isHighlighted ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        <button onClick={() => handleEdit(item)} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all"><Pencil className="w-4 h-4"/></button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-sm p-8 shadow-2xl border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">{editingItem ? "Edit Entry" : "New Requirement"}</h2>
              <button onClick={() => { setIsModalOpen(false); setEditingItem(null); }} className="text-gray-900 hover:bg-gray-100 rounded-full p-1 transition-all"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Requirement Description</label>
                <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="h-11 rounded-xl bg-gray-50 border-none font-bold text-gray-900 text-sm px-4" placeholder="e.g. Monthly ESI Filing" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Organization</label>
                  <select required className="w-full h-11 bg-gray-50 rounded-xl px-4 font-bold text-gray-900 outline-none text-[11px] appearance-none" value={formData.companyId} onChange={e => setFormData({...formData, companyId: e.target.value})}>
                    <option value="">Select...</option>
                    {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Deadline Date</label>
                  <Input type="date" required value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="h-11 bg-gray-50 border-none rounded-xl font-bold text-gray-900 text-[11px]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Type</label>
                  <select className="w-full h-11 bg-gray-50 rounded-xl px-4 font-bold text-gray-900 outline-none text-[11px] appearance-none" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option value="PF_RETURN">PF Return</option>
                    <option value="ESI_RETURN">ESI Return</option>
                    <option value="TDS_RETURN">TDS Return</option>
                    <option value="GST_RETURN">GST Return</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Priority</label>
                  <select className="w-full h-11 bg-gray-50 rounded-xl px-4 font-bold text-gray-900 outline-none text-[11px] appearance-none" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>
              <div className="pt-4">
                <Button type="submit" className="w-full bg-[#0f172a] text-white h-12 rounded-2xl font-bold text-sm shadow-xl shadow-gray-200 transition-all active:scale-95">
                  {editingItem ? "Commit Updates" : "Save Compliance Record"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeadlinesPage;