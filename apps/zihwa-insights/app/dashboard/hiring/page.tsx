"use client"

import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  FileText, 
  Search, 
  Filter as FilterIcon, 
  UserPlus, 
  Download,
  MoreVertical,
  Loader2,
  X,
  GraduationCap,
  IndianRupee,
  UploadCloud,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useSupabase } from '@/components/providers/SupabaseProvider';

// --- TYPES ---
interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  experience: string;
  qualification: string;
  currentCTC: string;
  status: string;
  resumeUrl: string;
  companyId: string;
}

interface Company {
  id: string;
  name: string;
}

const HiringPage = () => {
  const supabase = useSupabase();
  // Fixed: Added explicit types to useState
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // States for Active Functionality
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isHiringId, setIsHiringId] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', designation: '', experience: '', 
    qualification: '', currentCTC: '', companyId: '', resumeUrl: ''
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [candRes, compRes] = await Promise.all([
        fetch('/api/candidates'),
        fetch('/api/companies')
      ]);
      const candData = await candRes.json();
      const compData = await compRes.json();

      if (candData.success) setCandidates(candData.data);
      
      // Support both array and wrapped data formats
      if (Array.isArray(compData)) {
        setCompanies(compData);
      } else if (compData.data && Array.isArray(compData.data)) {
        setCompanies(compData.data);
      }
    } catch (error) {
      console.error("Fetch Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- FUNCTIONALITY: UPDATE STATUS ---
  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/candidates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  // --- FUNCTIONALITY: DELETE CANDIDATE ---
  const handleDeleteCandidate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this candidate record?")) return;
    try {
      const res = await fetch('/api/candidates', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        fetchData();
        setActiveMenuId(null);
      }
    } catch (err) {
      alert("Failed to delete");
    }
  };

  // --- FUNCTIONALITY: HIRE (ONBOARD AS EMPLOYEE) ---
  const handleHire = async (candidate: any) => {
    if (!window.confirm(`Start onboarding ${candidate.name} as an active employee?`)) return;
    
    setIsHiringId(candidate.id);
    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
          firstName: candidate.name.split(' ')[0],
          lastName: candidate.name.split(' ').slice(1).join(' ') || 'Candidate',
          email: candidate.email,
          phone: candidate.phone,
          designation: candidate.designation,
          companyId: candidate.companyId,
          salary: candidate.currentCTC ? parseInt(candidate.currentCTC.replace(/[^0-9]/g, '')) : 0,
          status: 'ACTIVE'
        })
      });

      if (res.ok) {
        await handleStatusUpdate(candidate.id, 'OFFERED');
        alert("Onboarding successful! Check the Employees tab.");
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Onboarding failed");
      }
    } finally {
      setIsHiringId(null);
    }
  };

  // --- FUNCTIONALITY: ROBUST UPLOAD ---
  const uploadFile = async () => {
    if (!selectedFile) return null;
    setIsUploading(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      // Sanitize name to prevent upload errors
      const cleanName = selectedFile.name.replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `${Date.now()}_${cleanName}.${fileExt}`;
      const filePath = `resumes/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('documents').getPublicUrl(filePath);
      return urlData.publicUrl;
    } catch (error) {
      console.error("File upload failed", error);
      alert("Upload failed. Ensure bucket 'documents' is Public.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let finalResumeUrl = formData.resumeUrl;
      if (selectedFile) {
        const uploadedUrl = await uploadFile();
        if (uploadedUrl) finalResumeUrl = uploadedUrl;
        else { setIsSubmitting(false); return; } // Stop if upload failed
      }
      
      const res = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, resumeUrl: finalResumeUrl })
      });
      
      const result = await res.json();
      if (result.success) {
        setIsModalOpen(false);
        setFormData({ name: '', email: '', phone: '', designation: '', experience: '', qualification: '', currentCTC: '', companyId: '', resumeUrl: '' });
        setSelectedFile(null);
        fetchData();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCandidates = candidates.filter((c: any) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.designation?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-slate-400" /></div>;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hiring Candidates</h1>
          <p className="text-sm text-gray-500 font-medium">Recruitment lifecycle management.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-[#0f172a] text-white flex items-center gap-2 h-11 px-6 rounded-lg font-bold">
          <Plus className="w-4 h-4" /> Add Candidate
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-4 items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input className="pl-10 w-full bg-white text-gray-900 border-gray-100 h-11 focus:border-indigo-400 outline-none" placeholder="Search candidates..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <select 
          className="h-11 px-4 rounded-lg border border-gray-100 text-sm font-medium bg-white text-gray-600 outline-none cursor-pointer"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Status</option>
          <option value="SCREENING">Screening</option>
          <option value="INTERVIEWING">Interviewing</option>
          <option value="OFFERED">Offered</option>
        </select>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto min-h-[400px]">
        <table className="w-full text-left min-w-[1100px]">
          <thead className="bg-gray-50/50 border-b border-gray-100 font-bold">
            <tr>
              <th className="px-6 py-4 text-[12px] text-gray-500 uppercase">Candidate Name</th>
              <th className="px-6 py-4 text-[12px] text-gray-500 uppercase">Designation</th>
              <th className="px-6 py-4 text-[12px] text-gray-500 uppercase">Qualification</th>
              <th className="px-6 py-4 text-[12px] text-gray-500 uppercase">Exp (Yrs)</th>
              <th className="px-6 py-4 text-[12px] text-gray-500 uppercase">Current CTC</th>
              <th className="px-6 py-4 text-[12px] text-gray-500 uppercase">Status</th>
              <th className="px-6 py-4 text-[12px] text-gray-500 uppercase text-center">Resume/CSV</th>
              <th className="px-6 py-4 text-[12px] text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-[13px]">
            {filteredCandidates.map((c: any) => (
              <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-5">
                  <div className="font-semibold text-gray-900">{c.name}</div>
                  <div className="text-gray-400 font-normal">{c.email}</div>
                </td>
                <td className="px-6 py-5 text-gray-700 font-medium">{c.designation || 'N/A'}</td>
                <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5 text-gray-600">
                        <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> {c.qualification || 'N/A'}
                    </div>
                </td>
                <td className="px-6 py-5 text-gray-600">{c.experience}</td>
                <td className="px-6 py-5 font-bold text-gray-900">
                    <div className="flex items-center gap-1"><IndianRupee className="w-3 h-3 text-green-600" /> {c.currentCTC || '0'}</div>
                </td>
                <td className="px-6 py-5">
                  {/* FUNCTIONAL STATUS SELECT */}
                  <select 
                    value={c.status}
                    onChange={(e) => handleStatusUpdate(c.id, e.target.value)}
                    className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full outline-none border-none cursor-pointer hover:bg-blue-100"
                  >
                    <option value="SCREENING">SCREENING</option>
                    <option value="INTERVIEWING">INTERVIEWING</option>
                    <option value="OFFERED">OFFERED</option>
                  </select>
                </td>
                <td className="px-6 py-5 text-center">
                  {/* FUNCTIONAL VIEW CV BUTTON */}
                  <button 
                    disabled={!c.resumeUrl}
                    className={`flex items-center justify-center gap-2 font-semibold mx-auto ${c.resumeUrl ? 'text-blue-600 hover:underline' : 'text-gray-300 cursor-not-allowed'}`} 
                    onClick={() => window.open(c.resumeUrl, '_blank')}
                  >
                    <FileText className="w-4 h-4" /> View CV
                  </button>
                </td>
                <td className="px-6 py-5 text-right relative">
                  <div className="flex justify-end gap-2">
                    {/* FUNCTIONAL HIRE BUTTON */}
                    <Button 
                      disabled={isHiringId === c.id}
                      onClick={() => handleHire(c)}
                      className="bg-[#0f172a] text-white text-[12px] h-9 px-4 rounded-md flex items-center gap-2 font-bold"
                    >
                      {isHiringId === c.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
                      Hire
                    </Button>
                    <div className="relative">
                      <button onClick={() => setActiveMenuId(activeMenuId === c.id ? null : c.id)} className="p-1 hover:bg-gray-100 rounded text-gray-400">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      {activeMenuId === c.id && (
                        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded shadow-lg z-50">
                          <button onClick={() => handleDeleteCandidate(c.id)} className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal with Scroll and All Fields */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-2xl w-full max-w-xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add New Candidate</h2>
              <X className="w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-600" onClick={() => setIsModalOpen(false)} />
            </div>
            
            <form onSubmit={handleSaveCandidate} className="space-y-4 text-gray-900">
               <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                  <Input required className="h-11 border-gray-100 shadow-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</label><Input type="email" className="h-11 border-gray-100 shadow-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                  <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone</label><Input className="h-11 border-gray-100 shadow-sm" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Designation</label><Input className="h-11 border-gray-100 shadow-sm" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} /></div>
                  <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Qualification</label><Input placeholder="e.g. MBA" className="h-11 border-gray-100 shadow-sm" value={formData.qualification} onChange={e => setFormData({...formData, qualification: e.target.value})} /></div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Exp (Yrs)</label><Input type="number" className="h-11 border-gray-100 shadow-sm" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} /></div>
                  <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current CTC</label><Input value={formData.currentCTC} className="h-11 border-gray-100 shadow-sm" onChange={e => setFormData({...formData, currentCTC: e.target.value})} /></div>
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Company</label>
                  <select className="w-full h-11 px-3 rounded-lg border border-gray-100 text-sm outline-none bg-white shadow-sm cursor-pointer" required value={formData.companyId} onChange={e => setFormData({...formData, companyId: e.target.value})}>
                    <option value="" disabled>Select a company</option>
                    {companies.map((comp: any) => <option key={comp.id} value={comp.id}>{comp.name}</option>)}
                  </select>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Resume</label>
                 <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-100 border-dashed rounded-xl cursor-pointer bg-gray-50/50 hover:bg-gray-100 transition-all">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                            <UploadCloud className="w-8 h-8 mb-2 text-indigo-400" />
                            <p className="text-sm text-gray-600 font-bold">{selectedFile ? selectedFile.name : "Select Resume File"}</p>
                        </div>
                        <input type="file" className="hidden" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                    </label>
                 </div>
               </div>
               <Button type="submit" disabled={isSubmitting || isUploading} className="w-full bg-[#4f46e5] text-white h-12 rounded-xl font-bold mt-4 shadow-lg flex items-center justify-center gap-2">
                {isSubmitting || isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Candidate Profile"}
               </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HiringPage;