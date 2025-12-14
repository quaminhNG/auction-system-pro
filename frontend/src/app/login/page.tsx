"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Mail, Lock, ArrowLeft, CheckCircle } from "lucide-react";
import { gsap } from "gsap";

export default function LoginPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Animation xuất hiện
    tl.fromTo(imageRef.current,
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
    )
    .fromTo(formRef.current,
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: "power3.out" },
      "-=0.8"
    );
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen flex bg-black overflow-hidden">

      {/* --- LEFT SIDE: FORM --- */}
      <div ref={formRef} className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-16 relative z-10">
        <Link href="/" className="absolute top-10 left-10 flex items-center gap-2 text-zinc-500 hover:text-gold transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs uppercase tracking-widest">Back to Home</span>
        </Link>

        <div className="max-w-md w-full mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl text-white mb-2">Welcome <span className="text-gold-gradient">Back</span></h1>
            <p className="text-zinc-500 mb-10 font-light">Sign in to access your private collection.</p>

            <form className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs text-gold uppercase tracking-widest font-bold">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <input type="email" placeholder="name@example.com" className="input-dark w-full py-4 pl-12 pr-4 rounded-sm text-sm" />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-xs text-gold uppercase tracking-widest font-bold">Password</label>
                        <Link href="#" className="text-xs text-zinc-500 hover:text-white transition-colors">Forgot Password?</Link>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <input type="password" placeholder="••••••••" className="input-dark w-full py-4 pl-12 pr-4 rounded-sm text-sm" />
                    </div>
                </div>

                <button type="button" className="btn-gold w-full py-4 font-bold tracking-[0.2em] text-sm uppercase rounded-sm mt-4 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-shadow">
                    Access Account
                </button>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800"></div></div>
                    <div className="relative flex justify-center"><span className="bg-black px-4 text-xs text-zinc-600 uppercase tracking-widest">Or continue with</span></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button type="button" className="flex items-center justify-center gap-2 py-3 border border-zinc-800 hover:border-gold/50 hover:bg-zinc-900 transition-all rounded-sm group">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" alt="Google"/>
                        <span className="text-xs text-zinc-400 group-hover:text-white">Google</span>
                    </button>
                    <button type="button" className="flex items-center justify-center gap-2 py-3 border border-zinc-800 hover:border-gold/50 hover:bg-zinc-900 transition-all rounded-sm group">
                        <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" alt="Facebook"/>
                        <span className="text-xs text-zinc-400 group-hover:text-white">Facebook</span>
                    </button>
                </div>
            </form>

            <p className="mt-10 text-center text-zinc-500 text-sm">
                Not a member yet? <Link href="/register" className="text-gold hover:underline">Apply for Membership</Link>
            </p>
        </div>
      </div>

      {/* --- RIGHT SIDE: IMAGE --- */}
      <div ref={imageRef} className="hidden lg:block w-1/2 relative">
        <div className="absolute inset-0 bg-gold/10 mix-blend-overlay z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-20"></div>

        <img
            src="https://cdn.pixabay.com/photo/2017/11/04/17/13/ferrari-360-2918130_1280.jpg"
            alt="Luxury Interior"
            className="w-full h-full object-cover"
        />

        <div className="absolute bottom-20 right-20 z-30 text-right">
            <h2 className="font-serif text-4xl text-white mb-2">The Art of Living</h2>
            <p className="text-gold tracking-widest text-sm uppercase">Join the elite circle</p>
        </div>
      </div>

    </div>
  );
}