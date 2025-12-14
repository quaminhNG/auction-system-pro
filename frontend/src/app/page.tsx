"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Gem, Search, Star, ArrowRight, Bell, Crown, ShieldCheck, Globe
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  // Refs cơ bản
  const heroRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const watchRef = useRef<HTMLImageElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Refs cho Section mới
  const horizontalSectionRef = useRef<HTMLDivElement>(null);
  const horizontalWrapperRef = useRef<HTMLDivElement>(null);
  const memberCardRef = useRef<HTMLDivElement>(null);

  // --- EFFECT: PRELOADER ---
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loaderRef.current) {
        gsap.to(loaderRef.current, {
          opacity: 0,
          duration: 1,
          onComplete: () => setIsLoading(false)
        });
      }

      gsap.to('.hero-text', {
        opacity: 1, y: 0, stagger: 0.2, duration: 1.5, ease: "power3.out", delay: 0.5
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // --- EFFECT: ANIMATIONS TỔNG HỢP ---
  useEffect(() => {
    if (isLoading) return;

    // 1. Parallax Hero
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      gsap.to(heroRef.current, { x, y, duration: 1, ease: "power2.out" });
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 2. Masterpiece Animation
    if (watchRef.current) {
        gsap.to(watchRef.current, {
            y: -30, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut"
        });
        gsap.to(watchRef.current, {
            rotation: 15,
            scrollTrigger: { trigger: ".masterpiece-section", start: "top bottom", end: "bottom top", scrub: 1 }
        });
    }

    // 3. HORIZONTAL SCROLL (SECTION MỚI - WOW FACTOR 1)
    if (horizontalSectionRef.current && horizontalWrapperRef.current) {
        const sections = horizontalWrapperRef.current.children;

        gsap.to(sections, {
            xPercent: -100 * (sections.length - 1),
            ease: "none",
            scrollTrigger: {
                trigger: horizontalSectionRef.current,
                pin: true, // Ghim màn hình lại
                scrub: 1,  // Cuộn mượt theo ngón tay
                snap: 1 / (sections.length - 1), // Tự động căn chỉnh
                end: () => "+=" + horizontalWrapperRef.current!.offsetWidth // Độ dài cuộn
            }
        });
    }

    // 4. MEMBERSHIP CARD 3D (SECTION MỚI - WOW FACTOR 2)
    const handleCardMove = (e: MouseEvent) => {
        if (!memberCardRef.current) return;
        const rect = memberCardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Góc nghiêng
        const rotateX = ((y - centerY) / centerY) * -15;
        const rotateY = ((x - centerX) / centerX) * 15;

        // Hiệu ứng ánh sáng
        memberCardRef.current.style.setProperty('--mouse-x', `${x}px`);
        memberCardRef.current.style.setProperty('--mouse-y', `${y}px`);

        gsap.to(memberCardRef.current, {
            rotationX: rotateX,
            rotationY: rotateY,
            scale: 1.05,
            duration: 0.5,
            ease: "power2.out"
        });
    };

    const handleCardLeave = () => {
        if (!memberCardRef.current) return;
        gsap.to(memberCardRef.current, {
            rotationX: 0, rotationY: 0, scale: 1, duration: 0.5
        });
    };

    const cardSection = document.getElementById('membership-section');
    if(cardSection) {
        cardSection.addEventListener('mousemove', handleCardMove as any);
        cardSection.addEventListener('mouseleave', handleCardLeave);
    }

    // 5. Scroll Reveal (Chung)
    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach(element => {
      gsap.fromTo(element,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 1.2, ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 80%", toggleActions: "play none none reverse" }
        }
      );
    });

    // 6. Tilt Card Logic (Grid cũ)
    const cards = document.querySelectorAll('.tilt-card') as NodeListOf<HTMLElement>;
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((e.clientY - rect.top - centerY) / centerY) * -5;
            const rotateY = ((e.clientX - rect.left - centerX) / centerX) * 5;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if(cardSection) {
        cardSection.removeEventListener('mousemove', handleCardMove as any);
        cardSection.removeEventListener('mouseleave', handleCardLeave);
      }
    };
  }, [isLoading]);

  return (
    <>
      {/* --- PRELOADER --- */}
      {isLoading && (
        <div ref={loaderRef} className="fixed inset-0 bg-black z-[9999] flex justify-center items-center">
          <div className="text-center">
             <div className="font-serif text-3xl font-bold tracking-[0.5em] text-gold mb-4 animate-pulse">
               AUCTION ELITE
             </div>
             <div className="w-64 h-[1px] bg-zinc-800 mx-auto overflow-hidden">
               <div className="h-full w-full bg-gold animate-[shine_1s_ease-in-out_infinite]"></div>
             </div>
          </div>
        </div>
      )}

      {/* --- NAVIGATION --- */}
      <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <div className="container mx-auto px-6 h-24 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 border border-gold/30 rounded-full flex items-center justify-center group-hover:border-gold transition-colors">
                    <Gem className="w-5 h-5 text-gold" />
                </div>
                <div className="flex flex-col">
                    <span className="font-serif text-xl font-bold tracking-widest text-white">AUCTION</span>
                    <span className="text-[0.6rem] uppercase tracking-[0.3em] text-gold">Exclusive Bid</span>
                </div>
            </Link>
            <div className="hidden md:flex items-center gap-10 font-light text-sm tracking-widest text-zinc-400">
                {['COLLECTIONS', 'LIVE BIDDING', 'PRIVATE SALE'].map((item) => (
                  <Link key={item} href="#" className="hover:text-gold transition-colors relative group">
                    {item}
                    <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                ))}
            </div>
            <div className="flex items-center gap-6">
                <button className="text-white hover:text-gold transition-colors">
                  <Search className="w-5 h-5" />
                </button>
                <Link href="/login" className="px-8 py-3 border border-white/20 hover:border-gold hover:bg-gold/10 text-xs font-bold tracking-widest uppercase transition-all duration-300 text-white">
                    Login
                </Link>
            </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative h-screen overflow-hidden flex items-center justify-center">
        <div ref={heroRef} className="absolute inset-0 scale-110 transition-transform duration-100 ease-out">
            <img src="https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-40" alt="Luxury Background" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-radial-glow z-10 pointer-events-none"></div>

        <div className="relative z-20 text-center px-4 flex flex-col items-center justify-center h-full">
            <div className="overflow-hidden mb-6">
                <p className="hero-text text-gold tracking-[0.5em] text-xs md:text-sm uppercase font-bold translate-y-10 opacity-0">Beyond Luxury</p>
            </div>
            <div className="overflow-hidden mb-4">
                <h1 className="hero-text font-serif text-5xl md:text-8xl lg:text-9xl font-bold text-white leading-tight translate-y-20 opacity-0">TIMELESS</h1>
            </div>
            <div className="overflow-hidden mb-12">
                <h1 className="hero-text font-serif text-5xl md:text-8xl lg:text-9xl font-bold text-gold-gradient leading-tight translate-y-20 opacity-0">LEGACY</h1>
            </div>
            <div className="hero-text opacity-0 translate-y-10 flex justify-center gap-4">
                <button className="btn-gold px-12 py-5 font-bold tracking-[0.2em] text-sm uppercase rounded-sm">Start Bidding</button>
            </div>
        </div>
      </header>

      {/* --- MARQUEE --- */}
      <div className="bg-gold py-3 overflow-hidden border-y border-white/10 relative z-20">
        <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(2)].map((_, i) => (
               <div key={i} className="flex">
                 <span className="mx-8 text-black font-bold tracking-widest text-sm uppercase flex items-center gap-4"><Star className="w-4 h-4" /> Patek Philippe Nautilus Ref. 5711</span>
                 <span className="mx-8 text-black font-bold tracking-widest text-sm uppercase flex items-center gap-4"><Star className="w-4 h-4" /> Rolls-Royce Phantom VIII</span>
                 <span className="mx-8 text-black font-bold tracking-widest text-sm uppercase flex items-center gap-4"><Star className="w-4 h-4" /> Pink Star Diamond 59.60ct</span>
                 <span className="mx-8 text-black font-bold tracking-widest text-sm uppercase flex items-center gap-4"><Star className="w-4 h-4" /> Ferrari 250 GTO 1962</span>
                 <span className="mx-8 text-black font-bold tracking-widest text-sm uppercase flex items-center gap-4"><Star className="w-4 h-4" /> Hermès Birkin Himalaya</span>
               </div>
            ))}
        </div>
      </div>

      {/* --- NEW SECTION 1: HORIZONTAL SCROLL COLLECTIONS (WOW FACTOR) --- */}
      <section ref={horizontalSectionRef} className="relative h-screen bg-black overflow-hidden flex items-center">
        {/* Tiêu đề cố định */}
        <div className="absolute top-10 left-10 z-20">
            <h3 className="text-gold uppercase tracking-[0.3em] text-xs font-bold mb-2">Curated Collections</h3>
            <h2 className="font-serif text-4xl text-white">The Vault</h2>
        </div>

        <div ref={horizontalWrapperRef} className="flex h-full w-[300vw]">
          {/* Panel 1: Classic Cars */}
          <div className="w-screen h-full flex-shrink-0 relative group">
             <img src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-1000" alt="Cars" />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
             <div className="absolute bottom-20 left-20">
                 <h1 className="font-serif text-8xl text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600 opacity-20 group-hover:opacity-100 transition-opacity duration-500">CLASSIC</h1>
                 <p className="text-white text-xl tracking-widest mt-2 border-l-2 border-gold pl-4">Vintage & Supercars</p>
             </div>
          </div>
          {/* Panel 2: Fine Watches */}
          <div className="w-screen h-full flex-shrink-0 relative group">
             <img src="https://images.unsplash.com/photo-1596516109370-29001ec8636b?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-1000" alt="Watches" />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
             <div className="absolute bottom-20 left-20">
                 <h1 className="font-serif text-8xl text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600 opacity-20 group-hover:opacity-100 transition-opacity duration-500">TIMEPIECES</h1>
                 <p className="text-white text-xl tracking-widest mt-2 border-l-2 border-gold pl-4">Rare & Complicated</p>
             </div>
          </div>
          {/* Panel 3: High Jewelry */}
          <div className="w-screen h-full flex-shrink-0 relative group">
             <img src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2075&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-1000" alt="Jewelry" />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
             <div className="absolute bottom-20 left-20">
                 <h1 className="font-serif text-8xl text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600 opacity-20 group-hover:opacity-100 transition-opacity duration-500">HIGH JEWELRY</h1>
                 <p className="text-white text-xl tracking-widest mt-2 border-l-2 border-gold pl-4">Diamonds & Gemstones</p>
             </div>
          </div>
        </div>
      </section>

      {/* --- MASTERPIECE SECTION --- */}
      <section className="py-32 bg-zinc-950 relative overflow-visible masterpiece-section">
        <div ref={glowRef} className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[150px] pointer-events-none z-0"></div>
        <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-0 items-center">
               <div className="order-2 lg:order-1 scroll-reveal opacity-0 relative z-20 pr-10 text-center">
                   <div className="inline-block border border-gold/30 px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
                       <span className="text-gold uppercase tracking-[0.2em] text-[10px] font-bold">Masterpiece of the Month</span>
                   </div>
                   <h2 className="font-serif text-5xl md:text-7xl text-white mb-6 leading-none">
                       Jacob & Co. <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-700">Astronomia</span>
                   </h2>

                   {/* Đã thêm mx-auto và bỏ border-l-2 để căn giữa đẹp hơn */}
                   <p className="text-zinc-400 font-light leading-relaxed mb-8 text-lg max-w-lg mx-auto">
                       Một vũ trụ thu nhỏ trên cổ tay. Cơ chế Tourbillon ba trục trọng lực, hiển thị thời gian thiên văn và mô hình trái đất quay 3D.
                   </p>

                   <div className="grid grid-cols-2 gap-8 mb-10 max-w-md mx-auto"> {/* Thêm mx-auto cho cả phần giá tiền nếu cần */}
                       <div>
                           <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Current Bid</p>
                           <p className="text-3xl text-white font-serif">$3.5M</p>
                       </div>
                       <div>
                           <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Ends In</p>
                           <p className="text-3xl text-gold font-serif">02d 08h</p>
                       </div>
                   </div>

                   {/* Căn giữa nút bấm */}
                   <div className="flex justify-center">
                       <button className="group btn-gold px-12 py-4 font-bold tracking-widest text-xs uppercase rounded-sm flex items-center gap-2">
                           Place Bid <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                       </button>
                   </div>
               </div>
                <div className="order-1 lg:order-2 relative flex justify-center items-center h-[600px]">
                    <div className="absolute w-[120%] h-[120%] border border-white/5 rounded-full animate-[rotate_60s_linear_infinite] pointer-events-none"></div>
                    <div className="absolute w-[90%] h-[90%] border border-gold/10 rounded-full animate-[rotate_40s_linear_infinite_reverse] pointer-events-none"></div>
                    <img
                         ref={watchRef}
                         src="http://www.pngall.com/wp-content/uploads/2/Golden-Rolex-Watch.png"
                         className="relative w-[450px] h-[450px] object-cover animate-float z-10 rounded-full border border-white/10 shadow-2xl"
                         alt="Luxury Watch Masterpiece"
                    />
                </div>
            </div>
        </div>
      </section>

      {/* --- LIVE AUCTIONS --- */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-6">
            <div className="flex justify-between items-end mb-16 scroll-reveal opacity-0">
                <h2 className="font-serif text-4xl text-white">Live Auctions</h2>
                <Link href="#" className="text-xs text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">View All Lots</Link>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                {/* Card 1 */}
                <div className="tilt-card group relative h-[500px] bg-zinc-900 overflow-hidden cursor-pointer scroll-reveal opacity-0">
                    <img src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=2070&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100" alt="Car" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
                    <div className="absolute top-6 right-6 z-20">
                        <span className="bg-red-600/20 text-red-500 border border-red-500/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md animate-pulse">Live</span>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full p-8 transform translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
                        <p className="text-gold text-xs uppercase tracking-widest mb-2">Supercars</p>
                        <h3 className="font-serif text-2xl text-white mb-4">Lamborghini Aventador</h3>
                        <div className="h-[1px] w-full bg-white/20 mb-4 group-hover:bg-gold transition-colors"></div>
                        <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                             <div>
                                <span className="text-zinc-500 text-xs uppercase block">Current Bid</span>
                                <span className="text-white font-serif text-xl">$520,000</span>
                            </div>
                            <button className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-gold hover:border-gold hover:text-black transition-all">
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
                 {/* Card 2 */}
                 <div className="tilt-card group relative h-[500px] bg-zinc-900 overflow-hidden cursor-pointer scroll-reveal opacity-0">
                    <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2040&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100" alt="Art" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
                    <div className="absolute top-6 right-6 z-20">
                        <span className="bg-red-600/20 text-red-500 border border-red-500/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md animate-pulse">Live</span>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full p-8 transform translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
                        <p className="text-gold text-xs uppercase tracking-widest mb-2">Rare Art</p>
                        <h3 className="font-serif text-2xl text-white mb-4">Golden Abstract No.5</h3>
                        <div className="h-[1px] w-full bg-white/20 mb-4 group-hover:bg-gold transition-colors"></div>
                        <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                             <div>
                                <span className="text-zinc-500 text-xs uppercase block">Current Bid</span>
                                <span className="text-white font-serif text-xl">$85,000</span>
                            </div>
                            <button className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-gold hover:border-gold hover:text-black transition-all">
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
                 {/* Card 3 */}
                 <div className="tilt-card group relative h-[500px] bg-zinc-900 overflow-hidden cursor-pointer scroll-reveal opacity-0">
                    <img src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1974&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100" alt="Jewelry" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
                    <div className="absolute top-6 right-6 z-20">
                        <span className="bg-white/10 text-white border border-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">Upcoming</span>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full p-8 transform translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
                        <p className="text-gold text-xs uppercase tracking-widest mb-2">Jewelry</p>
                        <h3 className="font-serif text-2xl text-white mb-4">Sapphire & Diamond Tiara</h3>
                        <div className="h-[1px] w-full bg-white/20 mb-4 group-hover:bg-gold transition-colors"></div>
                        <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                             <div>
                                <span className="text-zinc-500 text-xs uppercase block">Starting Price</span>
                                <span className="text-white font-serif text-xl">$950,000</span>
                            </div>
                            <button className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-gold hover:border-gold hover:text-black transition-all">
                                <Bell className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- NEW SECTION 2: VIP MEMBERSHIP (WOW FACTOR) --- */}
      <section id="membership-section" className="py-40 bg-black relative overflow-hidden flex items-center justify-center">
        {/* Nền hiệu ứng lưới */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20"></div>

        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center relative z-10">
            <div>
                <span className="text-gold uppercase tracking-[0.2em] text-xs font-bold mb-4 block">Exclusive Access</span>
                <h2 className="font-serif text-5xl md:text-6xl text-white mb-6 leading-tight">
                    The <span className="text-gold-gradient">Black</span> Card
                </h2>
                <p className="text-zinc-400 font-light leading-relaxed mb-8 text-lg">
                    Mở khóa cánh cửa đến thế giới thượng lưu. Thành viên Black Card được tham gia các phiên đấu giá kín, hỗ trợ 24/7 và tham dự các sự kiện Private trên toàn cầu.
                </p>
                <div className="space-y-4 mb-10">
                    <div className="flex items-center text-white gap-4">
                        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center"><Crown className="w-4 h-4 text-gold"/></div>
                        <span>Private Bidding Access</span>
                    </div>
                    <div className="flex items-center text-white gap-4">
                        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center"><Globe className="w-4 h-4 text-gold"/></div>
                        <span>Global Concierge Service</span>
                    </div>
                    <div className="flex items-center text-white gap-4">
                        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center"><ShieldCheck className="w-4 h-4 text-gold"/></div>
                        <span>Asset Authentication</span>
                    </div>
                </div>
                <button className="btn-gold px-12 py-5 font-bold tracking-[0.2em] text-sm uppercase rounded-sm">
                    Request Invitation
                </button>
            </div>

            {/* THE 3D HOLOGRAPHIC CARD */}
            <div className="flex justify-center perspective-1000">
                <div ref={memberCardRef} className="relative w-[400px] h-[250px] bg-zinc-900 rounded-xl border border-white/10 shadow-2xl transform-style-3d group cursor-pointer overflow-hidden">
                    {/* Texture nền */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>

                    {/* Hiệu ứng Shine theo chuột */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(212,175,55,0.4),transparent_50%)] z-10"></div>

                    {/* Nội dung thẻ */}
                    <div className="relative z-20 p-8 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start">
                            <Gem className="w-8 h-8 text-gold" />
                            <span className="text-white/50 font-mono text-sm">0000 0000 0000 0000</span>
                        </div>
                        <div>
                             <h3 className="text-gold-gradient font-serif text-2xl tracking-widest uppercase mb-1">MEMBER</h3>
                             <p className="text-white/50 text-[10px] tracking-[0.3em] uppercase">Private Auction Club</p>
                        </div>
                    </div>

                    {/* Viền sáng chạy quanh */}
                    <div className="absolute inset-0 border border-gold/30 rounded-xl"></div>
                </div>
            </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-zinc-950 border-t border-white/5 py-16">
        <div className="container mx-auto px-6 text-center">
             <Gem className="w-8 h-8 text-gold mx-auto mb-6" />
             <p className="font-serif text-2xl text-white tracking-widest mb-8">AUCTION ELITE</p>
             <div className="flex justify-center gap-8 mb-8 text-xs font-bold tracking-widest text-zinc-500 uppercase">
                 <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                 <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                 <Link href="#" className="hover:text-white transition-colors">Contact</Link>
             </div>
             <p className="text-zinc-700 text-xs">© 2025 Luxury Auction Inc. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}