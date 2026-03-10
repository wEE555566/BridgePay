import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Room from "@/models/Room";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;

    await connectMongo();
    const room = await Room.findOne({ roomCode: params.id });

    if (!room) return NextResponse.json({ message: "ไม่พบห้องนี้" }, { status: 404 });
    
    // Status must be RECEIVED to confirm payout
    if (room.status !== 'RECEIVED') {
      return NextResponse.json({ message: "สถานะห้องไม่ถูกต้อง" }, { status: 400 });
    }

    let updated = false;

    if (room.buyerId?.toString() === userId) {
      room.buyerAgreed = true;
      updated = true;
    } else if (room.sellerId?.toString() === userId) {
      room.sellerAgreed = true;
      updated = true;
    }

    if (updated) {
      // If both agreed to payout, mark as COMPLETED
      if (room.buyerAgreed && room.sellerAgreed) {
        room.status = 'COMPLETED';
        // In a real app, this is where we call SCB Payout API
      }
      await room.save();
      return NextResponse.json({ message: "ยืนยันการโอนเงินสำเร็จ", room }, { status: 200 });
    }

    return NextResponse.json({ message: "คุณไม่มีสิทธิ์กดยืนยัน" }, { status: 403 });
  } catch (error) {
    return NextResponse.json({ message: "เกิดข้อผิดพลาด", error: error.message }, { status: 500 });
  }
}
