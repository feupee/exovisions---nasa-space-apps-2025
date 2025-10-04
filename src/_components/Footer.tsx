import React from "react";

const Footer = () => {
  return (
    <div className="relative w-full mt-20">
      {/* Large ellipse footer */}
      <div
        className="w-full h-80 bg-gradient-to-b from-[#1e3a8a] to-[#0f172a]"
        style={{
          clipPath: "ellipse(100% 100% at 50% 100%)",
        }}
      >
        <div className="flex items-end justify-center h-full pb-8">
          <div className="text-center text-white/80">
            <p className="text-sm">
              &copy; 2025 ExoVision. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
