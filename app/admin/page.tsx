// app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Filter, 
  MoreVertical, 
  Users, 
  ExternalLink,
  ShieldAlert,
  Database,
  RefreshCw
} from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { optimizeCloudinary } from "@/lib/utils";

interface HeroSummary {
  id: string;
  name: string;
  rarity: string;
  type: string;
  image: string;
}

const rarityStyles: Record<string, string> = {
  "SP+": "bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]",
  "SP": "bg-purple-500/20 text-purple-400 border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.2)]",
  "SSR+": "bg-orange-500/20 text-orange-400 border-orange-500/50 shadow-[0_0_10px_rgba(249,115,22,0.2)]",
  "SSR": "bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]",
};

export default function AdminListPage() {
  const router = useRouter();
  const [heroes, setHeroes] = useState<HeroSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRarity, setFilterRarity] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");

  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/soul-masters");
      const data = await res.json();
      if (data.success) setHeroes(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Bạn có chắc chắn muốn xóa Hồn sư này?")) return;
    try {
      await fetch("/api/cloudinary/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: `soul-masters/${id}` }),
      });

      await fetch(`/api/soul-masters/${id}`, { method: "DELETE" });
      fetchHeroes();
    } catch (error) {
      alert("Lỗi khi xóa!");
    }
  };

  const filteredHeroes = heroes.filter((hero) => {
    const matchSearch =
      hero.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hero.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchRarity =
      filterRarity === "ALL" ||
      (filterRarity === "SP_ALL"
        ? hero.rarity.includes("SP")
        : hero.rarity === filterRarity);

    const matchType = filterType === "ALL" || hero.type === filterType;

    return matchSearch && matchRarity && matchType;
  });

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 md:p-2.5 bg-indigo-500/10 rounded-2xl ring-1 ring-indigo-500/20 shadow-lg shadow-indigo-500/5">
              <Users className="text-indigo-400" size={24} />
            </div>
            <h2 className="text-xl md:text-3xl font-black text-white tracking-tight uppercase">
              Danh Sách Hồn Sư
            </h2>
          </div>
          <p className="text-[11px] md:text-sm text-slate-500 ml-10 md:ml-14 font-medium">
            Quản lý cơ sở dữ liệu nhân vật • <span className="text-indigo-400 font-bold">{filteredHeroes.length}</span> kết quả
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 md:gap-4 w-full xl:w-auto">
          <div className="relative group min-w-[200px] flex-1 xl:min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
            <Input
              id="admin-search-input"
              type="text"
              placeholder="Tìm theo tên hoặc ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/40 backdrop-blur-md border-white/5 pl-11 pr-4 py-5 md:py-6 rounded-2xl text-xs md:text-sm focus-visible:ring-indigo-500/50 transition-all shadow-inner"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select id="admin-rarity-filter" value={filterRarity} onValueChange={(val) => val && setFilterRarity(val)}>
              <SelectTrigger className="flex-1 sm:w-[130px] bg-slate-900/40 backdrop-blur-md border-white/5 py-5 md:py-6 rounded-2xl text-xs md:text-sm text-slate-300 focus:ring-indigo-500/50">
                <div className="flex items-center gap-2">
                  <Filter size={14} className="opacity-40" />
                  <SelectValue placeholder="Hiếm" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-slate-900/95 backdrop-blur-xl border-white/5 text-slate-300 rounded-xl">
                <SelectItem value="ALL" className="focus:bg-indigo-600 focus:text-white cursor-pointer rounded-lg m-1">Tất cả</SelectItem>
                <SelectItem value="SP+" className="focus:bg-indigo-600 focus:text-white cursor-pointer rounded-lg m-1">SP+</SelectItem>
                <SelectItem value="SP" className="focus:bg-indigo-600 focus:text-white cursor-pointer rounded-lg m-1">SP</SelectItem>
                <SelectItem value="SSR+" className="focus:bg-indigo-600 focus:text-white cursor-pointer rounded-lg m-1">SSR+</SelectItem>
                <SelectItem value="SSR" className="focus:bg-indigo-600 focus:text-white cursor-pointer rounded-lg m-1">SSR</SelectItem>
              </SelectContent>
            </Select>

            <Link href="/admin/add" className="flex-1 sm:flex-none">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-6 md:px-8 py-5 md:py-6 rounded-2xl font-black text-[11px] md:text-[13px] uppercase tracking-widest flex items-center justify-center gap-2 md:gap-3 shadow-lg shadow-indigo-900/30 transition-all active:scale-95 group">
                <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                <span className="hidden sm:inline">Tạo Hồn Sư</span>
                <span className="sm:hidden">Tạo</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-blue-500/10 rounded-[1.5rem] md:rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        
        <div className="relative bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-2xl shadow-black/50 overflow-x-auto custom-scrollbar">
          <Table className="min-w-[600px] md:min-w-full">
            <TableHeader className="bg-white/[0.02] border-b border-white/5">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="w-[100px] py-6 pl-8 text-slate-500 font-black text-[10px] uppercase tracking-widest">Nhân vật</TableHead>
                <TableHead className="py-6 text-slate-500 font-black text-[10px] uppercase tracking-widest">Định danh</TableHead>
                <TableHead className="py-6 text-slate-500 font-black text-[10px] uppercase tracking-widest">Phẩm cấp</TableHead>
                <TableHead className="py-6 text-slate-500 font-black text-[10px] uppercase tracking-widest hidden sm:table-cell">Lớp / Hệ</TableHead>
                <TableHead className="py-6 text-right pr-8 text-slate-500 font-black text-[10px] uppercase tracking-widest">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-b border-white/[0.03]">
                    <TableCell className="py-5 pl-8">
                       <div className="w-14 h-14 rounded-2xl bg-slate-800 animate-pulse" />
                    </TableCell>
                    <TableCell className="py-5">
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-slate-800 rounded animate-pulse" />
                        <div className="h-3 w-20 bg-slate-900 rounded animate-pulse" />
                      </div>
                    </TableCell>
                    <TableCell className="py-5">
                      <div className="h-6 w-16 bg-slate-800 rounded-full animate-pulse" />
                    </TableCell>
                    <TableCell className="py-5 hidden sm:table-cell">
                      <div className="h-4 w-24 bg-slate-900 rounded animate-pulse" />
                    </TableCell>
                    <TableCell className="py-5 text-right pr-8">
                      <div className="h-8 w-8 bg-slate-800 rounded-xl ml-auto animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredHeroes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20 md:py-32">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-950 rounded-3xl flex items-center justify-center mx-auto border border-white/5 text-slate-800 mb-6">
                      <Database size={28} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-white font-bold text-base md:text-lg">Không tìm thấy hồn sư</p>
                      <p className="text-slate-500 text-xs md:text-sm max-w-xs mx-auto px-4">Thử tìm kiếm với từ khóa khác hoặc xóa các bộ lọc hiện tại.</p>
                      <Button 
                        variant="link" 
                        onClick={() => { setSearchTerm(""); setFilterRarity("ALL"); setFilterType("ALL"); }}
                        className="text-indigo-400 text-xs"
                      >
                        Reset bộ lọc
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredHeroes.map((hero) => (
                  <TableRow 
                    key={hero.id}
                    onClick={() => router.push(`/admin/edit/${hero.id}`)}
                    className="group-row border-b border-white/[0.03] hover:bg-white/[0.03] transition-all cursor-pointer"
                  >
                    <TableCell className="py-4 md:py-5 pl-8">
                      <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl overflow-hidden bg-slate-950 border border-white/10 group-hover:border-indigo-500/50 transition-all shadow-xl duration-500">
                        <Image 
                          src={optimizeCloudinary(hero.image, 100) || hero.image} 
                          alt={hero.name} 
                          fill 
                          className="object-cover" 
                          sizes="56px" 
                        />
                      </div>
                    </TableCell>
                    <TableCell className="py-4 md:py-5">
                      <div className="flex flex-col gap-1">
                        <span className="font-black text-white text-[13px] md:text-sm group-hover:text-indigo-400 transition-colors uppercase tracking-tight truncate max-w-[120px] md:max-w-none">{hero.name}</span>
                        <span className="text-[9px] md:text-[10px] text-slate-600 font-bold font-mono tracking-tighter bg-black/40 px-1.5 md:px-2 py-0.5 rounded-md w-fit truncate max-w-[100px] md:max-w-none">{hero.id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 md:py-5">
                      <Badge variant="outline" className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest ${
                        rarityStyles[hero.rarity] || "bg-slate-800 text-slate-400 border-slate-700"
                      }`}>
                        {hero.rarity}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 md:py-5 hidden sm:table-cell">
                      <div className="flex items-center gap-2 text-[11px] md:text-xs text-slate-400 font-bold group-hover:text-slate-200 transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" />
                        {hero.type}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 md:py-5 text-right pr-8">
                      <div className="flex items-center justify-end gap-1 md:gap-2" onClick={(e) => e.stopPropagation()}>
                         <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => router.push(`/admin/edit/${hero.id}`)}
                          className="h-8 w-8 md:h-9 md:w-9 rounded-xl text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
                        >
                          <Edit3 size={16} />
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger render={
                            <Button variant="ghost" size="icon" className="h-8 w-8 md:h-9 md:w-9 rounded-xl text-slate-600 hover:text-white hover:bg-white/5">
                              <MoreVertical size={16} />
                            </Button>
                          } />
                          <DropdownMenuContent align="end" className="bg-slate-900/95 backdrop-blur-xl border-white/10 text-slate-200 p-2 rounded-2xl shadow-2xl">
                            <DropdownMenuItem 
                              onClick={() => router.push(`/admin/edit/${hero.id}`)} 
                              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 cursor-pointer focus:bg-white/5 focus:text-indigo-400 transition-all font-bold text-xs"
                            >
                              <ExternalLink size={14} className="text-indigo-400" /> XEM CHI TIẾT
                            </DropdownMenuItem>
                            <div className="h-px bg-white/5 my-1" />
                            <DropdownMenuItem 
                              onClick={(e) => handleDelete(e as any, hero.id)} 
                              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-500 cursor-pointer focus:bg-red-500/10 focus:text-red-500 transition-all font-bold text-xs"
                            >
                              <Trash2 size={14} /> XÓA DỮ LIỆU
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {!loading && filteredHeroes.length > 0 && (
        <div className="flex items-center gap-4 md:gap-6 px-4 py-2 opacity-50 flex-wrap">
           <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
            <ShieldAlert size={12} /> Data Sync
          </div>
          <div className="hidden sm:block h-1 w-1 rounded-full bg-slate-800" />
           <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
            <Database size={12} /> Atlas Connected
          </div>
          <div className="hidden sm:block h-1 w-1 rounded-full bg-slate-800" />
          <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
            <RefreshCw size={12} className="animate-spin-slow" /> Optimized Assets
          </div>
        </div>
      )}
    </div>
  );
}
