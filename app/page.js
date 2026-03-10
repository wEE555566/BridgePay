import Link from "next/link";
import { ShieldCheck, ArrowRight, Package, Wallet } from "lucide-react";

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      
      {/* Hero Section */}
      <section className="glass-panel animate-fade-in" style={{ textAlign: 'center', marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{ background: 'var(--accent-gradient)', padding: '1rem', borderRadius: '50%' }}>
            <ShieldCheck size={48} color="white" />
          </div>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem', lineHeight: 1.2 }}>
          Bridge<span className="text-gradient">Pay</span>
        </h1>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
          ซื้อขายสบายใจ <span className="text-gradient">จ่ายแค่ยี่สิบ</span>
        </h2>
        <p style={{ marginBottom: '2rem', fontSize: '0.95rem' }}>
          แพลตฟอร์มตัวกลางถือเงิน ปลอดภัย 100% จนกว่าจะได้รับของ ตรงปกค่อยโอนเงินให้ผู้ขาย
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link href="/dashboard" className="btn btn-primary btn-block" style={{ gap: '0.5rem' }}>
            เข้าสู่ระบบจัดการซื้อขาย (Dashboard) <ArrowRight size={18} />
          </Link>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            หรือ <Link href="/login" style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>เข้าสู่ระบบ</Link> / <Link href="/register" style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>สมัครสมาชิก</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="glass-panel animate-fade-in delay-200" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', textAlign: 'center' }}>ระบบทำงานอย่างไร?</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
              <Wallet size={24} color="var(--accent-primary)" />
            </div>
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>1. โอนเงินไว้ตรงกลาง</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ผู้ซื้อโอนค่าสินค้า + ค่าบริการ 20 บาท เข้าบัญชีกลางของ BridgePay ด้วย QR Code</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
              <Package size={24} color="var(--accent-secondary)" />
            </div>
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>2. ผู้ขายส่งของพร้อมหลักฐาน</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>อัปโหลดรูปพัสดุและเลขแทรคกิ้งลงระบบเข้ารหัส</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
              <ShieldCheck size={24} color="var(--success-color)" />
            </div>
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>3. ตรวจสอบและรับเงิน</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>เมื่อผู้ซื้อยืนยันรับของถูกต้อง ระบบจะโอนเงินให้ผู้ขายทันที</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
