import TrackingSection from "@/components/TrackingSection";
import Newsletter from "@/components/NewsLetter";

export default function TrackingPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Centering the section on the page */}
      <div className="flex items-center justify-center min-h-[70vh]">
         <TrackingSection />
      </div>
       <Newsletter /> 
    </main>
  );
}