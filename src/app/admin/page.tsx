"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LayoutDashboard, Image as ImageIcon, Users, ShoppingCart, Settings, Plus, Trash2, Edit, Monitor, Star, Rocket, Gift } from 'lucide-react';

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [wallpapers, setWallpapers] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingWallpaper, setEditingWallpaper] = useState<any>(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [slideshows, setSlideshows] = useState<any[]>([]);
    const [showSlideshowModal, setShowSlideshowModal] = useState(false);
    const [editingSlideshow, setEditingSlideshow] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [editingOrder, setEditingOrder] = useState<any>(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(true);

    // Form state for Wallpaper
    const [newWallpaper, setNewWallpaper] = useState({
        title: '',
        description: '',
        imageUrl: '',
        categoryId: '',
        price: 1,
        blessing: '',
        deity: '',
        isPopular: false,
        isNew: false,
        isOffering: false,
        relatedWallpaperId: ''
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Form state for User
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        isAdmin: false
    });

    // Form state for Category
    const [newCategory, setNewCategory] = useState({
        name: '',
        subtitle: '',
        description: '',
        bgColor: '#D9C4A1',
        textColor: '#1e293b',
        imageUrl: '',
        bgImageUrl: '',
        tooltip: '',
        order: 0
    });
    const [selectedBgFile, setSelectedBgFile] = useState<File | null>(null);
    const [bgPreviewUrl, setBgPreviewUrl] = useState<string | null>(null);

    // Form state for Slideshow
    const [newSlideshow, setNewSlideshow] = useState({
        title: '',
        subtitle: '',
        bgColor: '#D1A7FF',
        buttonText: 'Get Now',
        wallpaperId: '',
        order: 0,
        isActive: true
    });

    useEffect(() => {
        const adminUser = localStorage.getItem('adminUser');
        if (!adminUser) {
            router.push('/admin/login');
        } else {
            const user = JSON.parse(adminUser);
            if (!user.isAdmin) {
                router.push('/admin/login');
            } else {
                setIsAuthenticating(false);
                fetchData();
            }
        }
    }, [router]);

    const fetchData = async () => {
        try {
            const [wpRes, catRes, userRes, slideRes] = await Promise.all([
                fetch('/api/wallpapers'),
                fetch('/api/categories'),
                fetch('/api/admin/users'),
                fetch('/api/slideshows')
            ]);
            const wpData = await wpRes.json();
            const catData = await catRes.json();
            const userData = await userRes.json();
            const slideData = await slideRes.json();
            const orderRes = await fetch('/api/orders');
            const orderData = await orderRes.json();

            setWallpapers(Array.isArray(wpData) ? wpData : []);
            setCategories(Array.isArray(catData) ? catData : []);
            setUsers(Array.isArray(userData) ? userData : []);
            setSlideshows(Array.isArray(slideData) ? slideData : []);
            setOrders(Array.isArray(orderData) ? orderData : []);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleSubmitUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingUser ? `/api/admin/users/${editingUser.id}` : '/api/admin/users';
            const method = editingUser ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });
            if (res.ok) {
                setShowUserModal(false);
                setEditingUser(null);
                fetchData();
                setNewUser({ name: '', email: '', password: '', isAdmin: false });
            }
        } catch (error) {
            console.error("Error saving user:", error);
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm('ยืนยันการลบผู้ใช้งานนี้?')) return;
        try {
            await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
            fetchData();
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleAddWallpaper = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', newWallpaper.title);
            formData.append('description', newWallpaper.description);
            formData.append('categoryId', newWallpaper.categoryId);
            formData.append('price', newWallpaper.price.toString());
            formData.append('blessing', newWallpaper.blessing);
            formData.append('deity', newWallpaper.deity);
            formData.append('isPopular', newWallpaper.isPopular.toString());
            formData.append('isNew', newWallpaper.isNew.toString());
            formData.append('isOffering', newWallpaper.isOffering.toString());
            formData.append('relatedWallpaperId', newWallpaper.relatedWallpaperId || '');

            if (selectedFile) {
                formData.append('image', selectedFile);
            } else if (!editingWallpaper) {
                alert('กรุณาเลือกรูปภาพ');
                return;
            }

            if (editingWallpaper) {
                formData.append('imageUrl', newWallpaper.imageUrl);
            }

            const url = editingWallpaper ? `/api/wallpapers/${editingWallpaper.id}` : '/api/wallpapers';
            const method = editingWallpaper ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                body: formData
            });
            if (res.ok) {
                setShowAddModal(false);
                setEditingWallpaper(null);
                fetchData();
                setNewWallpaper({ title: '', description: '', imageUrl: '', categoryId: '', price: 1, blessing: '', deity: '', isPopular: false, isNew: false, isOffering: false, relatedWallpaperId: '' });
                setSelectedFile(null);
                setPreviewUrl(null);
            }
        } catch (error) {
            console.error("Error saving wallpaper:", error);
        }
    };

    const handleSubmitCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', newCategory.name);
            formData.append('subtitle', newCategory.subtitle || '');
            formData.append('description', newCategory.description || '');
            formData.append('bgColor', newCategory.bgColor);
            formData.append('textColor', newCategory.textColor);
            formData.append('tooltip', newCategory.tooltip || '');
            formData.append('order', newCategory.order.toString());

            if (selectedFile) {
                formData.append('image', selectedFile);
            }
            if (selectedBgFile) {
                formData.append('bgImage', selectedBgFile);
            }

            const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories';
            const method = editingCategory ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                body: formData
            });

            if (res.ok) {
                setShowCategoryModal(false);
                setEditingCategory(null);
                fetchData();
                setNewCategory({ name: '', subtitle: '', description: '', bgColor: '#D9C4A1', textColor: '#1e293b', imageUrl: '', bgImageUrl: '', tooltip: '', order: 0 });
                setSelectedFile(null);
                setPreviewUrl(null);
                setSelectedBgFile(null);
                setBgPreviewUrl(null);
            }
        } catch (error) {
            console.error("Error saving category:", error);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm('ยืนยันการลบหมวดหมู่นี้?')) return;
        try {
            const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchData();
            } else {
                const data = await res.json();
                alert(data.error || 'เกิดข้อผิดพลาดในการลบหมวดหมู่');
            }
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    const handleToggleStatus = async (id: string, field: 'isPopular' | 'isNew' | 'isOffering', currentVal: boolean) => {
        try {
            const wp = wallpapers.find((w: any) => w.id === id) as any;
            const res = await fetch(`/api/wallpapers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...wp,
                    [field]: !currentVal
                })
            });
            if (res.ok) {
                fetchData();
            }
        } catch (error) {
            console.error(`Error toggling ${field}:`, error);
        }
    };

    const handleDeleteWallpaper = async (id: string) => {
        if (!confirm('ยืนยันการลบวอลเปเปอร์นี้?')) return;
        try {
            await fetch(`/api/wallpapers/${id}`, { method: 'DELETE' });
            fetchData();
        } catch (error) {
            console.error("Error deleting wallpaper:", error);
        }
    };

    const handleSubmitSlideshow = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', newSlideshow.title);
            formData.append('subtitle', newSlideshow.subtitle || '');
            formData.append('bgColor', newSlideshow.bgColor);
            formData.append('buttonText', newSlideshow.buttonText);
            formData.append('wallpaperId', newSlideshow.wallpaperId);
            formData.append('order', newSlideshow.order.toString());
            formData.append('isActive', newSlideshow.isActive.toString());

            if (selectedFile) {
                formData.append('image', selectedFile);
            }

            const url = editingSlideshow ? `/api/slideshows/${editingSlideshow.id}` : '/api/slideshows';
            const method = editingSlideshow ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                body: formData
            });

            if (res.ok) {
                setShowSlideshowModal(false);
                setEditingSlideshow(null);
                fetchData();
                setNewSlideshow({ title: '', subtitle: '', bgColor: '#D1A7FF', buttonText: 'Get Now', wallpaperId: '', order: 0, isActive: true });
                setSelectedFile(null);
                setPreviewUrl(null);
            }
        } catch (error) {
            console.error("Error saving slideshow:", error);
        }
    };

    const handleDeleteSlideshow = async (id: string) => {
        if (!confirm('ยืนยันการลบสไลด์โชว์นี้?')) return;
        try {
            await fetch(`/api/slideshows/${id}`, { method: 'DELETE' });
            fetchData();
        } catch (error) {
            console.error("Error deleting slideshow:", error);
        }
    };

    if (isAuthenticating) return null;

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full">
                <div className="p-6">
                    <h2 className="text-2xl font-bold gold-text">Iucrative</h2>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Admin Console</p>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full p-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors ${activeTab === 'dashboard' ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5'}`}
                    >
                        <LayoutDashboard className="w-4 h-4" /> แดชบอร์ด
                    </button>
                    <button
                        onClick={() => setActiveTab('wallpapers')}
                        className={`w-full p-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors ${activeTab === 'wallpapers' ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5'}`}
                    >
                        <ImageIcon className="w-4 h-4" /> วอลเปเปอร์
                    </button>
                    <button
                        onClick={() => setActiveTab('categories')}
                        className={`w-full p-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors ${activeTab === 'categories' ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5'}`}
                    >
                        <Settings className="w-4 h-4" /> หมวดหมู่
                    </button>
                    <button
                        onClick={() => setActiveTab('slideshows')}
                        className={`w-full p-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors ${activeTab === 'slideshows' ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5'}`}
                    >
                        <Monitor className="w-4 h-4" /> สไลด์โชว์
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`w-full p-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors ${activeTab === 'users' ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5'}`}
                    >
                        <Users className="w-4 h-4" /> สมาชิก/แอดมิน
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`w-full p-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors ${activeTab === 'orders' ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5'}`}
                    >
                        <ShoppingCart className="w-4 h-4" /> รายการสั่งซื้อ (Custom)
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
                {activeTab === 'dashboard' && (
                    <>
                        <header className="flex justify-between items-center mb-8">
                            <h1 className="text-2xl font-bold text-slate-800">แดชบอร์ดสรุปผล</h1>
                        </header>

                        <div className="grid grid-cols-4 gap-6 mb-8">
                            {[
                                { label: 'รายการสั่งซื้อ', value: orders.length, change: '0%', color: 'text-slate-400' },
                                { label: 'ผู้ใช้งานระบบ', value: users.length, change: '+5%', color: 'text-green-500' },
                                { label: 'ยอดดาวน์โหลด', value: '0', change: '0%', color: 'text-slate-400' },
                                { label: 'วอลเปเปอร์ทั้งหมด', value: wallpapers.length, change: '0%', color: 'text-slate-400' },
                            ].map((stat) => (
                                <div key={stat.label} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{stat.label}</p>
                                    <div className="flex items-end justify-between">
                                        <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
                                        <span className={`text-[10px] font-bold ${stat.color}`}>{stat.change}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === 'orders' && (
                    <>
                        <header className="flex justify-between items-center mb-8">
                            <h1 className="text-2xl font-bold text-slate-800">จัดการรายการสั่งซื้อ (Custom)</h1>
                        </header>

                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                            <table className="w-full text-left font-sans">
                                <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">ลูกค้า (อีเมล)</th>
                                        <th className="px-6 py-4">ชื่อในวอลเปเปอร์</th>
                                        <th className="px-6 py-4">วอลเปเปอร์</th>
                                        <th className="px-6 py-4">วันเกิด/ราศี</th>
                                        <th className="px-6 py-4">ยอดเงิน/การชำระ</th>
                                        <th className="px-6 py-4 text-center">สถานะ</th>
                                        <th className="px-6 py-4 text-right">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {orders.map((order: any) => (
                                        <tr key={order.id} className="text-sm hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="text-slate-700 font-medium">{order.email}</div>
                                                <div className="text-[10px] text-slate-400">{new Date(order.createdAt).toLocaleString('th-TH')}</div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 font-bold">{order.displayedName}</td>
                                            <td className="px-6 py-4 text-slate-500">{order.wallpaper?.title || '-'}</td>
                                            <td className="px-6 py-4 text-xs">
                                                <div>{order.dayOfWeek}, {order.birthDate}</div>
                                                <div className="text-gold-primary">ราศี{order.zodiac}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-700">{order.totalAmount}</div>
                                                <div className={`text-[10px] font-bold ${order.paymentStatus === 'PAID' ? 'text-green-500' : 'text-orange-400'}`}>
                                                    {order.paymentStatus} ({order.paymentMethod || 'N/A'})
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <select
                                                    className={`px-2 py-1 rounded-full text-[10px] font-bold border-none outline-none cursor-pointer ${order.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                                                    value={order.status}
                                                    onChange={async (e) => {
                                                        await fetch(`/api/orders/${order.id}`, {
                                                            method: 'PUT',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({ status: e.target.value })
                                                        });
                                                        fetchData();
                                                    }}
                                                >
                                                    <option value="PENDING">รอดำเนินการ</option>
                                                    <option value="SUCCESS">สำเร็จ</option>
                                                    <option value="FAILED">ไม่สำเร็จ</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={async () => {
                                                        if (confirm('ยืนยันการลบรายการสั่งซื้อนี้?')) {
                                                            await fetch(`/api/orders/${order.id}`, { method: 'DELETE' });
                                                            fetchData();
                                                        }
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {orders.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-slate-400 italic font-sans">
                                                ยังไม่มีรายการสั่งซื้อ
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {activeTab === 'users' && (
                    <>
                        <header className="flex justify-between items-center mb-8">
                            <h1 className="text-2xl font-bold text-slate-800">จัดการผู้ใช้งาน</h1>
                            <button
                                onClick={() => setShowUserModal(true)}
                                className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-all"
                            >
                                <Plus className="w-4 h-4" /> เพิ่มแอดมินใหม่
                            </button>
                        </header>

                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                            <table className="w-full text-left font-sans">
                                <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">ชื่อ</th>
                                        <th className="px-6 py-4">อีเมล</th>
                                        <th className="px-6 py-4 text-center">สิทธิ์</th>
                                        <th className="px-6 py-4">สมัครเมื่อ</th>
                                        <th className="px-6 py-4 text-right">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {users.map((u: any) => (
                                        <tr key={u.id} className="text-sm hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-700">{u.name || '-'}</td>
                                            <td className="px-6 py-4 text-slate-500">{u.email}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${u.isAdmin ? 'bg-gold-primary/10 text-gold-primary border border-gold-primary/20' : 'bg-slate-100 text-slate-400'}`}>
                                                    {u.isAdmin ? 'ADMIN' : 'USER'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-400 text-xs">
                                                {new Date(u.createdAt).toLocaleDateString('th-TH')}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingUser(u);
                                                            setNewUser({
                                                                name: u.name || '',
                                                                email: u.email,
                                                                password: '', // Don't pre-fill password
                                                                isAdmin: u.isAdmin
                                                            });
                                                            setShowUserModal(true);
                                                        }}
                                                        className="p-2 text-slate-400 hover:text-gold-primary transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(u.id)}
                                                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {activeTab === 'wallpapers' && (
                    <>
                        <header className="flex justify-between items-center mb-8">
                            <h1 className="text-2xl font-bold text-slate-800">จัดการวอลเปเปอร์</h1>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="gold-bg text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-all"
                            >
                                <Plus className="w-4 h-4" /> เพิ่มวอลเปเปอร์
                            </button>
                        </header>

                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                            <table className="w-full text-left font-sans">
                                <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">รูปภาพ</th>
                                        <th className="px-6 py-4">ชื่อวอลเปเปอร์</th>
                                        <th className="px-6 py-4">หมวดหมู่</th>
                                        <th className="px-6 py-4 text-center">ยอดนิยม</th>
                                        <th className="px-6 py-4 text-center">มาใหม่</th>
                                        <th className="px-6 py-4 text-center">ของถวาย</th>
                                        <th className="px-6 py-4">ราคา</th>
                                        <th className="px-6 py-4 text-right">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {Array.isArray(wallpapers) && wallpapers.map((wp: any) => (
                                        <tr key={wp.id} className="text-sm hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="w-12 h-20 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                                    <img src={wp.imageUrl} alt={wp.title} className="w-full h-full object-cover" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-700">
                                                {wp.title}
                                                {wp.isOffering && wp.relatedWallpaper && (
                                                    <div className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full inline-block mt-1">
                                                        เป็นของถวายให้: {wp.relatedWallpaper.title}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">{wp.category?.name || 'ทั่วไป'}</td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => handleToggleStatus(wp.id, 'isPopular', wp.isPopular)}
                                                    className={`p-2 rounded-lg transition-all ${wp.isPopular ? 'text-amber-500 bg-amber-50 shadow-sm' : 'text-slate-300 hover:text-slate-400'}`}
                                                    title="ยอดนิยม"
                                                >
                                                    <Star className={`w-5 h-5 ${wp.isPopular ? 'fill-amber-500' : ''}`} />
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => handleToggleStatus(wp.id, 'isNew', wp.isNew)}
                                                    className={`p-2 rounded-lg transition-all ${wp.isNew ? 'text-blue-500 bg-blue-50 shadow-sm' : 'text-slate-300 hover:text-slate-400'}`}
                                                    title="มาใหม่"
                                                >
                                                    <Rocket className={`w-5 h-5 ${wp.isNew ? 'fill-blue-500' : ''}`} />
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => handleToggleStatus(wp.id, 'isOffering', wp.isOffering)}
                                                    className={`p-2 rounded-lg transition-all ${wp.isOffering ? 'text-rose-500 bg-rose-50 shadow-sm' : 'text-slate-300 hover:text-slate-400'}`}
                                                    title="ของถวาย"
                                                >
                                                    <Gift className={`w-5 h-5 ${wp.isOffering ? 'fill-rose-500' : ''}`} />
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gold-secondary">{wp.price}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingWallpaper(wp);
                                                            setNewWallpaper({
                                                                title: wp.title,
                                                                description: wp.description || '',
                                                                imageUrl: wp.imageUrl,
                                                                categoryId: wp.categoryId,
                                                                price: wp.price,
                                                                blessing: wp.blessing || '',
                                                                deity: wp.deity || '',
                                                                isPopular: wp.isPopular,
                                                                isNew: wp.isNew,
                                                                isOffering: wp.isOffering,
                                                                relatedWallpaperId: wp.relatedWallpaperId || ''
                                                            });
                                                            setPreviewUrl(wp.imageUrl);
                                                            setShowAddModal(true);
                                                        }}
                                                        className="p-2 text-slate-400 hover:text-gold-primary transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteWallpaper(wp.id)}
                                                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {wallpapers.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-slate-400 italic font-sans">
                                                ยังไม่มีข้อมูลวอลเปเปอร์
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
                {activeTab === 'categories' && (
                    <>
                        <header className="flex justify-between items-center mb-8">
                            <h1 className="text-2xl font-bold text-slate-800">จัดการหมวดหมู่</h1>
                            <button
                                onClick={() => setShowCategoryModal(true)}
                                className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-all"
                            >
                                <Plus className="w-4 h-4" /> เพิ่มหมวดหมู่ใหม่
                            </button>
                        </header>

                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                            <table className="w-full text-left font-sans">
                                <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">รูป/สี</th>
                                        <th className="px-6 py-4">ชื่อหมวดหมู่</th>
                                        <th className="px-6 py-4">คำโปรย (Subtitle)</th>
                                        <th className="px-6 py-4">ลำดับ</th>
                                        <th className="px-6 py-4 text-center">วอลเปเปอร์</th>
                                        <th className="px-6 py-4 text-right">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {categories.map((cat: any) => (
                                        <tr key={cat.id} className="text-sm hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
                                                        {cat.imageUrl ? (
                                                            <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full" style={{ backgroundColor: cat.bgColor }} />
                                                        )}
                                                    </div>
                                                    <div className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: cat.bgColor }} title={cat.bgColor} />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-700">{cat.name}</td>
                                            <td className="px-6 py-4 text-slate-500">{cat.subtitle || '-'}</td>
                                            <td className="px-6 py-4 text-slate-400 font-mono text-xs">{cat.order}</td>
                                            <td className="px-6 py-4 text-center text-slate-400">
                                                {wallpapers.filter((wp: any) => wp.categoryId === cat.id).length}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingCategory(cat);
                                                            setNewCategory({
                                                                name: cat.name,
                                                                subtitle: cat.subtitle || '',
                                                                description: cat.description || '',
                                                                bgColor: cat.bgColor || '#D9C4A1',
                                                                textColor: cat.textColor || '#1e293b',
                                                                imageUrl: cat.imageUrl || '',
                                                                bgImageUrl: cat.bgImageUrl || '',
                                                                tooltip: cat.tooltip || '',
                                                                order: cat.order || 0
                                                            });
                                                            setPreviewUrl(cat.imageUrl || null);
                                                            setBgPreviewUrl(cat.bgImageUrl || null);
                                                            setShowCategoryModal(true);
                                                        }}
                                                        className="p-2 text-slate-400 hover:text-gold-primary transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCategory(cat.id)}
                                                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
                {activeTab === 'slideshows' && (
                    <>
                        <header className="flex justify-between items-center mb-8">
                            <h1 className="text-2xl font-bold text-slate-800">จัดการสไลด์โชว์ (หน้าแรก)</h1>
                            <button
                                onClick={() => {
                                    setEditingSlideshow(null);
                                    setNewSlideshow({ title: '', subtitle: '', bgColor: '#D1A7FF', buttonText: 'Get Now', wallpaperId: '', order: 0, isActive: true });
                                    setShowSlideshowModal(true);
                                }}
                                className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-all"
                            >
                                <Plus className="w-4 h-4" /> เพิ่มสไลด์ใหม่
                            </button>
                        </header>

                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                            <table className="w-full text-left font-sans">
                                <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">ภาพ/พื้นหลัง</th>
                                        <th className="px-6 py-4">ข้อมูลพาดหัว</th>
                                        <th className="px-6 py-4">ลิงก์วอลเปเปอร์</th>
                                        <th className="px-6 py-4 text-center">ลำดับ</th>
                                        <th className="px-6 py-4 text-center">สถานะ</th>
                                        <th className="px-6 py-4 text-right">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {slideshows.map((slide: any) => (
                                        <tr key={slide.id} className="text-sm hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div
                                                    className="w-20 h-10 rounded-lg flex items-center justify-center border border-slate-200 overflow-hidden"
                                                    style={{ backgroundColor: slide.bgColor }}
                                                >
                                                    {slide.imageUrl && <img src={slide.imageUrl} className="w-full h-full object-cover" />}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-700">
                                                <div className="text-sm">{slide.title}</div>
                                                <div className="text-[10px] text-slate-400">{slide.subtitle}</div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">
                                                {slide.wallpaper?.title || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-center text-slate-400">{slide.order}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${slide.isActive ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                                    {slide.isActive ? 'เปิดใช้' : 'ปิด'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingSlideshow(slide);
                                                            setNewSlideshow({
                                                                title: slide.title,
                                                                subtitle: slide.subtitle || '',
                                                                bgColor: slide.bgColor,
                                                                buttonText: slide.buttonText,
                                                                wallpaperId: slide.wallpaperId || '',
                                                                order: slide.order,
                                                                isActive: slide.isActive
                                                            });
                                                            setPreviewUrl(slide.imageUrl);
                                                            setShowSlideshowModal(true);
                                                        }}
                                                        className="p-2 text-slate-400 hover:text-gold-primary transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteSlideshow(slide.id)}
                                                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </main>

            {/* Modal for adding wallpaper */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 font-sans">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-300">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">
                            {editingWallpaper ? 'แก้ไขข้อมูลวอลเปเปอร์' : 'เพิ่มวอลเปเปอร์ใหม่'}
                        </h2>
                        <form onSubmit={handleAddWallpaper} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">ชื่อ</label>
                                    <input
                                        type="text" required
                                        className="w-full p-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-gold-primary/30 outline-none text-sm"
                                        value={newWallpaper.title}
                                        onChange={(e) => setNewWallpaper({ ...newWallpaper, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">หมวดหมู่</label>
                                    <select
                                        required
                                        className="w-full p-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-gold-primary/30 outline-none text-sm"
                                        value={newWallpaper.categoryId}
                                        onChange={(e) => setNewWallpaper({ ...newWallpaper, categoryId: e.target.value })}
                                    >
                                        <option value="">เลือกหมวดหมู่</option>
                                        {categories.map((cat: any) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">รูปภาพวอลเปเปอร์</label>
                                <div className="space-y-3">
                                    {previewUrl && (
                                        <div className="w-24 h-40 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <input
                                        type="file" accept="image/*" required={!editingWallpaper}
                                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-600 hover:file:bg-slate-200 cursor-pointer"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setSelectedFile(file);
                                                setPreviewUrl(URL.createObjectURL(file));
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">ราคา (เครดิต)</label>
                                    <input
                                        type="number" required min="1"
                                        className="w-full p-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-gold-primary/30 outline-none text-sm"
                                        value={newWallpaper.price}
                                        onChange={(e) => setNewWallpaper({ ...newWallpaper, price: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">เทพเจ้า/สิ่งศักดิ์สิทธิ์</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-gold-primary/30 outline-none text-sm"
                                        value={newWallpaper.deity}
                                        onChange={(e) => setNewWallpaper({ ...newWallpaper, deity: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-6 px-1">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-slate-300 text-gold-primary focus:ring-gold-primary"
                                        checked={newWallpaper.isPopular}
                                        onChange={(e) => setNewWallpaper({ ...newWallpaper, isPopular: e.target.checked })}
                                    />
                                    <span className="text-sm font-medium text-slate-700">สินค้าขายดี (Popular)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-slate-300 text-gold-primary focus:ring-gold-primary"
                                        checked={newWallpaper.isNew}
                                        onChange={(e) => setNewWallpaper({ ...newWallpaper, isNew: e.target.checked })}
                                    />
                                    <span className="text-sm font-medium text-slate-700">สินค้ามาใหม่ (New)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-slate-300 text-gold-primary focus:ring-gold-primary"
                                        checked={newWallpaper.isOffering}
                                        onChange={(e) => setNewWallpaper({ ...newWallpaper, isOffering: e.target.checked })}
                                    />
                                    <span className="text-sm font-medium text-slate-700">ของถวาย (Offering)</span>
                                </label>
                            </div>

                            {newWallpaper.isOffering && (
                                <div className="space-y-1 animate-in slide-in-from-top duration-300">
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">ของถวายสำหรับวอลเปเปอร์หลัก</label>
                                    <select
                                        className="w-full p-3 rounded-xl bg-orange-50 border-none ring-1 ring-orange-200 outline-none text-sm"
                                        value={newWallpaper.relatedWallpaperId}
                                        onChange={(e) => setNewWallpaper({ ...newWallpaper, relatedWallpaperId: e.target.value })}
                                        required={newWallpaper.isOffering}
                                    >
                                        <option value="">เลือกวอลเปเปอร์หลัก</option>
                                        {wallpapers.filter((w: any) => !w.isOffering).map((wp: any) => (
                                            <option key={wp.id} value={wp.id}>{wp.title}</option>
                                        ))}
                                    </select>
                                    <p className="text-[10px] text-orange-400 ml-1 italic">* กรุณาเลือกวอลเปเปอร์หลักที่ของถวายชิ้นนี้จะนำไปใช้</p>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setEditingWallpaper(null);
                                        setNewWallpaper({ title: '', description: '', imageUrl: '', categoryId: '', price: 1, blessing: '', deity: '', isPopular: false, isNew: false, isOffering: false, relatedWallpaperId: '' });
                                        setSelectedFile(null);
                                        setPreviewUrl(null);
                                    }}
                                    className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 gold-bg text-white font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-transform"
                                >
                                    บันทึกข้อมูล
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal for adding user */}
            {showUserModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 font-sans">
                    <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-300">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">
                            {editingUser ? 'แก้ไขบัญชีแอดมิน/สมาชิก' : 'เพิ่มบัญชีแอดมิน'}
                        </h2>
                        <form onSubmit={handleSubmitUser} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">ชื่อ</label>
                                <input
                                    type="text" required
                                    className="w-full p-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-gold-primary/30 outline-none text-sm"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">อีเมล</label>
                                <input
                                    type="email" required
                                    className="w-full p-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-gold-primary/30 outline-none text-sm"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">
                                    {editingUser ? 'รหัสผ่าน (เว้นว่างไว้ถ้าไม่เปลี่ยน)' : 'รหัสผ่าน'}
                                </label>
                                <input
                                    type="password" required={!editingUser}
                                    className="w-full p-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-gold-primary/30 outline-none text-sm"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center gap-2 px-1">
                                <input
                                    type="checkbox" id="isAdminCheckbox"
                                    className="w-4 h-4 rounded border-slate-300 text-gold-primary focus:ring-gold-primary"
                                    checked={newUser.isAdmin}
                                    onChange={(e) => setNewUser({ ...newUser, isAdmin: e.target.checked })}
                                />
                                <label htmlFor="isAdminCheckbox" className="text-sm font-medium text-slate-700 cursor-pointer">ตั้งเป็นแอดมิน (Admin Role)</label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowUserModal(false);
                                        setEditingUser(null);
                                        setNewUser({ name: '', email: '', password: '', isAdmin: false });
                                    }}
                                    className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-transform"
                                >
                                    {editingUser ? 'บันทึกการแก้ไข' : 'สร้างบัญชี'}
                                </button>
                            </div>
                            <p className="text-[10px] text-slate-400 text-center mt-4">
                                * ข้อมูลจะได้รับการอัปเดตทันทีเมื่อกดบันทึก
                            </p>
                        </form>
                    </div>
                </div>
            )}
            {/* Modal for adding/editing category */}
            {showCategoryModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 font-sans">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-300 overflow-y-auto max-h-[90vh]">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">
                            {editingCategory ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่'}
                        </h2>
                        <form onSubmit={handleSubmitCategory} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">ชื่อหมวดหมู่</label>
                                    <input
                                        type="text" required
                                        className="w-full p-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 outline-none text-sm"
                                        value={newCategory.name}
                                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">คำโปรย (Subtitle)</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 outline-none text-sm"
                                        placeholder="เช่น เมตตามหานิยม"
                                        value={newCategory.subtitle}
                                        onChange={(e) => setNewCategory({ ...newCategory, subtitle: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">สีพื้นหลังการ์ด</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            className="w-10 h-10 rounded-lg overflow-hidden border-none cursor-pointer"
                                            value={newCategory.bgColor}
                                            onChange={(e) => setNewCategory({ ...newCategory, bgColor: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            className="flex-1 p-2 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 outline-none text-sm font-mono"
                                            value={newCategory.bgColor}
                                            onChange={(e) => setNewCategory({ ...newCategory, bgColor: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">สีตัวอักษร</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            className="w-10 h-10 rounded-lg overflow-hidden border-none cursor-pointer"
                                            value={newCategory.textColor}
                                            onChange={(e) => setNewCategory({ ...newCategory, textColor: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            className="flex-1 p-2 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 outline-none text-sm font-mono"
                                            value={newCategory.textColor}
                                            onChange={(e) => setNewCategory({ ...newCategory, textColor: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">ลำดับการแสดงผล</label>
                                    <input
                                        type="number"
                                        className="w-full p-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 outline-none text-sm"
                                        value={newCategory.order}
                                        onChange={(e) => setNewCategory({ ...newCategory, order: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    {/* Placeholder for alignment */}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">คำอธิบาย/Tooltip</label>
                                <textarea
                                    className="w-full p-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 outline-none text-sm h-20 resize-none"
                                    placeholder="คำอธิบายเพิ่มเติมเมื่อเอาเมาส์วาง..."
                                    value={newCategory.tooltip}
                                    onChange={(e) => setNewCategory({ ...newCategory, tooltip: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">รูปเทพเจ้า/ไอคอน</label>
                                    <div className="space-y-3">
                                        {previewUrl && (
                                            <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                                                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                            </div>
                                        )}
                                        <input
                                            type="file" accept="image/*"
                                            className="w-full text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-slate-100 file:text-slate-600 hover:file:bg-slate-200 cursor-pointer"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setSelectedFile(file);
                                                    setPreviewUrl(URL.createObjectURL(file));
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">รูปพื้นหลังหมวดหมู่</label>
                                    <div className="space-y-3">
                                        {bgPreviewUrl && (
                                            <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative">
                                                <img src={bgPreviewUrl} alt="BG Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 opacity-40" style={{ backgroundColor: newCategory.bgColor }} />
                                            </div>
                                        )}
                                        <input
                                            type="file" accept="image/*"
                                            className="w-full text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-slate-100 file:text-slate-600 hover:file:bg-slate-200 cursor-pointer"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setSelectedBgFile(file);
                                                    setBgPreviewUrl(URL.createObjectURL(file));
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCategoryModal(false);
                                        setEditingCategory(null);
                                        setNewCategory({ name: '', subtitle: '', description: '', bgColor: '#D9C4A1', textColor: '#1e293b', imageUrl: '', bgImageUrl: '', tooltip: '', order: 0 });
                                        setSelectedFile(null);
                                        setPreviewUrl(null);
                                        setSelectedBgFile(null);
                                        setBgPreviewUrl(null);
                                    }}
                                    className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl transition-colors"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-transform"
                                >
                                    {editingCategory ? 'บันทึกการแก้ไข' : 'สร้างหมวดหมู่'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Modal for adding/editing slideshow */}
            {showSlideshowModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 font-sans">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-300 overflow-y-auto max-h-[90vh]">
                        <h2 className="text-xl font-bold text-slate-800 mb-6 font-sans">
                            {editingSlideshow ? 'แก้ไขสไลด์โชว์' : 'เพิ่มสไลด์โชว์ใหม่'}
                        </h2>
                        <form onSubmit={handleSubmitSlideshow} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">หัวข้อหลัก (Title)</label>
                                    <input
                                        type="text" required
                                        className="w-full p-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 outline-none text-sm"
                                        value={newSlideshow.title}
                                        onChange={(e) => setNewSlideshow({ ...newSlideshow, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">หัวข้อย่อย (Subtitle)</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 outline-none text-sm"
                                        value={newSlideshow.subtitle}
                                        onChange={(e) => setNewSlideshow({ ...newSlideshow, subtitle: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">สีพื้นหลัง (Hex)</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            className="w-10 h-10 rounded-lg overflow-hidden border-none"
                                            value={newSlideshow.bgColor}
                                            onChange={(e) => setNewSlideshow({ ...newSlideshow, bgColor: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            className="flex-1 p-2 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 outline-none text-sm"
                                            value={newSlideshow.bgColor}
                                            onChange={(e) => setNewSlideshow({ ...newSlideshow, bgColor: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">ข้อความปุ่ม</label>
                                    <input
                                        type="text" required
                                        className="w-full p-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 outline-none text-sm"
                                        value={newSlideshow.buttonText}
                                        onChange={(e) => setNewSlideshow({ ...newSlideshow, buttonText: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">เชื่อมต่อกับวอลเปเปอร์</label>
                                <select
                                    className="w-full p-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 outline-none text-sm"
                                    value={newSlideshow.wallpaperId}
                                    onChange={(e) => setNewSlideshow({ ...newSlideshow, wallpaperId: e.target.value })}
                                >
                                    <option value="">เลือกวอลเปเปอร์ (ทางเลือก)</option>
                                    {wallpapers.map((wp: any) => (
                                        <option key={wp.id} value={wp.id}>{wp.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">รูปภาพแบนเนอร์ (ถ้าไม่ใช้รูปวอลเปเปอร์)</label>
                                <div className="space-y-3">
                                    {previewUrl && (
                                        <div className="w-full h-32 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative">
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                            <div
                                                className="absolute inset-0 opacity-20"
                                                style={{ backgroundColor: newSlideshow.bgColor }}
                                            />
                                        </div>
                                    )}
                                    <input
                                        type="file" accept="image/*"
                                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-600 hover:file:bg-slate-200 cursor-pointer"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setSelectedFile(file);
                                                setPreviewUrl(URL.createObjectURL(file));
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">ลำดับการแสดงผล</label>
                                    <input
                                        type="number"
                                        className="w-full p-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 outline-none text-sm"
                                        value={newSlideshow.order}
                                        onChange={(e) => setNewSlideshow({ ...newSlideshow, order: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="flex items-center gap-2 pt-6">
                                    <input
                                        type="checkbox" id="isActiveSlide"
                                        className="w-4 h-4 rounded border-slate-300 text-gold-primary"
                                        checked={newSlideshow.isActive}
                                        onChange={(e) => setNewSlideshow({ ...newSlideshow, isActive: e.target.checked })}
                                    />
                                    <label htmlFor="isActiveSlide" className="text-sm font-medium text-slate-700">เปิดใช้งาน</label>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowSlideshowModal(false);
                                        setEditingSlideshow(null);
                                        setNewSlideshow({ title: '', subtitle: '', bgColor: '#D1A7FF', buttonText: 'Get Now', wallpaperId: '', order: 0, isActive: true });
                                        setSelectedFile(null);
                                        setPreviewUrl(null);
                                    }}
                                    className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl"
                                >
                                    {editingSlideshow ? 'บันทึกการแก้ไข' : 'สร้างสไลด์'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
