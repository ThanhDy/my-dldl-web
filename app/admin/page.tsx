// app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaPlus, FaSearch, FaTrash, FaEdit, FaFilter, FaEllipsisV } from "react-icons/fa";
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeroSummary {
  id: string;
  name: string;
  rarity: string;
  type: string;
  image: string;
}

export default function AdminListPage() {
  const router = useRouter();
  const [heroes, setHeroes] = useState<HeroSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 1. CÁC STATE BỘ LỌC ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRarity, setFilterRarity] = useState("ALL"); // ALL, SP, SSR...
  const [filterType, setFilterType] = useState("ALL"); // ALL, Cường Công...

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
      // 1. Xóa folder ảnh trên Cloudinary trước
      await fetch("/api/cloudinary/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: `soul-masters/${id}` }),
      });

      // 2. Sau đó xóa dữ liệu trong DB
      await fetch(`/api/soul-masters/${id}`, { method: "DELETE" });
      fetchHeroes(); // Load lại danh sách sau khi xóa
    } catch (error) {
      alert("Lỗi khi xóa!");
    }
  };

  // --- 2. LOGIC LỌC DỮ LIỆU (KẾT HỢP 3 ĐIỀU KIỆN) ---
  const filteredHeroes = heroes.filter((hero) => {
    // 1. Lọc theo Tên hoặc ID
    const matchSearch =
      hero.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hero.id.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Lọc theo Phẩm chất (Nếu chọn ALL thì luôn đúng)
    const matchRarity =
      filterRarity === "ALL" ||
      (filterRarity === "SP_ALL"
        ? hero.rarity.includes("SP")
        : hero.rarity === filterRarity);
    // Mẹo: SP_ALL để lọc cả SP và SP+ nếu muốn

    // 3. Lọc theo Hệ
    const matchType = filterType === "ALL" || hero.type === filterType;

    return matchSearch && matchRarity && matchType;
  });

  return (
    <div className="p-6 bg-slate-950 min-h-full font-sans">
      {/* HEADER & FILTERS */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-wide">
            Danh Sách Hồn Sư
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Hiển thị:{" "}
            <strong className="text-white">{filteredHeroes.length}</strong> /{" "}
            {heroes.length} bản ghi
          </p>
        </div>

        {/* KHU VỰC BỘ LỌC */}
        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
          {/* 1. Ô Tìm Kiếm */}
          <div className="relative group flex-1 sm:flex-none">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400" />
            <Input
              type="text"
              placeholder="Tìm tên, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-60 bg-slate-900 border-slate-800 pl-9 pr-4 py-2 text-sm focus-visible:ring-blue-500"
            />
          </div>

          {/* 2. Lọc Phẩm Chất */}
          <div className="relative flex-1 sm:flex-none">
            <Select value={filterRarity} onValueChange={(val) => val && setFilterRarity(val)}>
              <SelectTrigger className="w-full sm:w-[130px] bg-slate-900 border-slate-800 text-sm text-slate-300 focus:ring-blue-500">
                <SelectValue placeholder="Phẩm chất" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
                <SelectItem value="ALL" className="focus:bg-slate-800 focus:text-white cursor-pointer">Tất cả</SelectItem>
                <SelectItem value="SP+" className="focus:bg-slate-800 focus:text-white cursor-pointer">SP+</SelectItem>
                <SelectItem value="SP" className="focus:bg-slate-800 focus:text-white cursor-pointer">SP</SelectItem>
                <SelectItem value="SSR+" className="focus:bg-slate-800 focus:text-white cursor-pointer">SSR+</SelectItem>
                <SelectItem value="SSR" className="focus:bg-slate-800 focus:text-white cursor-pointer">SSR</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 3. Lọc Hệ */}
          <div className="relative flex-1 sm:flex-none">
            <Select value={filterType} onValueChange={(val) => val && setFilterType(val)}>
              <SelectTrigger className="w-full sm:w-[150px] bg-slate-900 border-slate-800 text-sm text-slate-300 focus:ring-blue-500">
                <SelectValue placeholder="Hệ" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
                <SelectItem value="ALL" className="focus:bg-slate-800 focus:text-white cursor-pointer">Tất cả</SelectItem>
                <SelectItem value="Cường Công" className="focus:bg-slate-800 focus:text-white cursor-pointer">Cường Công</SelectItem>
                <SelectItem value="Mẫn Công" className="focus:bg-slate-800 focus:text-white cursor-pointer">Mẫn Công</SelectItem>
                <SelectItem value="Khống Chế" className="focus:bg-slate-800 focus:text-white cursor-pointer">Khống Chế</SelectItem>
                <SelectItem value="Phụ Trợ" className="focus:bg-slate-800 focus:text-white cursor-pointer">Phụ Trợ</SelectItem>
                <SelectItem value="Phòng Ngự" className="focus:bg-slate-800 focus:text-white cursor-pointer">Phòng Ngự</SelectItem>
                <SelectItem value="Ám Khí" className="focus:bg-slate-800 focus:text-white cursor-pointer">Ám Khí</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Nút CREATE */}
          <Link href="/admin/add">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 font-bold gap-2 text-sm transition-transform active:scale-95 h-[36px]">
              <FaPlus /> Thêm
            </Button>
          </Link>
        </div>
      </header>

      {/* DANH SÁCH (TABLE) */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 text-slate-500 gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : filteredHeroes.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <p className="text-slate-500 font-bold">
            Không tìm thấy hồn sư phù hợp.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterRarity("ALL");
              setFilterType("ALL");
            }}
            className="text-blue-500 text-sm mt-2 hover:underline"
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <div className="border border-slate-800 rounded-lg bg-slate-900/50 overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-slate-900/90 border-b border-slate-800">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="w-[80px] text-slate-400 font-bold text-xs uppercase tracking-wider">Avatar</TableHead>
                <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider">Tên / ID</TableHead>
                <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider">Phẩm Chất</TableHead>
                <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider hidden md:table-cell">Hệ</TableHead>
                <TableHead className="text-right text-slate-400 font-bold text-xs uppercase tracking-wider pr-4">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHeroes.map((hero) => (
                <TableRow key={hero.id} className="border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors group cursor-pointer" onClick={() => router.push(`/admin/edit/${hero.id}`)}>
                  <TableCell>
                    <div className="w-10 h-10 relative rounded-md overflow-hidden bg-slate-800 border border-slate-700 group-hover:border-blue-500 transition-colors">
                      <Image src={hero.image} alt={hero.name} fill className="object-cover" sizes="40px" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-sm group-hover:text-blue-400 truncate">{hero.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono truncate">{hero.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`rounded text-[10px] whitespace-nowrap font-black uppercase ${
                      hero.rarity.includes("SP")
                        ? "bg-pink-900/20 text-pink-400 border-pink-500/30 shadow-[0_0_10px_rgba(236,72,153,0.1)]"
                        : hero.rarity === "SSR"
                          ? "bg-yellow-900/20 text-yellow-400 border-yellow-500/30"
                          : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}>
                      {hero.rarity}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-xs text-slate-300 bg-slate-950 px-2 py-1 rounded border border-slate-800 whitespace-nowrap">
                      {hero.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <div onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:ring-0 focus:outline-none">
                          <span className="sr-only">Open menu</span>
                          <FaEllipsisV className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200">
                          <DropdownMenuItem onClick={() => router.push(`/admin/edit/${hero.id}`)} className="hover:bg-slate-800 cursor-pointer focus:bg-slate-800 focus:text-white">
                            <FaEdit className="mr-2 h-4 w-4 text-blue-400" /> Sửa thông tin
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => handleDelete(e as any, hero.id)} className="hover:bg-red-900/40 text-red-500 cursor-pointer focus:bg-red-900/40 focus:text-red-500">
                            <FaTrash className="mr-2 h-4 w-4" /> Xóa hồn sư
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
