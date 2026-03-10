"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, UserPlus } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/login?registered=true");
      } else {
        setError(data.message || "เกิดข้อผิดพลาด");
        setLoading(false);
      }
    } catch (err) {
      setError("การเชื่อมต่อมีปัญหา");
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem', paddingTop: '2rem' }}>
      
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{ background: 'var(--accent-gradient)', padding: '1rem', borderRadius: '50%' }}>
            <ShieldCheck size={48} color="white" />
          </div>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>สมัครสมาชิก</h1>
        <p style={{ color: 'var(--text-muted)' }}>เข้าร่วมระบบ <span className="text-gradient">BridgePay</span></p>
      </div>

      <section className="glass-panel animate-fade-in" style={{ padding: '2rem 1.5rem' }}>
        
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>ชื่อ - นามสกุล</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              style={{ padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-color)', fontSize: '1rem' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>อีเมล</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
              style={{ padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-color)', fontSize: '1rem' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>รหัสผ่าน</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{ padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-color)', fontSize: '1rem' }}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ gap: '0.5rem', marginTop: '0.5rem' }}>
            <UserPlus size={18} /> {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
          </button>

        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>มีบัญชีผู้ใช้แล้ว? </span>
          <Link href="/login" style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>
            เข้าสู่ระบบ
          </Link>
        </div>
      </section>

    </div>
  );
}
