"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Smooth anchor navigation handler
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[href*="#"]');
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href) return;

      const hash = href.includes("#") ? href.substring(href.indexOf("#") + 1) : "";
      if (!hash) return;

      // If linking to hash on current page
      const isExternalOrOtherPage =
        href.startsWith("/") &&
        !href.startsWith("/#") &&
        !window.location.pathname.endsWith(href.split("#")[0]);

      if (isExternalOrOtherPage) {
        return; // Allow Next.js link navigation
      }

      const targetEl = document.getElementById(hash);
      if (targetEl) {
        e.preventDefault();
        if (hash === "home") {
          lenis.scrollTo(0, {
            duration: 1.3,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        } else {
          lenis.scrollTo(targetEl, {
            offset: -80,
            duration: 1.3,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    // Check if initial load has hash
    if (window.location.hash) {
      const initialHash = window.location.hash.substring(1);
      setTimeout(() => {
        const targetEl = document.getElementById(initialHash);
        if (targetEl && lenisRef.current) {
          lenisRef.current.scrollTo(targetEl, {
            offset: -40,
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        }
      }, 200);
    }

    // 1. Hero entrance
    gsap.fromTo(
      ".hero-element",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.1,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.15,
      }
    );

    // 2. Project cards reveal
    const projectCards = gsap.utils.toArray<HTMLElement>(".project-card");
    projectCards.forEach((card) => {
      gsap.fromTo(
        card,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // 3. Tool box stagger
    gsap.fromTo(
      ".tool-card",
      { y: 30, opacity: 0, scale: 0.96 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.65,
        stagger: 0.06,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#tools",
          start: "top 85%",
        },
      }
    );

    // 4. Design thoughts stagger
    gsap.fromTo(
      ".thought-card",
      { y: 45, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.85,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#thoughts",
          start: "top 85%",
        },
      }
    );

    // 5. Contact form stagger
    gsap.fromTo(
      ".contact-element",
      { y: 35, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#contact",
          start: "top 85%",
        },
      }
    );

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return <>{children}</>;
}
