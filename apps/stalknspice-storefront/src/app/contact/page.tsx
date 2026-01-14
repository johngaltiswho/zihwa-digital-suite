import ContactSection from "@/components/ContactSection";
import Newsletter from "@/components/NewsLetter";

export default function ContactPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Decorative background element (optional) */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gray-50 -z-10 hidden lg:block" />
      
      <ContactSection />
      
      {/* Newsletter usually looks good at the bottom of the contact page */}
      <div className="max-w-[1400px] mx-auto px-6 pb-20">
         <div className="bg-red-800 rounded-[50px] p-12 md:p-20 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-4">Stay Gourmet.</h2>
            <p className="text-red-100 font-medium mb-8">Subscribe for exclusive recipes and secret ingredients.</p>
            <div className="max-w-md mx-auto flex gap-2">
               <input type="email" placeholder="Your Email" className="flex-1 rounded-full px-6 py-3 text-black font-bold outline-none" />
               <button className="bg-black px-8 py-3 rounded-full font-bold uppercase text-xs tracking-widest">Join</button>
            </div>
         </div>
      </div>
       <Newsletter /> 
    </main>
  );
}