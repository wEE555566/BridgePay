import { NextResponse } from "next-auth/next";
import connectMongo from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse as Response } from "next/server";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return Response.json({ message: "กรุณากรอกข้อมูลให้ครบ" }, { status: 400 });
    }

    await connectMongo();

    const exists = await User.findOne({ email });

    if (exists) {
      return Response.json({ message: "อีเมลนี้ถูกใช้งานแล้ว" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return Response.json({ message: "สมัครสมาชิกสำเร็จ" }, { status: 201 });
  } catch (error) {
    return Response.json({ message: "เกิดข้อผิดพลาดในการสมัครสมาชิก", error: error.message }, { status: 500 });
  }
}
