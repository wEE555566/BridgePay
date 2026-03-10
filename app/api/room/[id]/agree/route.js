import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Room from "@/models/Room";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    await connectMongo();

    const room = await Room.findOne({ roomCode: params.id });

    if (!room) {
      return NextResponse.json({ message: "ไม่พบห้องนี้" }, { status: 404 });
    }

    const userId = session.user.id;
    let updated = false;

    // We assume if you're not assigned, and you agree, you become the missing party.
    if (!room.buyerId && room.creatorId.toString() !== userId && room.sellerId?.toString() !== userId) {
        room.buyerId = userId;
    } else if (!room.sellerId && room.creatorId.toString() !== userId && room.buyerId?.toString() !== userId) {
        room.sellerId = userId;
    }

    if (room.buyerId?.toString() === userId) {
      room.buyerAgreed = true;
      updated = true;
    } else if (room.sellerId?.toString() === userId) {
      room.sellerAgreed = true;
      updated = true;
    }

    if (updated && room.buyerAgreed && room.sellerAgreed && room.status === 'CREATED') {
      room.status = 'AGREED';
    }

    await room.save();

    return NextResponse.json({ message: "ยืนยันแล้ว", room }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "เกิดข้อผิดพลาด", error: error.message }, { status: 500 });
  }
}
