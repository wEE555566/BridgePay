"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Box } from "lucide-react";
import { useSession } from "next-auth/react";

export default function CreateRoom() {
  const { data: session } = useSession();
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [role, setRole] = useState("buyer"); // Creator implies what they are
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/room/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemName, itemPrice, role })
      });

      const data = await res.json();
      if (res.ok) {
        router.push(`/room/${data.roomCode}`);
      } else {
        alert(data.message);
        setLoading(false);
      }
    } catch (err) {
      alert("Error creating room");
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
        <Link href="/dashboard" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={24} />
        </Link>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>สร้างห้องซื้อขาย</h1>
      </div>

      <section className="glass-panel animate-fade-in" style={{ padding: '1.5rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>ชื่อสินค้า / ข้อตกลง</label>
            <input 
              type="text" 
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="เช่น การ์ดจอ RTX 3080 มือสองสภาพ 90%"
              required
              style={{ padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-color)', fontSize: '1rem' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>ราคาสินค้า (บาท)</label>
            <input 
              type="number" 
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              placeholder="1500"
              required
              style={{ padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-color)', fontSize: '1rem' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>คุณคือใครในรายการนี้?</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: role === 'buyer' ? 'rgba(59, 130, 246, 0.2)' : 'var(--glass-bg)', padding: '0.75rem', borderRadius: '12px', flex: 1, border: role === 'buyer' ? '1px solid var(--accent-primary)' : '1px solid var(--glass-border)' }}>
                <input type="radio" value="buyer" checked={role === 'buyer'} onChange={(e) => setRole(e.target.value)} style={{ display: 'none' }} />
                <span>ผู้ซื้อ</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: role === 'seller' ? 'rgba(139, 92, 246, 0.2)' : 'var(--glass-bg)', padding: '0.75rem', borderRadius: '12px', flex: 1, border: role === 'seller' ? '1px solid var(--accent-secondary)' : '1px solid var(--glass-border)' }}>
                <input type="radio" value="seller" checked={role === 'seller'} onChange={(e) => setRole(e.target.value)} style={{ display: 'none' }} />
                <span>ผู้ขาย</span>
              </label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ gap: '0.5rem', marginTop: '1rem' }}>
            <Box size={18} /> {loading ? "กำลังสร้าง..." : "สร้างห้องเดี๋ยวนี้"}
          </button>

        </form>
      </section>

    </div>
  );
}
