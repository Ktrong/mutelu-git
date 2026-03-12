"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Save, Upload, User, Mail, Phone, Loader2, MapPin } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function EditProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const userData = localStorage.getItem("user");
            if (userData) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                fetchProfileData(parsedUser.id);
            } else {
                window.location.href = "/auth/login?redirect=/profile/edit";
            }
        }
    }, []);

    const fetchProfileData = async (userId: string) => {
        try {
            const res = await fetch(`/api/profile?userId=${userId}`);
            if (res.ok) {
                const data = await res.json();
                setName(data.user.name || "");
                setPhone(data.user.phone || "");
                setAddress(data.user.address || "");
            }
        } catch (error) {
            console.error("Failed to fetch profile:", error);
            toast.error("ดึงข้อมูลไม่สำเร็จ");
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append("userId", user.id);
            formData.append("name", name);
            formData.append("phone", phone);
            formData.append("address", address);
            if (imageFile) {
                formData.append("image", imageFile);
            }

            const res = await fetch("/api/profile", {
                method: "PUT",
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                const updatedUser = { ...user, name: data.user.name, image: data.user.image };
                localStorage.setItem("user", JSON.stringify(updatedUser)); // update local user in case name changed
                toast.success("บันทึกข้อมูลเรียบร้อยแล้ว");
                router.push("/profile");
            } else {
                toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
            }
        } catch (error) {
            console.error("Failed to update profile:", error);
            toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-var-bg pb-24 pt-[80px] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
            </main>
        );
    }

    return (
        <main className="pb-24">

            <div className="px-4 max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-6 mt-4">
                    <Link href="/profile" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-600 hover:text-gold transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-800">แก้ไขโปรไฟล์</h1>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gold-light/20 shadow-xl relative overflow-hidden">
                    <form onSubmit={handleSave} className="space-y-5">
                        <div className="flex justify-center mb-6">
                            <div className="relative group cursor-pointer">
                                <div className="w-24 h-24 bg-gold-light/30 rounded-full border-4 border-white shadow-md flex items-center justify-center overflow-hidden shrink-0">
                                    {imagePreview || user?.image ? (
                                        <img src={imagePreview || getImageUrl(user.image)} alt={user?.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-12 h-12 text-gold-secondary" />
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white text-[10px] font-bold">เปลี่ยนรูป</span>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleImageChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <User className="w-4 h-4 text-gold" /> ชื่อ-นามสกุล
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full h-12 px-4 rounded-full border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all text-slate-700 font-medium"
                                placeholder="กรอกชื่อ-นามสกุล"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gold" /> เบอร์โทรศัพท์
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full h-12 px-4 rounded-full border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all text-slate-700 font-medium"
                                placeholder="กรอกเบอร์โทรศัพท์"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gold" /> ที่อยู่จัดส่ง / ติดต่อ
                            </label>
                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                rows={3}
                                className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all text-slate-700 font-medium resize-none shadow-sm"
                                placeholder="กรอกรายละเอียดที่อยู่"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full h-14 bg-gradient-to-r from-gold to-gold-hover text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" /> บันทึกข้อมูล
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
