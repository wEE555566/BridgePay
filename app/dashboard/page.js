"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Plus, ListFilter, ArrowRight } from "lucide-react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>กำลังโหลด...</div>;
  }

  if (!session) {
    return null; // prevents flash before redirect
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Dashboard</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>สวัสดีคุณ {session.user.name}</p>
        </div>
        <button className="btn btn-secondary" onClick={() => signOut()} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
          ออกจากระบบ
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link href="/room/create" className="btn btn-primary" style={{ flex: 1, gap: '0.5rem' }}>
          <Plus size={18} /> สร้างห้องซื้อขาย
        </Link>
        <button className="btn btn-secondary" style={{ flex: 1, gap: '0.5rem' }}>
          <ListFilter size={18} /> เข้าร่วมผ่านรหัส
        </button>
      </div>

      <h2 style={{ fontSize: '1.1rem', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        รายการห้องของคุณ
      </h2>

      {/* Placeholder for Room List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 'bold' }}>รหัสห้อง: BP-A123</span>
            <span style={{ fontSize: '0.8rem', background: 'rgba(59, 130, 246, 0.2)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: 'var(--accent-primary)' }}>CREATED</span>
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>การ์ดจอ RTX 3080 มือสอง</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>ยอดตกลง: ฿12,000</p>
          <Link href="/room/BP-A123" className="btn btn-secondary btn-block" style={{ fontSize: '0.9rem', gap: '0.5rem', padding: '0.5rem' }}>
            เข้าสู่ห้อง <ArrowRight size={16} />
          </Link>
        </div>

      </div>

    </div>
  );
}
