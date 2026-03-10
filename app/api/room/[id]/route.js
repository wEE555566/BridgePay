import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Room from "@/models/Room";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    await connectMongo();

    const room = await Room.findOne({ roomCode: params.id }).populate('creatorId buyerId sellerId', 'name email');

    if (!room) {
      return NextResponse.json({ message: "ไม่พบห้องนี้" }, { status: 404 });
    }

    return NextResponse.json({ room }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "เกิดข้อผิดพลาด", error: error.message }, { status: 500 });
  }
}
