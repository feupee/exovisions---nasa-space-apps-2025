"use client";

import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="absolute w-full h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 w-screen h-screen pointer-events-none z-50">
        <div
          className="absolute top-0 left-0 w-screen"
          style={{ position: "relative" }}
        >
          <div
            className="absolute w-180 h-180 rounded-full blur-3xl opacity-70"
            style={{
              background:
                "radial-gradient(circle, rgba(30,64,175,0.7), transparent 100%)",
              animation: "orbitar1 15s linear infinite",
            }}
          ></div>
          <div
            className="absolute w-180 h-180 rounded-full blur-3xl opacity-60"
            style={{
              background:
                "radial-gradient(circle, rgba(30,64,175,0.6), transparent 100%)",
              animation: "orbitar2 20s linear infinite",
            }}
          ></div>

          <div
            className="absolute w-180 h-180 rounded-full blur-3xl opacity-50"
            style={{
              background:
                "radial-gradient(circle, rgba(30,64,175,0.5), transparent 100%)",
              animation: "orbitar3 25s linear infinite",
            }}
          ></div>

          <div
            className="absolute w-180 h-180 rounded-full blur-3xl opacity-50"
            style={{
              background:
                "radial-gradient(circle, rgba(30,64,175,0.5), transparent 100%)",
              animation: "orbitar4 30s linear infinite",
            }}
          ></div>
        </div>
      </div>

      <section className="relative w-full h-screen bg-black overflow-hidden">
        <nav className="absolute w-full z-50 px-6 py-6">
          <div className="flex items-center w-full">
            <div className="flex-1">
              <Image
                src="/logo.png"
                alt="ExoVision Logo"
                width={180}
                height={78}
              />
            </div>
          </div>
        </nav>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-50">
          <h1 className="text-5xl font-bold font-nunito">Bem-vindo ao ExoVision</h1>
          <p className="mt-4 text-lg">
            Identifique exoplanetas, suas consequências e seus impactos!
          </p>
          <div className="space-x-4">
            <Button className="mt-6 px-6 py-3 rounded- bg-blue-600 hover:bg-blue-500 transition cursor-pointer">
              Comece
            </Button>

            <Button className="mt-6 px-6 py-3 rounded- cursor-pointer">
              Saiba mais
              <ArrowRight className="ml-2 inline-block" />
            </Button>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes orbitar1 {
          0%   { top: 5%; left: 10%; }
          25%  { top: 35%; left: 85%; }
          50%  { top: 50%; left: 50%; }
          75%  { top: 20%; left: 5%; }
          100% { top: 5%; left: 10%; }
        }

        @keyframes orbitar2 {
          0%   { top: 45%; left: 20%; }
          25%  { top: 10%; left: 75%; }
          50%  { top: 5%; left: 40%; }
          75%  { top: 40%; left: 90%; }
          100% { top: 45%; left: 20%; }
        }

        @keyframes orbitar3 {
          0%   { top: 25%; left: 0%; }
          25%  { top: 5%; left: 30%; }
          50%  { top: 45%; left: 10%; }
          75%  { top: 50%; left: 60%; }
          100% { top: 25%; left: 80%; }
        }

        @keyframes orbitar4 {
          0%   { top: 15%; left: 60%; }
          25%  { top: 50%; left: 15%; }
          50%  { top: 30%; left: 90%; }
          75%  { top: 5%; left: 45%; }
          100% { top: 15%; left: 60%; }
        }
      `}</style>
    </div>
  );
}
