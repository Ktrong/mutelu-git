"use client";

import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { Plus, Trash2, Edit2, GripVertical, Save, AlignLeft, AlignCenter, AlignRight, CheckCircle2, X } from "lucide-react";
import { LayoutDashboard, Image as ImageIcon, Users, ShoppingCart, Settings, Monitor, Menu, DollarSign, Percent } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

type MenuAlignment = 'LEFT' | 'CENTER' | 'RIGHT';

interface NavigationMenu {
    id: string;
    label: string;
    url: string;
    position: number;
    alignment: MenuAlignment;
    isActive: boolean;
    fontSize: string;
    fontFamily: string;
    color: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminMenusPage() {
    const router = useRouter();
    const { data: menus, error, mutate } = useSWR<NavigationMenu[]>("/api/admin/menus", fetcher);
    const [menuList, setMenuList] = useState<NavigationMenu[]>([]);
    const [isSavingOrder, setIsSavingOrder] = useState(false);

    // Form state
    const [isEditing, setIsEditing] = useState(false);
    const [currentMenu, setCurrentMenu] = useState<Partial<NavigationMenu>>({
        label: "",
        url: "/",
        alignment: "CENTER",
        isActive: true,
        fontSize: "sm",
        fontFamily: "sans",
        color: "#4B5563"
    });

    useEffect(() => {
        if (menus) {
            // Sort by position safely
            setMenuList([...menus].sort((a, b) => a.position - b.position));
        }
    }, [menus]);

    // Drag and Drop handlers
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.dataTransfer.setData("text/plain", index.toString());
        e.currentTarget.classList.add("opacity-50");
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove("opacity-50");
        document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over', 'border-t-2', 'border-gold'));
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.classList.add("drag-over", "border-t-2", "border-gold");
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove("drag-over", "border-t-2", "border-gold");
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
        e.preventDefault();
        e.currentTarget.classList.remove("drag-over", "border-t-2", "border-gold");

        const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));
        if (dragIndex === dropIndex || isNaN(dragIndex)) return;

        const newList = [...menuList];
        const draggedItem = newList[dragIndex];

        // Remove item from old position
        newList.splice(dragIndex, 1);
        // Insert item at new position
        newList.splice(dropIndex, 0, draggedItem);

        // Update positions locally
        const updatedList = newList.map((item, index) => ({
            ...item,
            position: index
        }));

        setMenuList(updatedList);
    };

    // Save Reordered List
    const saveOrder = async () => {
        setIsSavingOrder(true);
        try {
            const updates = menuList.map((item) => ({ id: item.id, position: item.position }));
            const res = await fetch("/api/admin/menus/reorder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: updates }),
            });

            if (res.ok) {
                toast.success("บันทึกลำดับเมนูสำเร็จ");
                mutate();
            } else {
                toast.error("เกิดข้อผิดพลาดในการบันทึกลำดับ");
            }
        } catch (error) {
            toast.error("เกิดข้อผิดพลาด");
        } finally {
            setIsSavingOrder(false);
        }
    };

    // CRUD Handlers
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEditing && currentMenu.id ? `/api/admin/menus/${currentMenu.id}` : "/api/admin/menus";
        const method = isEditing && currentMenu.id ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(currentMenu),
            });

            if (res.ok) {
                toast.success(isEditing ? "แก้ไขเมนูสำเร็จ" : "สร้างเมนูสำเร็จ");
                setCurrentMenu({ label: "", url: "/", alignment: "CENTER", isActive: true, fontSize: "sm", fontFamily: "sans", color: "#4B5563" });
                setIsEditing(false);
                mutate();
            } else {
                toast.error("เกิดข้อผิดพลาด");
            }
        } catch (error) {
            toast.error("เกิดข้อผิดพลาด");
        }
    };

    const handleDelete = async (id: string, label: string) => {
        if (!confirm(`ยืนยันการลบเมนู "${label}" ใช่หรือไม่?`)) return;

        try {
            const res = await fetch(`/api/admin/menus/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("ลบเมนูสำเร็จ");
                mutate();
            } else {
                toast.error("ลบเมนูไม่สำเร็จ");
            }
        } catch (error) {
            toast.error("เกิดข้อผิดพลาด");
        }
    };

    const editMenu = (menu: NavigationMenu) => {
        setCurrentMenu(menu);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const cancelEdit = () => {
        setCurrentMenu({ label: "", url: "/", alignment: "CENTER", isActive: true, fontSize: "sm", fontFamily: "sans", color: "#4B5563" });
        setIsEditing(false);
    };

    if (error) return <div className="p-8 text-center text-red-500">Failed to load menus</div>;
    if (!menus) return <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div></div>;

    const alignmentIcon = (align: MenuAlignment) => {
        switch (align) {
            case 'LEFT': return <AlignLeft className="w-4 h-4" />;
            case 'CENTER': return <AlignCenter className="w-4 h-4" />;
            case 'RIGHT': return <AlignRight className="w-4 h-4" />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full overflow-y-auto custom-scrollbar">
                <div className="p-6">
                    <h2 className="text-2xl font-bold gold-text">Iucrative</h2>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Admin Console</p>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    <button onClick={() => router.push('/admin#dashboard')} className="w-full p-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors text-slate-400 hover:bg-white/5">
                        <LayoutDashboard className="w-4 h-4" /> แดชบอร์ด
                    </button>
                    <button onClick={() => router.push('/admin#wallpapers')} className="w-full p-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors text-slate-400 hover:bg-white/5">
                        <ImageIcon className="w-4 h-4" /> วอลเปเปอร์
                    </button>
                    <button onClick={() => router.push('/admin#categories')} className="w-full p-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors text-slate-400 hover:bg-white/5">
                        <Settings className="w-4 h-4" /> หมวดหมู่
                    </button>
                    <button onClick={() => router.push('/admin#slideshows')} className="w-full p-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors text-slate-400 hover:bg-white/5">
                        <Monitor className="w-4 h-4" /> สไลด์โชว์
                    </button>
                    <button onClick={() => router.push('/admin/menus')} className="w-full p-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors bg-white/10 text-white">
                        <Menu className="w-4 h-4" /> จัดการเมนู (Navbar)
                    </button>
                    <button onClick={() => router.push('/admin#users')} className="w-full p-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors text-slate-400 hover:bg-white/5">
                        <Users className="w-4 h-4" /> สมาชิก/แอดมิน
                    </button>
                    <button onClick={() => router.push('/admin#affiliate-apps')} className="w-full p-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors text-slate-400 hover:bg-white/5">
                        <Users className="w-4 h-4" /> คำขอเป็นตัวแทน
                    </button>
                    <button onClick={() => router.push('/admin#orders')} className="w-full p-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors text-slate-400 hover:bg-white/5">
                        <ShoppingCart className="w-4 h-4" /> รายการสั่งซื้อ (Custom)
                    </button>
                    <button onClick={() => router.push('/admin#faqs')} className="w-full p-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors text-slate-400 hover:bg-white/5">
                        <Settings className="w-4 h-4" /> คำถามที่พบบ่อย (FAQs)
                    </button>
                    <button onClick={() => router.push('/admin#commissions')} className="w-full p-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors text-slate-400 hover:bg-white/5">
                        <Percent className="w-4 h-4" /> Affiliate MLM
                    </button>
                    <button onClick={() => router.push('/admin#payouts')} className="w-full p-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors text-slate-400 hover:bg-white/5">
                        <DollarSign className="w-4 h-4" /> แจ้งถอนเงิน
                    </button>
                    <button onClick={() => router.push('/admin#payment-channels')} className="w-full p-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors text-slate-400 hover:bg-white/5">
                        <DollarSign className="w-4 h-4" /> ช่องทางรับเงิน
                    </button>
                </nav>

                <div className="p-6 border-t border-white/5">
                    <button
                        onClick={() => {
                            localStorage.removeItem('adminUser');
                            router.push('/admin/login');
                        }}
                        className="flex items-center gap-3 text-sm font-medium text-slate-400 hover:text-white"
                    >
                        <Settings className="w-4 h-4" /> ออกจากระบบ
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto">
                <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold font-asar tracking-wide text-slate-800">Menu Manager</h1>
                        <p className="text-sm text-slate-500">จัดการแถบเมนูนำทาง (Navbar)</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Form Section */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
                                <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800">
                                    {isEditing ? <Edit2 className="w-5 h-5 text-blue-500" /> : <Plus className="w-5 h-5 text-green-500" />}
                                    {isEditing ? "แก้ไขเมนู" : "เพิ่มเมนูใหม่"}
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">ชื่อเมนู (Label)</label>
                                        <input
                                            type="text"
                                            required
                                            value={currentMenu.label}
                                            onChange={(e) => setCurrentMenu({ ...currentMenu, label: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/50 outline-none transition-all"
                                            placeholder="e.g. หน้าแรก"
                                            onInvalid={(e) => (e.target as any).setCustomValidity('โปรดกรอกข้อมูลในช่องนี้')}
                                            onInput={(e) => (e.target as any).setCustomValidity('')}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">ลิงก์ (URL)</label>
                                        <input
                                            type="text"
                                            required
                                            list="url-suggestions"
                                            value={currentMenu.url}
                                            onChange={(e) => setCurrentMenu({ ...currentMenu, url: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/50 outline-none transition-all font-mono text-sm"
                                            placeholder="e.g. /faq"
                                            onInvalid={(e) => (e.target as any).setCustomValidity('โปรดกรอกข้อมูลในช่องนี้')}
                                            onInput={(e) => (e.target as any).setCustomValidity('')}
                                        />
                                        <datalist id="url-suggestions">
                                            <option value="/" label="หน้าแรก" />
                                            <option value="/products" label="สินค้าทั้งหมด" />
                                            <option value="/#top-products" label="สินค้ายอดนิยม" />
                                            <option value="/#new-arrivals" label="มาใหม่" />
                                            <option value="/faq" label="คำถามที่พบบ่อย" />
                                            <option value="/contact" label="ติดต่อเรา" />
                                            <option value="/profile" label="โปรไฟล์" />
                                            <option value="/auth/login" label="เข้าสู่ระบบ" />
                                        </datalist>
                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                            {[
                                                { label: 'หน้าแรก', url: '/' },
                                                { label: 'สินค้าทั้งหมด', url: '/products' },
                                                { label: 'คำถามที่พบบ่อย', url: '/faq' },
                                                { label: 'ติดต่อเรา', url: '/contact' }
                                            ].map(item => (
                                                <button
                                                    key={item.url}
                                                    type="button"
                                                    onClick={() => setCurrentMenu({ ...currentMenu, url: item.url })}
                                                    className="px-2 py-1 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors border border-slate-200"
                                                >
                                                    {item.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>


                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">ตำแหน่ง (Alignment)</label>
                                        <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                                            {(['LEFT', 'CENTER', 'RIGHT'] as MenuAlignment[]).map((align) => (
                                                <button
                                                    key={align}
                                                    type="button"
                                                    onClick={() => setCurrentMenu({ ...currentMenu, alignment: align })}
                                                    className={`flex-1 py-2 flex justify-center items-center gap-2 text-xs font-bold rounded-lg transition-all ${currentMenu.alignment === align
                                                        ? 'bg-white shadow-sm text-gold border border-slate-200'
                                                        : 'text-slate-400 hover:text-slate-600'
                                                        }`}
                                                >
                                                    {alignmentIcon(align)}
                                                    {align}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">สถานะการแสดงผล</label>
                                        <button
                                            type="button"
                                            onClick={() => setCurrentMenu({ ...currentMenu, isActive: !currentMenu.isActive })}
                                            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all ${currentMenu.isActive
                                                ? 'bg-green-50 border-green-200 text-green-700'
                                                : 'bg-slate-50 border-slate-200 text-slate-400'
                                                }`}
                                        >
                                            <span className="text-sm font-bold">
                                                {currentMenu.isActive ? '✓ แสดงใน Navbar' : '✗ ซ่อน (ไม่แสดง)'}
                                            </span>
                                            <div className={`w-10 h-5 rounded-full transition-colors relative ${currentMenu.isActive ? 'bg-green-400' : 'bg-slate-300'
                                                }`}>
                                                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${currentMenu.isActive ? 'translate-x-5' : 'translate-x-0.5'
                                                    }`} />
                                            </div>
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">ขนาดฟอนต์</label>
                                            <select
                                                value={currentMenu.fontSize}
                                                onChange={(e) => setCurrentMenu({ ...currentMenu, fontSize: e.target.value })}
                                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/50 outline-none transition-all text-sm"
                                            >
                                                <option value="xs">เล็กมาก (xs)</option>
                                                <option value="sm">เล็ก (sm)</option>
                                                <option value="base">กลาง (base)</option>
                                                <option value="lg">ใหญ่ (lg)</option>
                                                <option value="xl">ใหญ่มาก (xl)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">รูปแบบฟอนต์</label>
                                            <select
                                                value={currentMenu.fontFamily}
                                                onChange={(e) => setCurrentMenu({ ...currentMenu, fontFamily: e.target.value })}
                                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/50 outline-none transition-all text-sm"
                                            >
                                                <option value="sans">มาตรฐาน (Sans)</option>
                                                <option value="sarabun">สารบรรณ (Sarabun)</option>
                                                <option value="inter">อินเตอร์ (Inter)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">สีตัวอักษร</label>
                                        <div className="flex gap-4">
                                            <input
                                                type="color"
                                                value={currentMenu.color}
                                                onChange={(e) => setCurrentMenu({ ...currentMenu, color: e.target.value })}
                                                className="w-12 h-10 p-1 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={currentMenu.color}
                                                onChange={(e) => setCurrentMenu({ ...currentMenu, color: e.target.value })}
                                                pattern="^#[0-9A-Fa-f]{6}$"
                                                placeholder="#4B5563"
                                                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/50 outline-none transition-all font-mono text-sm uppercase"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 flex gap-2">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-gold hover:bg-gold-hover text-white py-2.5 rounded-xl font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
                                        >
                                            {isEditing ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                            {isEditing ? "บันทึกการแก้ไข" : "เพิ่มเมนู"}
                                        </button>

                                        {isEditing && (
                                            <button
                                                type="button"
                                                onClick={cancelEdit}
                                                className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-colors flex items-center justify-center"
                                                title="ยกเลิก"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* List Section */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                <div className="text-sm text-slate-600">
                                    จำนวนเมนูทั้งหมด: <span className="font-bold text-gold">{menuList.length}</span> รายการ
                                </div>
                                <button
                                    onClick={saveOrder}
                                    disabled={isSavingOrder}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    {isSavingOrder ? 'กำลังบันทึก...' : 'บันทึกลำดับ'}
                                </button>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
                                    <GripVertical className="w-4 h-4" /> ลากและวางเพื่อสลับลำดับการแสดงผลใน Navbar
                                </p>

                                {menuList.length === 0 ? (
                                    <div className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                                        ยังไม่มีเมนูในระบบ
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {menuList.map((menu, index) => (
                                            <div
                                                key={menu.id}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, index)}
                                                onDragEnd={handleDragEnd}
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onDrop={(e) => handleDrop(e, index)}
                                                className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-200 cursor-grab hover:border-gold/50 hover:shadow-md transition-all relative overflow-hidden"
                                            >
                                                {/* Status Indicator Bar */}
                                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${menu.isActive ? 'bg-green-400' : 'bg-slate-300'}`}></div>

                                                <div className="flex items-center cursor-grab active:cursor-grabbing text-slate-400 hover:text-gold sm:pl-2">
                                                    <GripVertical className="w-5 h-5" />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3
                                                            className={`font-bold truncate text-${menu.fontSize || 'sm'} ${menu.fontFamily === 'sarabun' ? 'font-sarabun' : menu.fontFamily === 'inter' ? 'font-inter' : 'font-sans'}`}
                                                            style={{ color: menu.color || '#1e293b' }}
                                                        >
                                                            {menu.label}
                                                        </h3>
                                                        {menu.isActive && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                                    </div>
                                                    <p className="text-sm font-mono text-slate-500 truncate">{menu.url}</p>
                                                </div>

                                                <div className="flex items-center gap-3 self-end sm:self-auto w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                                                    <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-500 flex-1 sm:flex-initial justify-center">
                                                        {alignmentIcon(menu.alignment)}
                                                        {menu.alignment}
                                                    </div>

                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={() => editMenu(menu)}
                                                            className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="แก้ไข"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(menu.id, menu.label)}
                                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="ลบ"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
