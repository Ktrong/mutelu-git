import { Suspense } from "react";
import CustomOrderForm from "../components/CustomOrderForm";

export default function OrderPage() {
    return (
        <main className="min-h-screen bg-cream py-20 px-4">
            <div className="max-w-4xl mx-auto text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-sarabun font-bold text-gray-900 mb-4">
                    สั่งทำวอลเปเปอร์มงคล
                </h1>
                <p className="text-gray-600">
                    กรอกข้อมูลของคุณเพื่อให้เราออกแบบวอลเปเปอร์ที่เหมาะสมที่สุดสำหรับดวงชะตาของคุณ
                </p>
            </div>
            <Suspense fallback={<div className="text-center py-10 text-gray-400">กำลังโหลด...</div>}>
                <CustomOrderForm />
            </Suspense>
        </main>
    );
}
