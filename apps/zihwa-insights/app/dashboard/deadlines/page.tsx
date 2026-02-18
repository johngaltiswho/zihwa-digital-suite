"use client"

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  MoreVertical,
  FileCheck,
  Building2,
  Loader2
} from 'lucide-react';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

// Define interface for Type Safety
interface Deadline {
  id: number;
  title: string;
  company: string;
  type: string;
  dueDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

const DeadlinesPage = () => {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data matching the Interface
  const mockDeadlines: Deadline[] = [
    { id: 1, title: "PF Contribution Filing", company: "Zihwa Insights", type: "LABOR_LAW", dueDate: "2026-03-15", status: "PENDING", priority: "CRITICAL" },
    { id: 2, title: "TDS Quarterly Return", company: "Fluviun", type: "TAX_FILING", dueDate: "2026-03-31", status: "IN_PROGRESS", priority: "HIGH" },
    { id: 3, title: "ESI Payment", company: "Stalks N Spice", type: "LABOR_LAW", dueDate: "2026-03-15", status: "COMPLETED", priority: "CRITICAL" },
    { id: 4, title: "Annual Audit Review", company: "Pars Optima", type: "AUDIT", dueDate: "2026-02-28", status: "OVERDUE", priority: "CRITICAL" },
  ];

  useEffect(() => {
    // Simulate API Load
    const timer = setTimeout(() => {
      setDeadlines(mockDeadlines);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'OVERDUE': return 'bg-rose-50 text-rose-700 border-rose-100 animate-pulse';
      case 'IN_PROGRESS': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'CRITICAL') return <AlertCircle className="w-3.5 h-3.5 text-rose-500" />;
    return <Clock className="w-3.5 h-3.5 text-slate-400" />;
  };

  const filteredDeadlines = deadlines.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-slate-400" /></div>;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-sans tracking-tight">Compliance Deadlines</h1>
          <p className="text-sm text-gray-500 font-medium">Track and manage statutory filings and HR audits.</p>
        </div>
        <Button className="bg-[#0f172a] text-white flex items-center gap-2 h-11 px-6 rounded-lg font-bold shadow-sm hover:bg-slate-800">
          <Plus className="w-4 h-4" /> Set New Deadline
        </Button>
      </div>

      {/* Compliance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Overdue tasks</p>
                <AlertCircle className="w-4 h-4 text-rose-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">01</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-amber-400">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Due This Week</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">05</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pending Uploads</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Completion Rate</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">92%</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            className="pl-10 w-full bg-white text-gray-900 border-gray-100 h-11 focus:border-indigo-400 outline-none" 
            placeholder="Search by task title or company..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
            {/* Changed variant from "outline" to "ghost" to fix build error */}
            <Button variant="ghost" className="flex items-center gap-2 text-gray-600 border border-gray-100 h-11 px-5 hover:bg-gray-50">
                <Filter className="w-4 h-4" /> Filter
            </Button>
            <Button variant="ghost" className="flex items-center gap-2 text-gray-600 border border-gray-100 h-11 px-5 hover:bg-gray-50">
                <Calendar className="w-4 h-4" /> Calendar View
            </Button>
        </div>
      </div>

      {/* Deadlines Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left min-w-[1000px]">
          <thead className="bg-gray-50/50 border-b border-gray-100 font-bold text-[11px] text-gray-500 uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Filing / Task Title</th>
              <th className="px-6 py-4 text-center">Priority</th>
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Due Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-[13px]">
            {filteredDeadlines.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/30 transition-colors">
                <td className="px-6 py-5">
                  <div className="font-semibold text-gray-900">{item.title}</div>
                  <div className="text-[11px] text-gray-400 font-medium">Assigned to: HR Operations</div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center justify-center gap-1.5 px-2 py-1 rounded bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500">
                    {getPriorityIcon(item.priority)}
                    {item.priority}
                  </div>
                </td>
                <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-gray-600 font-medium">
                        <Building2 className="w-4 h-4 text-slate-300" />
                        {item.company}
                    </div>
                </td>
                <td className="px-6 py-5">
                    <span className="text-gray-500 font-medium px-2 py-0.5 bg-slate-100 rounded text-[10px]">
                        {item.type.replace('_', ' ')}
                    </span>
                </td>
                <td className="px-6 py-5">
                    <div className={`font-bold ${item.status === 'OVERDUE' ? 'text-rose-600' : 'text-gray-700'}`}>
                        {new Date(item.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end items-center gap-3">
                    {item.status !== 'COMPLETED' && (
                        <button className="text-emerald-600 hover:text-emerald-700 p-1 hover:bg-emerald-50 rounded" title="Mark as Done">
                            <CheckCircle2 className="w-5 h-5" />
                        </button>
                    )}
                    <button className="text-blue-600 hover:text-blue-700 p-1 hover:bg-blue-50 rounded" title="Upload Proof/Document">
                        <FileCheck className="w-5 h-5" />
                    </button>
                    <MoreVertical className="w-4 h-4 text-gray-300 cursor-pointer" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeadlinesPage;