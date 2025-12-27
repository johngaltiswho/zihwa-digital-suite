// // 
// import Image from "next/image";
// import Link from "next/link";

// export default function Header() {
//   return (
//     <header className="w-full bg-white border-b">
//       {/* Top utility bar */}
//       <div className="hidden md:flex justify-end text-xs tracking-wide px-10 py-2 text-gray-500">
//         <span className="mr-6 cursor-pointer hover:text-black">
//           INTRANET
//         </span>
//         <span className="cursor-pointer hover:text-black">
//           SUB CONTRACTOR REGISTRATION
//         </span>
//       </div>

//       {/* Main navigation */}
//       <div className="flex items-center justify-between px-8 md:px-16 py-5">
//         {/* Logo */}
//         <Link href="/" className="flex items-center">
//           <Image
//             src="/aacp-logo.jpg"
//             alt="AACP Logo"
//             width={84}
//             height={47}
//             priority
//           />
//         </Link>

//         {/* Nav */}
//         <nav className="hidden md:flex space-x-10 text-sm font-medium tracking-widest uppercase">
//           <Link href="/" className="hover:text-gray-600">Home</Link>
//           <Link href="/about" className="hover:text-gray-600">About</Link>
//           <Link href="/safety" className="hover:text-gray-600">Safety</Link>
//           <Link href="/strategy" className="hover:text-gray-600">Strategy</Link>
//           <Link href="/careers" className="hover:text-gray-600">Careers</Link>
//           <Link href="/news" className="hover:text-gray-600">News</Link>
//           <Link href="/projects" className="hover:text-gray-600">Projects</Link>
//           <Link href="/precast" className="hover:text-gray-600">Precast</Link>
//         </nav>
//       </div>
//     </header>
//   );
// }
