import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';
import { fileUtils } from '@/lib/supabase'; 

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const SUPABASE_URL = "https://fbflxwzygztakprsrmpc.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiZmx4d3p5Z3p0YWtwcnNybXBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjgyMDMsImV4cCI6MjA3NzI0NDIwM30.egkR5uHFFfoZrcT8_WPVeVOznFTsOBPwheVb09QKd10";

// --- NEW GET METHOD: Fetches Company Name for the Page Title ---
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("c");

  if (!companyId) return NextResponse.json({ name: "Our Team" });

  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { name: true },
    });
    return NextResponse.json({ name: company?.name || "Our Team" });
  } catch {
    return NextResponse.json({ name: "Our Team" });
  }
}

// --- EXISTING POST METHOD: Handles Form Submission ---
export async function POST(request: Request) {
  try {
    const supabasePublic = createClient(SUPABASE_URL, ANON_KEY);
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const qualification = formData.get('qualification') as string;
    const file = formData.get('resume') as File;
    const companyId = formData.get('companyId') as string;

    if (!name || !email || !phone || !qualification || !file || !companyId) {
      return NextResponse.json({ success: false, error: "Missing mandatory fields." }, { status: 400 });
    }

    const fileName = fileUtils.generateFileName(file.name);
    const { error: uploadError } = await supabasePublic.storage
      .from('documents')
      .upload(fileName, file);

    if (uploadError) {
      return NextResponse.json({ success: false, error: `Storage Error: ${uploadError.message}` }, { status: 500 });
    }

    const { data: { publicUrl } } = supabasePublic.storage.from('documents').getPublicUrl(fileName);

    await prisma.candidate.create({
      data: {
        name: name,
        email: email,
        phone: phone,
        qualification: qualification,
        designation: (formData.get('designation') as string) || "N/A",
        experience: (formData.get('experience') as string) || null,
        currentCTC: (formData.get('currentCTC') as string) || null,
        resumeUrl: publicUrl,
        source: (formData.get('source') as string) || 'Website',
        companyId: companyId,
        status: "SCREENING"
      }
    });

    return NextResponse.json({ success: true });
  }  catch (error: unknown) {                                       // Fix 3: 'any' → 'unknown'
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}