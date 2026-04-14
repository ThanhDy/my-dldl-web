import React from "react";

export default function HungThuSkeleton() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1e1b4b_0%,#020617_100%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10 animate-pulse">
        {/* Header Skeleton */}
        <div className="space-y-6 mb-16">
          <div className="w-32 h-10 bg-white/5 rounded-xl border border-white/5" />
          <div className="h-20 w-3/4 bg-white/5 rounded-2xl" />
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* List Section Skeleton */}
          <div className="lg:col-span-4 space-y-4">
             <div className="h-14 bg-white/[0.03] border border-white/10 rounded-2xl w-full" />

             <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="p-4 rounded-3xl border border-white/5 bg-white/[0.02] flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/5" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-white/10 rounded w-2/3" />
                      <div className="h-3 bg-white/5 rounded w-1/3" />
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Details Section Skeleton */}
          <div className="lg:col-span-8">
            <div className="bg-white/[0.02] border border-white/10 rounded-[3rem] p-8 space-y-8 h-[600px]">
               <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className="w-28 h-28 rounded-3xl bg-white/5" />
                  <div className="space-y-4 flex-1">
                     <div className="h-10 bg-white/10 rounded-xl w-1/2" />
                     <div className="flex gap-2">
                        <div className="h-8 w-24 bg-white/5 rounded-2xl" />
                        <div className="h-8 w-24 bg-white/5 rounded-2xl" />
                     </div>
                  </div>
               </div>

               <div className="space-y-4 pt-10">
                  <div className="h-4 bg-white/5 rounded w-full" />
                  <div className="h-4 bg-white/5 rounded w-full" />
                  <div className="h-24 bg-white/[0.03] rounded-3xl p-6" />
               </div>

               <div className="grid grid-cols-1 gap-6">
                  <div className="h-32 bg-slate-900/40 rounded-[2rem] border border-white/5" />
                  <div className="h-32 bg-slate-900/40 rounded-[2rem] border border-white/5" />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
