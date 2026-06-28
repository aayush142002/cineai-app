import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { plan } = await req.json();

let amount = 0;

switch (plan) {
  case "starter":
    amount = 99;
    break;

  case "creator":
    amount = 249;
    break;

  case "pro":
    amount = 699;
    break;

  default:
    return NextResponse.json(
      { error: "Invalid plan" },
      { status: 400 }
    );
}

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return NextResponse.json(order);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to create order",
      },
      {
        status: 500,
      }
    );
  }
}