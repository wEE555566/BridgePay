import { NextResponse } from "next/server";
import connectMongo from "../../../lib/mongodb";
import Room from "../../../models/Room";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "กรุณาเข้าสู่ระบบหมอรับ" }, { status: 401 });
    }

    const { itemName, itemPrice, role } = await req.json();

    if (!itemName || !itemPrice || !role) {
      return NextResponse.json({ message: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
    }

    await connectMongo();

    // Generate random room code
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const newRoom = await Room.create({
      roomCode,
      creatorId: session.user.id,
      buyerId: role === 'buyer' ? session.user.id : null,
      sellerId: role === 'seller' ? session.user.id : null,
      itemName,
      itemPrice: Number(itemPrice),
      fee: 20
    });

    return NextResponse.json({ message: "สร้างห้องสำเร็จ", roomCode: newRoom.roomCode }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "เกิดข้อผิดพลาดในการสร้างห้อง", error: error.message }, { status: 500 });
  }
}
