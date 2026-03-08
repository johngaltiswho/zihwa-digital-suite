/**
 * PUBLIC APPLICATION LINKS FOR ZIHWA INSIGHTS
 * Base URL: http://localhost:3007/apply
 * 
 * --- 1. AACP Infrastructure Systems Pvt Ltd. ---
 * LinkedIn: http://localhost:3007/apply?c=cmi2wcgia0000m8mvfye854j7&source=LinkedIn
 * WhatsApp: http://localhost:3007/apply?c=cmi2wcgia0000m8mvfye854j7&source=WhatsApp
 * 
 * --- 2. Zihwa Foods Pvt Ltd ---
 * LinkedIn: http://localhost:3007/apply?c=cmi2wcp4t0001m8mvz0fjy9m1&source=LinkedIn
 * WhatsApp: http://localhost:3007/apply?c=cmi2wcp4t0001m8mvz0fjy9m1&source=WhatsApp
 * 
 * --- 3. Zihwa Insights (OPC) Pvt Ltd ---
 * LinkedIn: http://localhost:3007/apply?c=cmi2wdxhy0002m8mvffhwxv52&source=LinkedIn
 * WhatsApp: http://localhost:3007/apply?c=cmi2wdxhy0002m8mvffhwxv52&source=WhatsApp
 * 
 * --- 4. Stalks N Spice ---
 * LinkedIn: http://localhost:3007/apply?c=cmi2wf0mh0003m8mv2msy4rt8&source=LinkedIn
 * WhatsApp: http://localhost:3007/apply?c=cmi2wf0mh0003m8mv2msy4rt8&source=WhatsApp
 * 
 * --- 5. Pars Optima Enterprises LLP ---
 * LinkedIn: http://localhost:3007/apply?c=cmi2wfc480004m8mvjq48dc5h&source=LinkedIn
 * WhatsApp: http://localhost:3007/apply?c=cmi2wfc480004m8mvjq48dc5h&source=WhatsApp
 * 
 * --- 6. Fluvium ---
 * LinkedIn: http://localhost:3007/apply?c=cmi2wftmo0005m8mvrzk61acf&source=LinkedIn
 * WhatsApp: http://localhost:3007/apply?c=cmi2wftmo0005m8mvrzk61acf&source=WhatsApp
 * 
 * NOTE: When you deploy to production, replace "http://localhost:3007" 
 * with your real domain (e.g., https://zihwa.com)
 */

"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { UploadCloud, CheckCircle2, Loader2 } from "lucide-react";


function ApplyForm() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("Our Team");

  // URL parameters: /apply?c=[COMPANY_ID]&source=LinkedIn
  const companyId = searchParams.get("c"); 
  const source = searchParams.get("source") || "Website";

  // --- FETCH COMPANY NAME ON LOAD ---
  useEffect(() => {
    if (companyId) {
      fetch(`/api/public/apply?c=${companyId}`)
        .then((res) => res.json())
        .then((data) => setCompanyName(data.name || "Our Team"))
        .catch(() => setCompanyName("Our Team"));
    }
  }, [companyId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!companyId) return alert("Invalid Application Link: Missing Company ID");
    if (!phone) return alert("Please enter a valid phone number");
    
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("companyId", companyId);
    formData.append("source", source);
    formData.append("phone", `+91${phone}`);// Send formatted phone with country code

    try {
      const res = await fetch("/api/public/apply", { method: "POST", body: formData });
      const data = await res.json(); 

      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        alert(`Submission Failed: ${data.error || "Unknown Error"}`);
      }
    } catch {
      alert("Network error: Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-slate-50">
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 max-w-md">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 text-capitalize">Application Submitted!</h2>
        <p className="text-slate-500 mt-2">The team at <strong>{companyName}</strong> will review your profile and contact you if shortlisted.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-4 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-slate-900 text-capitalize">Join {companyName}</h1>
          <p className="text-slate-500 mt-1">Submit your details to start the application process.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-gray-700 bg-white p-10 rounded-2xl shadow-sm border border-slate-100">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Full Name <span className="text-red-500">*</span></label>
              <Input name="name" required placeholder="John Doe" className="h-12 border-slate-200" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Email Address <span className="text-red-500">*</span></label>
              <Input name="email" type="email" required placeholder="john@example.com" className="h-12 border-slate-200" />
            </div>
          </div>

          <div className="space-y-2">
  <label className="text-xs font-bold text-slate-500 uppercase">
    Phone Number <span className="text-red-500">*</span>
  </label>
  <div className="flex items-center border border-slate-200 rounded-md px-2 h-12 bg-white hover:border-slate-400 focus-within:border-slate-400 transition-colors">
    
    {/* Hardcoded Country Code Prefix */}
    <span className="text-slate-500 font-s pr-6 border-r border-slate-200 mr-3">
      +91
    </span>
    
    {/* Standard HTML Input */}
    <input
      type="tel"
      name="phone"
      required
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      placeholder="12345 67890"
      maxLength={10}
      className="w-full outline-none bg-transparent text-gray-700"
    />
  </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Applying for Designation</label>
              <Input name="designation" placeholder="e.g. Software Engineer" className="h-12 border-slate-200" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Highest Qualification <span className="text-red-500">*</span></label>
              <Input name="qualification" required placeholder="e.g. B.Tech / MBA" className="h-12 border-slate-200" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Experience (Years)</label>
              <Input name="experience" type="number" placeholder="e.g. 3" className="h-12 border-slate-200" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current CTC (Annual)</label>
            <Input name="currentCTC" placeholder="e.g. 5,00,000 (Optional)" className="h-12 border-slate-200" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resume (PDF/DOC) <span className="text-red-500">*</span></label>
            <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors group">
              <input 
                type="file" 
                name="resume" 
                required 
                accept=".pdf,.doc,.docx" 
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
              <UploadCloud className="mx-auto text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-semibold text-slate-600">
                {selectedFile ? selectedFile.name : "Click or drag to upload resume"}
              </p>
              {!selectedFile && <p className="text-[10px] text-red-400 mt-2 font-bold uppercase italic">Mandatory Field</p>}
            </div>
          </div>

          <Button disabled={loading} className="w-full bg-[#0f172a] hover:bg-black h-14 text-white font-bold rounded-xl text-lg transition-all shadow-md">
            {loading ? <Loader2 className="animate-spin" /> : "Submit Application"}
          </Button>
        </form>
      </div>
      
      {/* Small CSS fix for PhoneInput flags */}
      <style jsx global>{`
        .PhoneInputInput {
          outline: none;
          margin-left: 10px;
          font-size: 14px;
        }
        .text-capitalize { text-transform: capitalize; }
      `}</style>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-20"><Loader2 className="animate-spin text-slate-400" /></div>}>
      <ApplyForm />
    </Suspense>
  );
}