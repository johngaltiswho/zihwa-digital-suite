// import Link from 'next/link';

// export default function CuisineCategories() {
//   const cuisines = [
//     {
//       name: 'Indian',
//       emoji: '🍛',
//       description: 'Authentic spices from the subcontinent',
//       color: 'from-orange-500 to-red-500'
//     },
//     {
//       name: 'Italian',
//       emoji: '🍝',
//       description: 'Mediterranean herbs and seasonings',
//       color: 'from-green-500 to-red-500'
//     },
//     {
//       name: 'Mexican',
//       emoji: '🌮',
//       description: 'Bold and vibrant flavors',
//       color: 'from-red-500 to-yellow-500'
//     },
//     {
//       name: 'Thai',
//       emoji: '🍜',
//       description: 'Aromatic herbs and exotic spices',
//       color: 'from-green-500 to-blue-500'
//     },
//     {
//       name: 'Chinese',
//       emoji: '🥢',
//       description: 'Traditional five-spice and more',
//       color: 'from-red-500 to-yellow-500'
//     },
//     {
//       name: 'Mediterranean',
//       emoji: '🫒',
//       description: 'Olive oils, herbs, and seasonings',
//       color: 'from-blue-500 to-green-500'
//     },
//     {
//       name: 'Middle Eastern',
//       emoji: '🧄',
//       description: 'Exotic spices and sumac',
//       color: 'from-purple-500 to-pink-500'
//     },
//     {
//       name: 'Korean',
//       emoji: '🌶️',
//       description: 'Gochugaru and fermented flavors',
//       color: 'from-red-500 to-orange-500'
//     }
//   ];

//   return (
//     <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//       {cuisines.map((cuisine) => (
//         <Link
//           key={cuisine.name}
//           href={`/shop/cuisine/${cuisine.name.toLowerCase()}`}
//           className="group"
//         >
//           <div className="sns-card-gradient p-8 text-center h-full hover-lift group relative overflow-hidden">
//             {/* Subtle background pattern */}
//             <div className="absolute inset-0 opacity-5">
//               <div className="absolute top-2 right-2 w-8 h-8 bg-current rounded-full"></div>
//               <div className="absolute bottom-2 left-2 w-6 h-6 bg-current rounded-full"></div>
//             </div>
            
//             <div className="relative z-10">
//               <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${cuisine.color} rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
//                 {cuisine.emoji}
//               </div>
//               <h3 className="text-xl font-bold sns-text-primary mb-3 group-hover:text-orange-600 transition-colors duration-300">
//                 {cuisine.name}
//               </h3>
//               <p className="text-sm sns-text-secondary mb-4 leading-relaxed">
//                 {cuisine.description}
//               </p>
//               <div className="inline-flex items-center text-orange-600 font-semibold text-sm group-hover:text-orange-700 transition-colors duration-300">
//                 Explore
//                 <span className="ml-1 group-hover:translate-x-1 transition-transform duration-300">→</span>
//               </div>
//             </div>
//           </div>
//         </Link>
//       ))}
//     </div>
//   );
// }