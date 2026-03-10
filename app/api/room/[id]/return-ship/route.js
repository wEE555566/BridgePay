import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Room from "@/models/Room";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { returnTrackingNumber } = await req.json();

    await connectMongo();
    const room = await Room.findOne({ roomCode: params.id });

    if (!room) return NextResponse.json({ message: "ไม่พบห้องนี้" }, { status: 404 });
    
    // Only Buyer can return ship
    if (room.buyerId?.toString() !== session.user.id) {
       return NextResponse.json({ message: "เฉพาะผู้ซื้อเท่านั้นที่สามารถส่งคืนสินค้าได้" }, { status: 403 });
    }

    if (room.status === 'RETURN_REQUESTED') {
      room.status = 'RETURN_SHIPPED';
      room.returnTrackingNumber = returnTrackingNumber;
      await room.save();
      return NextResponse.json({ message: "อัปเดตสถานะส่งคืนแล้ว", room }, { status: 200 });
    }

    return NextResponse.json({ message: "สถานะห้องไม่ถูกต้อง" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ message: "เกิดข้อผิดพลาด", error: error.message }, { status: 500 });
  }
}
