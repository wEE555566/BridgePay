"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldAlert, Truck, Box, DollarSign } from "lucide-react";

export default function RoomDetails() {
  const { data: session, status } = useSession();
  const { id } = useParams();
  const router = useRouter();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchRoom() {
      if (status !== "authenticated") return;
      try {
        const res = await fetch(`/api/room/${id}`);
        const data = await res.json();
        if (res.ok) {
          setRoom(data.room);
        } else {
          alert(data.message);
          router.push("/dashboard");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchRoom();
  }, [id, status, router]);

  const handleAction = async (endpoint, payload = {}) => {
    try {
      const res = await fetch(`/api/room/${id}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        setRoom(data.room);
      } else {
        alert("เกิดข้อผิดพลาด");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || status === "loading") {
    return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>กำลังโหลด...</div>;
  }

  if (!room) return null;

  const isBuyerMode = room.buyerId === session?.user?.id;
  const isSellerMode = room.sellerId === session?.user?.id;
  const iHaveAgreed = isBuyerMode ? room.buyerAgreed : (isSellerMode ? room.sellerAgreed : false);
  const totalAmount = room.itemPrice + room.fee;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
        <Link href="/dashboard" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={24} />
        </Link>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>รายละเอียดห้องพักสินค้า</h1>
      </div>

      <section className="glass-panel animate-fade-in" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>รหัสห้อง: {room.roomCode}</span>
          <span style={{ fontSize: '0.8rem', background: 'rgba(59, 130, 246, 0.2)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: 'var(--accent-primary)', fontWeight: 'bold' }}>
            {room.status}
          </span>
        </div>

        <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{room.itemName}</h2>
        
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>ราคาสินค้า:</span>
            <span>฿{room.itemPrice.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>ค่าบริการแพลตฟอร์ม:</span>
            <span>฿{room.fee}</span>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '0.5rem 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: 'var(--accent-primary)', fontSize: '1.1rem' }}>
            <span>ยอดโอนรวม:</span>
            <span>฿{totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </section>

      {/* 1. CREATED - Agreement Stage */}
      {room.status === 'CREATED' && (
        <section className="glass-panel animate-fade-in delay-100" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={20} color="var(--warning-color)" /> ยืนยันข้อตกลง
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            ทั้งสองฝ่ายต้องกดยืนยันข้อตกลงตรงกัน ระบบถึงจะไปสู่ขั้นตอนการชำระเงิน
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass-bg)', padding: '1rem', borderRadius: '12px' }}>
              <span style={{ fontSize: '0.9rem' }}>ผู้ซื้อ {room.buyerId ? `(${room.buyerId.name || 'เข้าร่วมแล้ว'})` : '(ยังไม่เข้าร่วม)'}</span>
              {room.buyerAgreed ? <CheckCircle2 size={20} color="var(--success-color)" /> : <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>รอยืนยัน</span>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass-bg)', padding: '1rem', borderRadius: '12px' }}>
              <span style={{ fontSize: '0.9rem' }}>ผู้ขาย {room.sellerId ? `(${room.sellerId.name || 'เข้าร่วมแล้ว'})` : '(ยังไม่เข้าร่วม)'}</span>
              {room.sellerAgreed ? <CheckCircle2 size={20} color="var(--success-color)" /> : <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>รอยืนยัน</span>}
            </div>
          </div>

          <button onClick={() => handleAction('agree')} className="btn btn-primary btn-block" disabled={iHaveAgreed} style={{ background: iHaveAgreed ? 'var(--success-color)' : 'var(--accent-gradient)' }}>
            {iHaveAgreed ? "คุณยืนยันแล้ว" : "ฉันยอมรับข้อตกลงและเงื่อนไขนี้"}
          </button>
        </section>
      )}

      {/* 2. AGREED - Payment Stage */}
      {room.status === 'AGREED' && (
        <section className="glass-panel animate-fade-in" style={{ padding: '1.5rem' }}>
          {isBuyerMode ? (
            <div style={{ textAlign: 'center' }}>
              <DollarSign size={48} color="var(--accent-primary)" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ marginBottom: '1rem' }}>ขั้นตอนการชำระเงิน</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>ชำระเงินเข้าสู่ระบบกองกลาง BridgePay ปลอดภัย 100%</p>
              <button onClick={() => handleAction('pay')} className="btn btn-primary btn-block">จำลองชำระเงินสำเร็จ</button>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>รอผู้ซื้อชำระเงินเข้าสู่ระบบ...</p>
            </div>
          )}
        </section>
      )}

      {/* 3. PAID - Shipping Stage */}
      {room.status === 'PAID' && (
        <section className="glass-panel animate-fade-in" style={{ padding: '1.5rem' }}>
          {isSellerMode ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Truck size={20} color="var(--accent-primary)" /> แจ้งเลขพัสดุ</h3>
              <input type="text" value={tracking} onChange={e => setTracking(e.target.value)} placeholder="เลขแทรคกิ้ง" style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
              <button onClick={() => handleAction('ship', { trackingNumber: tracking })} className="btn btn-primary btn-block" disabled={!tracking}>ยืนยันการจัดส่ง</button>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>ชำระเงินสำเร็จ รอผู้ขายจัดส่งสินค้า...</p>
            </div>
          )}
        </section>
      )}

      {/* 4. SHIPPED - Receiving/Return Stage */}
      {room.status === 'SHIPPED' && (
        <section className="glass-panel animate-fade-in" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>เลขพัสดุจัดส่ง:</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{room.trackingNumber}</div>
          </div>
          {isBuyerMode ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button onClick={() => handleAction('receive', { action: 'receive' })} className="btn btn-primary btn-block" style={{ background: 'var(--success-color)' }}>ได้รับของแล้ว (สินค้าถูกต้อง)</button>
              <button onClick={() => handleAction('receive', { action: 'return' })} className="btn btn-secondary btn-block" style={{ color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}>แจ้งปัญหา / คืนสินค้า</button>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>จัดส่งแล้ว รอผู้ซื้อกดยืนยันรับสินค้า...</p>
            </div>
          )}
        </section>
      )}

      {/* 5. RECEIVED - Dual Confirmation Payout */}
      {room.status === 'RECEIVED' && (
        <section className="glass-panel animate-fade-in" style={{ padding: '1.5rem' }}>
           <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={20} color="var(--success-color)" /> ยืนยันการโอนเงิน (Payout)
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            ผู้ซื้อได้รับสินค้าแล้ว โปรดกดยืนยันทั้ง 2 ฝ่าย เพื่อให้ระบบโอนเงินให้ผู้ขาย
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass-bg)', padding: '1rem', borderRadius: '12px' }}>
              <span style={{ fontSize: '0.9rem' }}>ผู้ซื้อ</span>
              {room.buyerAgreed ? <CheckCircle2 size={20} color="var(--success-color)" /> : <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>รอยืนยันโอนให้ผู้ขาย</span>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass-bg)', padding: '1rem', borderRadius: '12px' }}>
              <span style={{ fontSize: '0.9rem' }}>ผู้ขาย</span>
              {room.sellerAgreed ? <CheckCircle2 size={20} color="var(--success-color)" /> : <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>รอยืนยันรับเงิน</span>}
            </div>
          </div>

          <button onClick={() => handleAction('payout')} className="btn btn-primary btn-block" disabled={iHaveAgreed} style={{ background: iHaveAgreed ? 'var(--success-color)' : 'var(--accent-gradient)' }}>
            {iHaveAgreed ? "คุณยืนยันแล้ว" : "ยืนยันการโอนเงิน"}
          </button>
        </section>
      )}

      {/* 6. COMPLETED */}
      {room.status === 'COMPLETED' && (
        <section className="glass-panel animate-fade-in" style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
          <CheckCircle2 size={64} color="var(--success-color)" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>เสร็จสมบูรณ์</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>โอนเงินสำเร็จ การทำธุรกรรมจบเรียบร้อย ขอบคุณที่ใช้ BridgePay</p>
        </section>
      )}

      {/* 7. RETURN_REQUESTED - Return Shipping Stage */}
      {room.status === 'RETURN_REQUESTED' && (
        <section className="glass-panel animate-fade-in" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--danger-color)' }}>แจ้งคืนสินค้าแล้ว</h3>
          {isBuyerMode ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>กรุณาจัดส่งสินค้าคืนภายใน 3 วัน และแจ้งเลขพัสดุคืนด้านล่าง</p>
              <input type="text" value={tracking} onChange={e => setTracking(e.target.value)} placeholder="เลขแทรคกิ้ง (ส่งคืน)" style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--danger-color)', color: 'white' }} />
              <button onClick={() => handleAction('return-ship', { returnTrackingNumber: tracking })} className="btn btn-primary btn-block" disabled={!tracking} style={{ background: 'var(--danger-color)' }}>ยืนยันการจัดส่งคืน</button>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>ผู้ซื้อขอคืนสินค้า รอผู้ซื้อจัดส่งพัสดุคืน...</p>
            </div>
          )}
        </section>
      )}

      {/* 8. RETURN_SHIPPED - Seller Receives Return Stage */}
      {room.status === 'RETURN_SHIPPED' && (
        <section className="glass-panel animate-fade-in" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>เลขพัสดุจัดส่งคืน:</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{room.returnTrackingNumber}</div>
          </div>
          {isSellerMode ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ตรวจสอบสินค้าคืนว่าอยู่ในสภาพเดิม</p>
              <button onClick={() => handleAction('return-receive')} className="btn btn-primary btn-block" style={{ background: 'var(--warning-color)' }}>ได้รับสินค้าคืนแล้ว (ถูกต้อง)</button>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>จัดส่งคืนแล้ว รอผู้ขายตรวจสอบและรับสินค้าคืน...</p>
            </div>
          )}
        </section>
      )}

      {/* 9. RETURN_RECEIVED - Refund Dual Confirmation */}
      {room.status === 'RETURN_RECEIVED' && (
        <section className="glass-panel animate-fade-in" style={{ padding: '1.5rem' }}>
           <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning-color)' }}>
            <ShieldAlert size={20} /> ยืนยันการคืนเงิน (Refund)
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            ผู้ขายได้รับสินค้าคืนแล้ว โปรดกดยืนยันทั้ง 2 ฝ่าย เพื่อให้ระบบคืนเงินให้ผู้ซื้อ
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass-bg)', padding: '1rem', borderRadius: '12px' }}>
              <span style={{ fontSize: '0.9rem' }}>ผู้ซื้อ</span>
              {room.buyerAgreed ? <CheckCircle2 size={20} color="var(--warning-color)" /> : <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>รอยืนยันรับเงินคืน</span>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass-bg)', padding: '1rem', borderRadius: '12px' }}>
              <span style={{ fontSize: '0.9rem' }}>ผู้ขาย</span>
              {room.sellerAgreed ? <CheckCircle2 size={20} color="var(--warning-color)" /> : <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>รอยืนยันคืนเงินให้ผู้ซื้อ</span>}
            </div>
          </div>

          <button onClick={() => handleAction('refund')} className="btn btn-primary btn-block" disabled={iHaveAgreed} style={{ background: iHaveAgreed ? 'var(--warning-color)' : 'var(--danger-color)' }}>
            {iHaveAgreed ? "คุณยืนยันแล้ว" : "ยืนยันการโอนเงินคืน"}
          </button>
        </section>
      )}

      {/* 10. REFUNDED */}
      {room.status === 'REFUNDED' && (
        <section className="glass-panel animate-fade-in" style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
          <CheckCircle2 size={64} color="var(--warning-color)" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>คืนเงินเสร็จสิ้น</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>การทำรายการถูกยกเลิกและคืนเงินให้ผู้ซื้อเรียบร้อยแล้ว</p>
        </section>
      )}

    </div>
  );
}

