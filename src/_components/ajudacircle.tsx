import { HelpCircle } from "lucide-react";

const AjudaCircle = () => {
  return (
    <div className="flex items-center justify-center pb-20">
      <div className="relative">
        {/* Outer circle with gradient */}
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#011e43] to-[#011e43] flex items-center justify-center shadow-2xl border-4 border-gray-900">
          {/* Inner white circle */}
          <div className="rounded-full flex items-center justify-center">
            {/* Question mark icon */}
            <HelpCircle className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
        </div>
      </div>

    </div>
  );
};

export default AjudaCircle;
