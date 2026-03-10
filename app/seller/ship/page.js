"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Box, Camera, Truck, CheckCircle2 } from "lucide-react";

export default function SellerShip() {
  const [tracking, setTracking] = useState("");
  const [hasPhoto, setHasPhoto] = useState(false);
  const [step, setStep] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tracking && hasPhoto) {
      setStep(2);
    }
  };

  const simulateTakePhoto = () => {
    setHasPhoto(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
        <Link href="/" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={24} />
        </Link>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>ส่งสินค้า (ผู้ขาย)</h1>
      </div>

      <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <Box color="var(--accent-primary)" size={24} style={{ marginTop: '0.2rem' }} />
        <div>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>รหัสคำสั่งซื้อ #BP-98234</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ยอดเงิน ฿1,500 สแตนด์บายอยู่ในระบบแล้ว กรุณาจัดส่งสินค้าเพื่อรับเงิน</p>
        </div>
      </div>

      {step === 1 && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <section className="glass-panel animate-fade-in" style={{ padding: '1.5rem' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Camera size={20} color="var(--accent-secondary)" /> หลักฐานการส่ง
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              ถ่ายรูปสินค้าคู่กับใบจ่าหน้าพัสดุ เพื่อป้องกันการแอบอ้าง
            </p>

            <div 
              onClick={simulateTakePhoto}
              style={{
                height: '150px',
                border: hasPhoto ? '2px solid var(--success-color)' : '2px dashed var(--glass-border)',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                background: hasPhoto ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                transition: 'all 0.3s'
              }}
            >
              {hasPhoto ? (
                <>
                  <CheckCircle2 size={32} color="var(--success-color)" />
                  <span style={{ fontSize: '0.9rem', color: 'var(--success-color)' }}>บันทึกรูปภาพแล้ว</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>คลิกเพื่อถ่ายใหม่</span>
                </>
              ) : (
                <>
                  <Camera size={32} color="var(--text-muted)" />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>คลิกเพื่อถ่ายรูป</span>
                </>
              )}
            </div>
          </section>

          <section className="glass-panel animate-fade-in delay-100" style={{ padding: '1.5rem' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={20} color="var(--accent-primary)" /> เลขพัสดุ
            </h2>
            <input 
              type="text" 
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              placeholder="เช่น TH0123456789"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '12px',
                border: '1px solid var(--glass-border)',
                background: 'rgba(0,0,0,0.2)',
                color: 'var(--text-color)',
                fontSize: '1rem'
              }}
            />
          </section>

          <button type="submit" className="btn btn-primary btn-block" disabled={!tracking || !hasPhoto}>
            ยืนยันการจัดส่ง
          </button>
        </form>
      )}

      {step === 2 && (
        <section className="glass-panel animate-fade-in" style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <CheckCircle2 size={64} color="var(--success-color)" />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>บันทึกข้อมูลสำเร็จ!</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            ระบบได้แจ้งเตือนผู้ซื้อเรียบร้อยแล้วว่าสินค้ากำลังเดินทาง<br/><br/>
            เมื่อผู้ซื้อได้รับของและกดยืนยัน เงินจะโอนเข้าบัญชีของคุณทันที
          </p>

          <Link href="/" className="btn btn-secondary btn-block">
            กลับหน้าหลัก
          </Link>
        </section>
      )}

    </div>
  );
}
