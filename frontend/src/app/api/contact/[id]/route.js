import { db_connect } from "@/database";
import { ContactModel } from "@/database/models/contactModel";
import { NextResponse } from "next/server";

export async function PUT(request, context) {
  const { id } = await context.params;
  const formData = await request.formData();
  const body = Object.fromEntries(formData);

  try {
    await db_connect();
    if (!formData.has("status")) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }
    const contactData = await ContactModel.findByIdAndUpdate(id,{ status: body.status }, {
      new: true,
      runValidators: true,
    })
      

    if (!contactData) {
      return NextResponse.json({ error: "Contact request not found" }, { status: 404 });
    }

    
    return NextResponse.json(
      { message: "Contact request updated successfully" },
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
export async function DELETE(request, context) {
  const { id } = await context.params;
  try {
    await db_connect();
    const contactData = await ContactModel.findByIdAndDelete(id);
    if (!contactData) {
      return NextResponse.json({ error: "Contact request not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Contact request deleted successfully" },
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
