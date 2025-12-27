// interface HeroBannerProps {
//   title: string;
//   subtitle: string;
//   image: string;
// }

// export default function HeroBanner({ title, subtitle, image }: HeroBannerProps) {
//   return (
//     <section
//       className="relative h-[75vh] w-full flex items-center"
//       style={{
//         backgroundImage: `url(${image})`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//       }}
//     >
//       {/* Overlay */}
//       <div className="absolute inset-0 bg-black/40" />

//       {/* Content */}
//       <div className="relative z-10 max-w-5xl px-6 mx-auto text-white">
//         <h1 className="text-5xl md:text-6xl font-semibold leading-tight">
//           {title}
//         </h1>

//         <p className="mt-4 text-xl max-w-3xl">
//           {subtitle}
//         </p>

//         <div className="mt-8">
//           <button className="border border-white px-8 py-3 uppercase tracking-widest text-sm hover:bg-white hover:text-black transition">
//             Learn More
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }
