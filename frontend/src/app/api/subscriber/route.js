import { db_connect } from "@/database";
import { SubscriberModel } from "@/database/models/subscribeModel";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();
  if (!body.email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }
  if (!body.name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  try {
    await db_connect();
    const isEmail = await SubscriberModel.findOne({ email: body.email });
    if (isEmail) {
      return NextResponse.json(
        { error: "Email already subscribed" },
        { status: 409 },
      );
    }
    const subsciberData = await SubscriberModel.create({
      email: body.email,
      name: body.name,
    });

    if (!subsciberData) {
      return NextResponse.json({ error: "Subscribe failed" }, { status: 500 });
    }
    const paths = ["/dashboard/subscribers"];
    paths.forEach((p) => revalidatePath(p));
    return NextResponse.json(subsciberData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 },
    );
  }
}
export async function GET(request) {
  try {
    await db_connect();
    const subscribeData = await SubscriberModel.find()
      .sort({ createdAt: -1 })
      .limit(10);
    if (!subscribeData) {
      return NextResponse.json(
        { error: "Subscriber fetch failed" },
        { status: 500 },
      );
    }

    return NextResponse.json(subscribeData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 },
    );
  }
}
