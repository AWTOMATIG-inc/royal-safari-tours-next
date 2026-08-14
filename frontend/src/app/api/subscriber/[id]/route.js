import { db_connect } from "@/database";
import { SubscriberModel } from "@/database/models/subscribeModel";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function DELETE(request, context) {
  const { id } = await context.params;
  try {
    await db_connect();
    const subscriberData = await SubscriberModel.findByIdAndDelete(id);
    if (!subscriberData) {
      return NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 },
      );
    }
    const paths = ["/dashboard/subscribers"];
    paths.forEach((p) => revalidatePath(p));
    return NextResponse.json(
      { message: "Subscriber deleted successfully" },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 },
    );
  }
}
