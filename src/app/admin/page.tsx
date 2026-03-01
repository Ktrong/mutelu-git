"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LayoutDashboard, Image as ImageIcon, Users, ShoppingCart, Settings, Plus, Trash2, Edit, Monitor, Star, Rocket, Gift, X, ArrowUp, ArrowDown, Copy, DollarSign, Percent } from 'lucide-react';

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
    const [faqs, setFaqs] = useState<any[]>([]);
    const [showFaqModal, setShowFaqModal] = useState(false);
    const [editingFaq, setEditingFaq] = useState<any>(null);
    const [isAuthenticating, setIsAuthenticating] = useState(true);

    const [commissionRates, setCommissionRates] = useState<any[]>([{ level: 1, percentage: 10 }, { level: 2, percentage: 5 }, { level: 3, percentage: 2 }]);
    const [payoutsList, setPayoutsList] = useState<any[]>([]);

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
        relatedWallpaperId: '',
        downloadUrl: ''
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedDownloadFile, setSelectedDownloadFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Content Blocks State
    const [contentBlocks, setContentBlocks] = useState<any[]>([]);

    const addContentBlock = () => {
        setContentBlocks([...contentBlocks, {
            id: Date.now().toString(),
            text: '',
            textColor: '#FFFFFF',
            textSize: 'base',
            textPosition: 'center',
            fontFamily: 'sans',
            imageFile: null,
            imageUrl: null
        }]);
    };

    const removeContentBlock = (index: number) => {
        const newBlocks = [...contentBlocks];
        newBlocks.splice(index, 1);
        setContentBlocks(newBlocks);
    };

    const updateContentBlock = (index: number, field: string, value: any) => {
        const newBlocks = [...contentBlocks];
        newBlocks[index] = { ...newBlocks[index], [field]: value };
        setContentBlocks(newBlocks);
    };

    const moveContentBlockUp = (index: number) => {
        if (index === 0) return;
        const newBlocks = [...contentBlocks];
        const temp = newBlocks[index];
        newBlocks[index] = newBlocks[index - 1];
        newBlocks[index - 1] = temp;
        setContentBlocks(newBlocks);
    };

    const moveContentBlockDown = (index: number) => {
        if (index === contentBlocks.length - 1) return;
        const newBlocks = [...contentBlocks];
        const temp = newBlocks[index];
        newBlocks[index] = newBlocks[index + 1];
        newBlocks[index + 1] = temp;
        setContentBlocks(newBlocks);
    };

    const duplicateContentBlock = (index: number) => {
        const blockToDuplicate = contentBlocks[index];
        const newBlock = {
            ...blockToDuplicate,
            id: Date.now().toString() + "_" + Math.random().toString(36).substr(2, 5),
        };
        const newBlocks = [...contentBlocks];
        newBlocks.splice(index + 1, 0, newBlock);
        setContentBlocks(newBlocks);
    };

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

    // Form state for FAQ
    const [newFaq, setNewFaq] = useState({
        question: '',
        answer: '',
        questionColor: '#000000',
        answerColor: '#4B5563',
        questionSize: 'lg',
        answerSize: 'base',
        fontFamily: 'sans',
        order: 0
    });

    useEffect(() => {
        // ตรวจสอบว่าอยู่บน client-side เท่านั้น
        if (typeof window !== 'undefined') {
            const adminUser = localStorage.getItem('adminUser');
            if (!adminUser) {
                router.push('/admin/login');
            } else {
                try {
                    const user = JSON.parse(adminUser);
                    if (!user || !user.isAdmin) {
                        router.push('/admin/login');
                    } else {
                        setIsAuthenticating(false);
                        fetchData();
                    }
                } catch (error) {
                    console.error('Invalid admin user data:', error);
                    localStorage.removeItem('adminUser');
                    router.push('/admin/login');
                }
            }
        }
    }, [router]);

    const fetchData = async () => {
        try {
            const [wpRes, catRes, userRes, slideRes, faqRes, commRes, payRes] = await Promise.all([
                fetch('/api/wallpapers'),
                fetch('/api/categories'),
                fetch('/api/admin/users'),
                fetch('/api/slideshows'),
                fetch('/api/faqs'),
                fetch('/api/admin/commissions'),
                fetch('/api/admin/payouts')
            ]);
            const wpData = await wpRes.json();
            const catData = await catRes.json();
            const userData = await userRes.json();
            const slideData = await slideRes.json();
            const faqData = await faqRes.json();
            const commData = await commRes.json();
            const payData = await payRes.json();
            const orderRes = await fetch('/api/orders');
            const orderData = await orderRes.json();

            setWallpapers(Array.isArray(wpData) ? wpData : []);
            setCategories(Array.isArray(catData) ? catData : []);
            setUsers(Array.isArray(userData) ? userData : []);
            setSlideshows(Array.isArray(slideData) ? slideData : []);
            setFaqs(Array.isArray(faqData) ? faqData : []);
            setCommissionRates(Array.isArray(commData) && commData.length > 0 ? commData : [{ level: 1, percentage: 10 }, { level: 2, percentage: 5 }, { level: 3, percentage: 2 }]);
            setPayoutsList(Array.isArray(payData) ? payData : []);
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

            if (selectedDownloadFile) {
                formData.append('downloadFile', selectedDownloadFile);
            } else if (editingWallpaper && newWallpaper.downloadUrl) {
                formData.append('downloadUrl', newWallpaper.downloadUrl);
            }

            if (editingWallpaper) {
                formData.append('imageUrl', newWallpaper.imageUrl);
            }

            // Append Content Blocks
            formData.append('contentBlocks', JSON.stringify(contentBlocks.map((b) => ({
                id: b.id, // Keep ID if it's an existing one (not temp timestamp)
                text: b.text,
                textColor: b.textColor,
                textSize: b.textSize,
                textPosition: b.textPosition,
                fontFamily: b.fontFamily,
                // If it has an existing imageUrl and no new file, keep it.
                imageUrl: b.imageUrl,
                // We don't send file object in JSON
            }))));

            contentBlocks.forEach((block, index) => {
                if (block.imageFile) {
                    formData.append(`contentImage_${index}`, block.imageFile);
                }
            });

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
                setNewWallpaper({ title: '', description: '', imageUrl: '', categoryId: '', price: 1, blessing: '', deity: '', isPopular: false, isNew: false, isOffering: false, relatedWallpaperId: '', downloadUrl: '' });
                setSelectedFile(null);
                setSelectedDownloadFile(null);
                setPreviewUrl(null);
                setContentBlocks([]);
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

    const handleSubmitFaq = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingFaq ? `/api/faqs/${editingFaq.id}` : '/api/faqs';
            const method = editingFaq ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newFaq)
            });
            if (res.ok) {
                setShowFaqModal(false);
                setEditingFaq(null);
                fetchData();
                setNewFaq({
                    question: '',
                    answer: '',
                    questionColor: '#000000',
                    answerColor: '#4B5563',
                    questionSize: 'lg',
                    answerSize: 'base',
                    fontFamily: 'sans',
                    order: 0
                });
            }
        } catch (error) {
            console.error("Error saving FAQ:", error);
        }
    };

    const handleDeleteFaq = async (id: string) => {
        if (!confirm('ยืนยันการลบคำถามนี้?')) return;
        try {
            await fetch(`/api/faqs/${id}`, { method: 'DELETE' });
            fetchData();
        } catch (error) {
            console.error("Error deleting FAQ:", error);
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
                    <button
                        onClick={() => setActiveTab('faqs')}
                        className={`w-full p-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors ${activeTab === 'faqs' ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5'}`}
                    >
                        <Settings className="w-4 h-4" /> คำถามที่พบบ่อย (FAQs)
                    </button>
                    <button
                        onClick={() => setActiveTab('commissions')}
                        className={`w-full p-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors ${activeTab === 'commissions' ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5'}`}
                    >
                        <Percent className="w-4 h-4" /> Affiliate MLM
                    </button>
                    <button
                        onClick={() => setActiveTab('payouts')}
                        className={`w-full p-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors ${activeTab === 'payouts' ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5'}`}
                    >
                        <DollarSign className="w-4 h-4" /> แจ้งถอนเงิน
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
                                                            setNewWallpaper({
                                                                title: wp.title,
                                                                description: wp.description || '',
                                                                imageUrl: wp.imageUrl,
                                                                downloadUrl: wp.downloadUrl || '',
                                                                categoryId: wp.categoryId,
                                                                price: wp.price,
                                                                blessing: wp.blessing || '',
                                                                deity: wp.deity || '',
                                                                isPopular: wp.isPopular,
                                                                isNew: wp.isNew,
                                                                isOffering: wp.isOffering,
                                                                relatedWallpaperId: wp.relatedWallpaperId || ''
                                                            });
                                                            setEditingWallpaper(wp);
                                                            setPreviewUrl(wp.imageUrl);
                                                            // Populate content blocks from existing data
                                                            if (wp.contents && Array.isArray(wp.contents)) {
                                                                setContentBlocks(wp.contents.map((c: any) => ({
                                                                    id: c.id,
                                                                    text: c.text || '',
                                                                    textColor: c.textColor || '#FFFFFF',
                                                                    textSize: c.textSize || 'base',
                                                                    textPosition: c.textPosition || 'center',
                                                                    fontFamily: c.fontFamily || 'sans',
                                                                    imageUrl: c.imageUrl,
                                                                    imageFile: null
                                                                })));
                                                            } else {
                                                                setContentBlocks([]);
                                                            }
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
                                    {slideshows.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                                                ยังไม่มีข้อมูลสไลด์โชว์
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {activeTab === 'faqs' && (
                    <>
                        <header className="flex justify-between items-center mb-8">
                            <h1 className="text-2xl font-bold text-slate-800">จัดการคำถามที่พบบ่อย (FAQs)</h1>
                            <button
                                onClick={() => setShowFaqModal(true)}
                                className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-all"
                            >
                                <Plus className="w-4 h-4" /> เพิ่มคำถามใหม่
                            </button>
                        </header>

                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                            <table className="w-full text-left font-sans">
                                <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">ลำดับ</th>
                                        <th className="px-6 py-4">คำถาม</th>
                                        <th className="px-6 py-4">คำตอบ</th>
                                        <th className="px-6 py-4 text-right">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {faqs.map((faq: any) => (
                                        <tr key={faq.id} className="text-sm hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-400">{faq.order}</td>
                                            <td className="px-6 py-4">
                                                <div
                                                    style={{ color: faq.questionColor, fontSize: faq.questionSize === 'base' ? '14px' : faq.questionSize === 'lg' ? '18px' : '24px' }}
                                                    className={`font-bold ${faq.fontFamily === 'sans' ? 'font-sans' : 'font-serif'}`}
                                                >
                                                    {faq.question}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div
                                                    style={{ color: faq.answerColor, fontSize: faq.answerSize === 'base' ? '14px' : faq.answerSize === 'lg' ? '18px' : '24px' }}
                                                    className={`${faq.fontFamily === 'sans' ? 'font-sans' : 'font-serif'} line-clamp-2`}
                                                >
                                                    {faq.answer}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingFaq(faq);
                                                            setNewFaq({
                                                                question: faq.question,
                                                                answer: faq.answer,
                                                                questionColor: faq.questionColor,
                                                                answerColor: faq.answerColor,
                                                                questionSize: faq.questionSize,
                                                                answerSize: faq.answerSize,
                                                                fontFamily: faq.fontFamily,
                                                                order: faq.order
                                                            });
                                                            setShowFaqModal(true);
                                                        }}
                                                        className="p-2 text-slate-400 hover:text-gold-primary transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteFaq(faq.id)}
                                                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {faqs.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                                                ยังไม่มีข้อมูลคำถาม
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {activeTab === 'commissions' && (
                    <>
                        <header className="flex justify-between items-center mb-8">
                            <h1 className="text-2xl font-bold text-slate-800">ตั้งค่า Affiliate & MLM</h1>
                            <button
                                onClick={async () => {
                                    await fetch('/api/admin/commissions', {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ rates: commissionRates })
                                    });
                                    alert('บันทึกค่าคอมมิชชั่นเรียบร้อยแล้ว');
                                    fetchData();
                                }}
                                className="bg-amber-500 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-all"
                            >
                                <Copy className="w-4 h-4" /> บันทึกการตั้งค่า
                            </button>
                        </header>

                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">กำหนด % ส่วนแบ่งค่าคอมมิชชั่นตามระดับชั้น (Level)</h3>
                            <div className="space-y-4 max-w-lg">
                                {commissionRates.map((rate, index) => (
                                    <div key={index} className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <div className="w-24 font-bold text-slate-700">ชั้นที่ {rate.level}</div>
                                        <div className="flex-1 relative">
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="w-full border-none ring-1 ring-slate-200 rounded-lg py-2 px-3 outline-none focus:ring-amber-500"
                                                value={rate.percentage}
                                                onChange={(e) => {
                                                    const newRates = [...commissionRates];
                                                    newRates[index].percentage = parseFloat(e.target.value);
                                                    setCommissionRates(newRates);
                                                }}
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={() => setCommissionRates([...commissionRates, { level: commissionRates.length + 1, percentage: 0 }])}
                                    className="text-amber-600 font-bold text-sm w-full py-3 border-2 border-dashed border-amber-200 rounded-xl hover:bg-amber-50 mt-4"
                                >
                                    + เพิ่มระดับชั้น
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'payouts' && (
                    <>
                        <header className="flex justify-between items-center mb-8">
                            <h1 className="text-2xl font-bold text-slate-800">รายการแจ้งถอนเงิน (Payouts)</h1>
                        </header>

                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                            <table className="w-full text-left font-sans">
                                <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">วัน/เวลา</th>
                                        <th className="px-6 py-4">ผู้ใช้งาน (อีเมล)</th>
                                        <th className="px-6 py-4">จำนวนเงิน</th>
                                        <th className="px-6 py-4 text-center">สถานะ</th>
                                        <th className="px-6 py-4 text-right">ดำเนินการ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {payoutsList.map((payout: any) => (
                                        <tr key={payout.id} className="text-sm hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 text-slate-500 text-xs">
                                                {new Date(payout.createdAt).toLocaleString('th-TH')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-700">{payout.user?.name || '-'}</div>
                                                <div className="text-xs text-slate-400">{payout.user?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-amber-600">
                                                ฿{payout.amount.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 text-[10px] font-bold rounded-full ${payout.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                        payout.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                            'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {payout.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {payout.status === 'PENDING' && (
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={async () => {
                                                                if (confirm('ยืนยันอนุมัติการถอนเงิน (โปรดโอนเงินให้ผู้ใช้ก่อนกด)?')) {
                                                                    await fetch('/api/admin/payouts', {
                                                                        method: 'PUT',
                                                                        headers: { 'Content-Type': 'application/json' },
                                                                        body: JSON.stringify({ id: payout.id, status: 'APPROVED' })
                                                                    });
                                                                    fetchData();
                                                                }
                                                            }}
                                                            className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600"
                                                        >
                                                            อนุมัติ
                                                        </button>
                                                        <button
                                                            onClick={async () => {
                                                                if (confirm('ยืนยันปฏิเสธการถอนเงิน (คืนยอดคงเหลือ)?')) {
                                                                    await fetch('/api/admin/payouts', {
                                                                        method: 'PUT',
                                                                        headers: { 'Content-Type': 'application/json' },
                                                                        body: JSON.stringify({ id: payout.id, status: 'REJECTED' })
                                                                    });
                                                                    fetchData();
                                                                }
                                                            }}
                                                            className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600"
                                                        >
                                                            ปฏิเสธ
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {payoutsList.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic font-sans">
                                                ยังไม่มีรายการถอนเงิน
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </main>

            {/* Modals... */}
            {/* ... keeping other modals and adding FAQ Modal ... */}

            {
                showFaqModal && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">{editingFaq ? 'แก้ไขคำถาม' : 'เพิ่มคำถามใหม่'}</h3>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">FAQ Customization</p>
                                </div>
                                <button onClick={() => { setShowFaqModal(false); setEditingFaq(null); }} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm ring-1 ring-slate-200">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitFaq} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">คำถาม</label>
                                        <input
                                            type="text" required
                                            className="w-full p-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 outline-none text-sm focus:ring-slate-900 transition-all font-medium"
                                            placeholder="เช่น มีวิธีดาวน์โหลดอย่างไร?"
                                            value={newFaq.question}
                                            onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">คำตอบ</label>
                                        <textarea
                                            required rows={4}
                                            className="w-full p-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 outline-none text-sm focus:ring-slate-900 transition-all font-medium"
                                            placeholder="คำอธิบาย..."
                                            value={newFaq.answer}
                                            onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                                        />
                                    </div>

                                    <div className="p-4 bg-slate-50 rounded-2xl space-y-4">
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">สีข้อความ</h4>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <label className="block text-[10px] text-slate-500 mb-1">สีคำถาม</label>
                                                <div className="flex items-center gap-2">
                                                    <input type="color" className="w-8 h-8 rounded-lg cursor-pointer border-none" value={newFaq.questionColor} onChange={(e) => setNewFaq({ ...newFaq, questionColor: e.target.value })} />
                                                    <span className="text-xs font-mono">{newFaq.questionColor}</span>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-[10px] text-slate-500 mb-1">สีคำตอบ</label>
                                                <div className="flex items-center gap-2">
                                                    <input type="color" className="w-8 h-8 rounded-lg cursor-pointer border-none" value={newFaq.answerColor} onChange={(e) => setNewFaq({ ...newFaq, answerColor: e.target.value })} />
                                                    <span className="text-xs font-mono">{newFaq.answerColor}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-slate-50 rounded-2xl space-y-4">
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ขนาดข้อความ</h4>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <label className="block text-[10px] text-slate-500 mb-1">คำถาม</label>
                                                <select className="w-full p-2 rounded-lg bg-white border-none ring-1 ring-slate-200 outline-none text-xs" value={newFaq.questionSize} onChange={(e) => setNewFaq({ ...newFaq, questionSize: e.target.value })}>
                                                    <option value="base">ปกติ</option>
                                                    <option value="lg">ใหญ่</option>
                                                    <option value="xl">ใหญ่พิเศษ</option>
                                                </select>
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-[10px] text-slate-500 mb-1">คำตอบ</label>
                                                <select className="w-full p-2 rounded-lg bg-white border-none ring-1 ring-slate-200 outline-none text-xs" value={newFaq.answerSize} onChange={(e) => setNewFaq({ ...newFaq, answerSize: e.target.value })}>
                                                    <option value="base">ปกติ</option>
                                                    <option value="lg">ใหญ่</option>
                                                    <option value="xl">ใหญ่พิเศษ</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">ฟอนต์</label>
                                        <select className="w-full p-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 outline-none text-sm" value={newFaq.fontFamily} onChange={(e) => setNewFaq({ ...newFaq, fontFamily: e.target.value })}>
                                            <option value="sans">Sans (ไม่มีหัว)</option>
                                            <option value="serif">Serif (มีหัว)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">ลำดับ</label>
                                        <input type="number" className="w-full p-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 outline-none text-sm" value={newFaq.order} onChange={(e) => setNewFaq({ ...newFaq, order: parseInt(e.target.value) })} />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => { setShowFaqModal(false); setEditingFaq(null); }} className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl active:scale-95 transition-all">ยกเลิก</button>
                                    <button type="submit" className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl active:scale-95 transition-all">{editingFaq ? 'บันทึกการแก้ไข' : 'สร้างคำถาม'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
            {
                showAddModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 font-sans">
                        <div className="bg-white w-full max-w-xl md:max-w-3xl lg:max-w-4xl rounded-[2.5rem] p-6 md:p-8 shadow-2xl animate-in zoom-in duration-300 max-h-[85vh] overflow-y-auto custom-scrollbar">
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
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">คำอธิบาย (Description)</label>
                                    <textarea
                                        rows={3}
                                        className="w-full p-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-gold-primary/30 outline-none text-sm resize-none"
                                        value={newWallpaper.description}
                                        onChange={(e) => setNewWallpaper({ ...newWallpaper, description: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
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
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">คำอวยพร (Blessing)</label>
                                        <input
                                            type="text"
                                            className="w-full p-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-gold-primary/30 outline-none text-sm"
                                            value={newWallpaper.blessing}
                                            onChange={(e) => setNewWallpaper({ ...newWallpaper, blessing: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">เทพเจ้า (Deity)</label>
                                        <input
                                            type="text"
                                            className="w-full p-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-gold-primary/30 outline-none text-sm"
                                            value={newWallpaper.deity}
                                            onChange={(e) => setNewWallpaper({ ...newWallpaper, deity: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">รูปภาพวอลเปเปอร์ (Preview)</label>
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

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1 text-gold-primary">ไฟล์วอลเปเปอร์สำหรับดาวน์โหลด (High Quality)</label>
                                    <div className="space-y-2">
                                        {newWallpaper.downloadUrl && !selectedDownloadFile && (
                                            <div className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-1 rounded-lg inline-block">
                                                ✓ มีไฟล์ชุดดาวน์โหลดเดิมแล้ว
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-600 hover:file:bg-slate-200 cursor-pointer"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setSelectedDownloadFile(file);
                                                }
                                            }}
                                        />
                                        <p className="text-[10px] text-slate-400">* ไฟล์นี้สำหรับให้ลูกค้าดาวน์โหลดหลังชำระเงิน (ควรใช้ไฟล์ความละเอียดสูง)</p>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-xl space-y-3 border border-slate-100">
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">ตั้งค่าพิเศษ</label>
                                    <div className="flex gap-6">
                                        <label className="flex items-center gap-2 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 rounded border-slate-300 text-gold-primary focus:ring-gold-primary accent-gold-primary"
                                                checked={newWallpaper.isPopular}
                                                onChange={(e) => setNewWallpaper({ ...newWallpaper, isPopular: e.target.checked })}
                                            />
                                            <span className="text-sm font-medium text-slate-700">สินค้าขายดี (Popular)</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 rounded border-slate-300 text-gold-primary focus:ring-gold-primary accent-gold-primary"
                                                checked={newWallpaper.isNew}
                                                onChange={(e) => setNewWallpaper({ ...newWallpaper, isNew: e.target.checked })}
                                            />
                                            <span className="text-sm font-medium text-slate-700">สินค้ามาใหม่ (New)</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 rounded border-slate-300 text-gold-primary focus:ring-gold-primary accent-gold-primary"
                                                checked={newWallpaper.isOffering}
                                                onChange={(e) => setNewWallpaper({ ...newWallpaper, isOffering: e.target.checked })}
                                            />
                                            <span className="text-sm font-medium text-slate-700">ของถวาย (Offering)</span>
                                        </label>
                                    </div>

                                    {newWallpaper.isOffering && (
                                        <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-300 border-t border-slate-200 mt-2">
                                            <label className="block text-xs font-bold text-orange-500 uppercase mb-1.5 ml-1 flex items-center gap-1">
                                                <Gift className="w-3 h-3" /> ของถวายสำหรับวอลเปเปอร์หลัก
                                            </label>
                                            <select
                                                className="w-full p-3 rounded-xl bg-orange-50 border border-orange-200 ring-1 ring-orange-200 outline-none text-sm focus:ring-2 focus:ring-orange-300"
                                                value={newWallpaper.relatedWallpaperId}
                                                onChange={(e) => setNewWallpaper({ ...newWallpaper, relatedWallpaperId: e.target.value })}
                                                required={newWallpaper.isOffering}
                                            >
                                                <option value="">เลือกวอลเปเปอร์หลัก</option>
                                                {wallpapers.filter((w: any) => !w.isOffering).map((wp: any) => (
                                                    <option key={wp.id} value={wp.id}>{wp.title}</option>
                                                ))}
                                            </select>
                                            <p className="text-[10px] text-orange-400 ml-1 mt-1 italic">* กรุณาเลือกวอลเปเปอร์หลักที่ของถวายชิ้นนี้จะนำไปใช้ร่วมด้วย</p>
                                        </div>
                                    )}
                                </div>

                                {/* Content Blocks Section */}
                                <div className="border-t border-slate-200 pt-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 uppercase">เนื้อหาเพิ่มเติม (Content Blocks)</label>
                                            <p className="text-xs text-slate-400">เพิ่มรูปภาพและข้อความบรรยายเพิ่มเติมให้กับวอลเปเปอร์</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={addContentBlock}
                                            className="text-xs font-bold bg-gold-primary text-white hover:bg-gold-secondary px-3 py-2 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                                        >
                                            <Plus className="w-3 h-3" /> เพิ่มรูปภาพ/ข้อความ
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        {contentBlocks.map((block, index) => (
                                            <div key={block.id || index} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 relative group animate-in slide-in-from-left duration-300">
                                                {/* Block Header with Controls */}
                                                <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200/50">
                                                    <div className="flex items-center gap-2">
                                                        <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                            เนื้อหาชิ้นที่ {index + 1}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => moveContentBlockUp(index)}
                                                            disabled={index === 0}
                                                            className="p-1.5 text-slate-400 hover:text-gold-primary hover:bg-white rounded-lg transition-colors disabled:opacity-30 disabled:hover:text-slate-400"
                                                            title="เลื่อนขึ้น"
                                                        >
                                                            <ArrowUp className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => moveContentBlockDown(index)}
                                                            disabled={index === contentBlocks.length - 1}
                                                            className="p-1.5 text-slate-400 hover:text-gold-primary hover:bg-white rounded-lg transition-colors disabled:opacity-30 disabled:hover:text-slate-400"
                                                            title="เลื่อนลง"
                                                        >
                                                            <ArrowDown className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => duplicateContentBlock(index)}
                                                            className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-white rounded-lg transition-colors"
                                                            title="คัดลอก"
                                                        >
                                                            <Copy className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeContentBlock(index)}
                                                            className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-white rounded-lg transition-colors ml-1"
                                                            title="ลบรายการนี้"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-12 gap-6">
                                                    {/* Image Upload Column */}
                                                    <div className="col-span-12 md:col-span-4 space-y-3">
                                                        <label className="block text-[10px] font-bold text-slate-400 uppercase">รูปภาพ</label>
                                                        <div className="w-full aspect-[3/4] bg-white rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative transition-colors hover:bg-slate-50 hover:border-gold-primary/30">
                                                            {(block.previewUrl || block.imageUrl || (block.imageFile && URL.createObjectURL(block.imageFile))) ? (
                                                                <>
                                                                    <img
                                                                        src={block.imageFile ? URL.createObjectURL(block.imageFile) : block.imageUrl}
                                                                        alt="Block"
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                    {/* Text Overlay Preview */}
                                                                    {block.text && (
                                                                        <div
                                                                            className={`absolute w-full p-4 text-center pointer-events-none break-words z-10 leading-relaxed`}
                                                                            style={{
                                                                                color: block.textColor,
                                                                                fontFamily: block.fontFamily === 'kanit' ? 'var(--font-kanit)' : block.fontFamily,
                                                                                fontSize: block.textSize === 'xs' ? '0.75rem' : block.textSize === 'sm' ? '0.875rem' : block.textSize === 'lg' ? '1.125rem' : block.textSize === 'xl' ? '1.25rem' : block.textSize === '2xl' ? '1.5rem' : '1rem',
                                                                                bottom: block.textPosition === 'bottom' ? 0 : 'auto',
                                                                                left: 0, right: 0,
                                                                                transform: block.textPosition === 'center' ? 'translateY(-50%)' : 'none',
                                                                                top: block.textPosition === 'center' ? '50%' : (block.textPosition === 'top' ? 0 : 'auto'),
                                                                            }}
                                                                        >
                                                                            {block.text}
                                                                        </div>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <div className="text-center p-4">
                                                                    <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                                                    <span className="text-xs text-slate-400 block">คลิกเพื่อเลือกรูปภาพ</span>
                                                                </div>
                                                            )}
                                                            <input
                                                                type="file" accept="image/*"
                                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) {
                                                                        updateContentBlock(index, 'imageFile', file);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Settings Column */}
                                                    <div className="col-span-12 md:col-span-8 space-y-4">
                                                        <div>
                                                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">ข้อความบรรยาย (Optional)</label>
                                                            <textarea
                                                                rows={3}
                                                                placeholder="พิมพ์ข้อความที่ต้องการแสดง..."
                                                                className="w-full p-3 rounded-xl bg-white border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-gold-primary/30 outline-none text-sm resize-none"
                                                                value={block.text}
                                                                onChange={(e) => updateContentBlock(index, 'text', e.target.value)}
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">ตำแหน่งข้อความ</label>
                                                                <select
                                                                    className="w-full p-2.5 rounded-xl bg-white border-none ring-1 ring-slate-200 outline-none text-sm cursor-pointer"
                                                                    value={block.textPosition}
                                                                    onChange={(e) => updateContentBlock(index, 'textPosition', e.target.value)}
                                                                >
                                                                    <option value="center">ตรงกลางภาพ (Center)</option>
                                                                    <option value="top">ด้านบนภาพ (Top)</option>
                                                                    <option value="bottom">ด้านล่างภาพ (Bottom)</option>
                                                                </select>
                                                                <p className="text-[10px] text-slate-400 mt-1">* ตำแหน่งบนภาพจริง</p>
                                                            </div>
                                                            <div>
                                                                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">รูปแบบฟอนต์</label>
                                                                <select
                                                                    className="w-full p-2.5 rounded-xl bg-white border-none ring-1 ring-slate-200 outline-none text-sm cursor-pointer"
                                                                    value={block.fontFamily}
                                                                    onChange={(e) => updateContentBlock(index, 'fontFamily', e.target.value)}
                                                                >
                                                                    <option value="sans">ค่าเริ่มต้น (Sans-serif)</option>
                                                                    <option value="serif">แบบมีเชิง (Serif - หรูหรา)</option>
                                                                    <option value="mono">พิมพ์ดีด (Monospace)</option>
                                                                </select>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">สีตัวอักษร</label>
                                                                <div className="flex items-center gap-2 p-1 bg-white rounded-xl border border-slate-200">
                                                                    <input
                                                                        type="color"
                                                                        className="w-8 h-8 rounded-lg border-none cursor-pointer p-0"
                                                                        value={block.textColor}
                                                                        onChange={(e) => updateContentBlock(index, 'textColor', e.target.value)}
                                                                    />
                                                                    <span className="text-xs font-mono text-slate-500 uppercase">{block.textColor}</span>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">ขนาดตัวอักษร</label>
                                                                <select
                                                                    className="w-full p-2.5 rounded-xl bg-white border-none ring-1 ring-slate-200 outline-none text-sm cursor-pointer"
                                                                    value={block.textSize}
                                                                    onChange={(e) => updateContentBlock(index, 'textSize', e.target.value)}
                                                                >
                                                                    <option value="xs">เล็กมาก (XS)</option>
                                                                    <option value="sm">เล็ก (SM)</option>
                                                                    <option value="base">ปกติ (Base)</option>
                                                                    <option value="lg">ใหญ่ (LG)</option>
                                                                    <option value="xl">ใหญ่พิเศษ (XL)</option>
                                                                    <option value="2xl">มหึมา (2XL)</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {contentBlocks.length === 0 && (
                                            <div className="text-center py-8 bg-slate-50/50 border border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center gap-2">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                                                    <ImageIcon className="w-5 h-5" />
                                                </div>
                                                <p className="text-slate-400 text-sm">ยังไม่มีรูปภาพเพิ่มเติม</p>
                                                <button
                                                    type="button"
                                                    onClick={addContentBlock}
                                                    className="text-xs font-bold text-gold-primary hover:underline mt-1"
                                                >
                                                    + เพิ่มรูปภาพตอนนี้
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAddModal(false);
                                            setEditingWallpaper(null);
                                            setNewWallpaper({ title: '', description: '', imageUrl: '', categoryId: '', price: 1, blessing: '', deity: '', isPopular: false, isNew: false, isOffering: false, relatedWallpaperId: '', downloadUrl: '' });
                                            setSelectedFile(null);
                                            setPreviewUrl(null);
                                            setContentBlocks([]);
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
                )
            }

            {/* Modal for adding user */}
            {
                showUserModal && (
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
                )
            }
            {/* Modal for adding/editing category */}
            {
                showCategoryModal && (
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
                )
            }
            {/* Modal for adding/editing slideshow */}
            {
                showSlideshowModal && (
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
                )
            }
        </div >
    );
}
