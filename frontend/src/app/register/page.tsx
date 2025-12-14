"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Mail, Lock, User, ArrowLeft, Star, ShieldCheck } from "lucide-react";
import { gsap } from "gsap";

export default function RegisterPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Animation ngược lại so với Login
    tl.fromTo(imageRef.current,
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
    )
    .fromTo(formRef.current,
      { x: 50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: "power3.out" },
      "-=0.8"
    );
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen flex bg-black overflow-hidden">

      {/* --- LEFT SIDE: IMAGE & BENEFITS --- */}
      <div ref={imageRef} className="hidden lg:block w-1/2 relative">
        <div className="absolute inset-0 bg-gold/5 mix-blend-overlay z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-black via-transparent to-transparent z-20"></div>

        {/* Ảnh trang sức/kim cương */}
        <img
            src="https://media.istockphoto.com/id/172850673/vi/anh/kim-c%C6%B0%C6%A1ng-m%C3%A0u-%C4%91en.jpg?s=612x612&w=0&k=20&c=U_s0PII55f2DIUguMT6DjFdcjeDHPeXlGYYPotzrVUE="
            alt="Luxury Diamonds"
            className="w-full h-full object-cover grayscale opacity-60"
        />

        {/* Nội dung đè lên ảnh */}
        <div className="absolute top-1/2 left-16 -translate-y-1/2 z-30 max-w-md">
            <h2 className="font-serif text-4xl text-white mb-8 leading-tight">
                Unlock the <span className="text-gold-gradient">Extraordinary</span>
            </h2>
            <ul className="space-y-6">
                <li className="flex items-start gap-4">
                    <div className="p-2 bg-gold/10 rounded-full"><Star className="w-5 h-5 text-gold" /></div>
                    <div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-wide">Private Auctions</h4>
                        <p className="text-zinc-400 text-xs mt-1">Access to off-market listings and exclusive events.</p>
                    </div>
                </li>
                <li className="flex items-start gap-4">
                    <div className="p-2 bg-gold/10 rounded-full"><ShieldCheck className="w-5 h-5 text-gold" /></div>
                    <div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-wide">Verified Authenticity</h4>
                        <p className="text-zinc-400 text-xs mt-1">Every item is vetted by world-class experts.</p>
                    </div>
                </li>
            </ul>
        </div>
      </div>

      {/* --- RIGHT SIDE: FORM --- */}
      <div ref={formRef} className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-16 relative z-10">
        <Link href="/" className="absolute top-10 right-10 flex items-center gap-2 text-zinc-500 hover:text-gold transition-colors group">
            <span className="text-xs uppercase tracking-widest">Back to Home</span>
            <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform rotate-180" />
        </Link>

        <div className="max-w-md w-full mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl text-white mb-2">Become a <span className="text-gold-gradient">Member</span></h1>
            <p className="text-zinc-500 mb-10 font-light">Join 50,000+ collectors worldwide.</p>

            <form className="space-y-5">
                <div className="space-y-2">
                    <label className="text-xs text-gold uppercase tracking-widest font-bold">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <input type="text" placeholder="John Doe" className="input-dark w-full py-4 pl-12 pr-4 rounded-sm text-sm" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs text-gold uppercase tracking-widest font-bold">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <input type="email" placeholder="name@example.com" className="input-dark w-full py-4 pl-12 pr-4 rounded-sm text-sm" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs text-gold uppercase tracking-widest font-bold">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <input type="password" placeholder="••••••••" className="input-dark w-full py-4 pl-12 pr-4 rounded-sm text-sm" />
                    </div>
                </div>

                <div className="flex items-start gap-3 mt-4">
                    <input type="checkbox" id="terms" className="mt-1 w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-gold focus:ring-gold" />
                    <label htmlFor="terms" className="text-xs text-zinc-500 leading-relaxed">
                        I agree to the <Link href="#" className="text-white hover:text-gold underline">Terms of Service</Link> and <Link href="#" className="text-white hover:text-gold underline">Privacy Policy</Link>.
                    </label>
                </div>

                <button type="button" className="btn-gold w-full py-4 font-bold tracking-[0.2em] text-sm uppercase rounded-sm mt-2 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-shadow">
                    Create Account
                </button>
            </form>

            <p className="mt-10 text-center text-zinc-500 text-sm">
                Already have an account? <Link href="/login" className="text-gold hover:underline">Sign In</Link>
            </p>
        </div>
      </div>

    </div>
  );
}