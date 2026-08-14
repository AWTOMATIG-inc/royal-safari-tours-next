import { db_connect } from "@/database";
import { ContactModel } from "@/database/models/contactModel";
import { transporter } from "@/lib/transporter";
import { NextResponse } from "next/server";

export async function POST(request) {
  const formData = await request.formData();
  console.log(Object.fromEntries(formData));
  if (
    !formData.has("name") ||
    !formData.has("email") ||
    !formData.has("phone") ||
    !formData.has("message") ||
    !formData.has("destination") ||
    !formData.has("date") ||
    !formData.has("people")
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }
  const { name, email, phone, message, destination, date, people } = Object.fromEntries(formData);

  try {
    await db_connect();
    const contactData = await ContactModel.create({
      name,
      email,
      phone,
      message,
      destination,
      date,
      people,
    });
    if (!contactData) {
      return NextResponse.json(
        { error: "Failed to save contact data" },
        { status: 500 },
      );
    }
    const mail_html = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #4CAF50;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Destination:</strong> ${destination}</p>
        <p><strong>Travel Date:</strong> ${date}</p>
        <p><strong>Number of People:</strong> ${people}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      </div>
    `;
    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: `Contact Request From ${name}`,
      html: mail_html,
      attachments: [],
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error({ error: "Error sending email" }, error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
export async function GET(request) {
  try {
    await db_connect();
    const contactData = await ContactModel.find();
    console.log(contactData);
    if (!contactData) {
      return NextResponse.json(
        { error: "Contact data fetch failed" },
        { status: 500 },
      );
    }

    return NextResponse.json(contactData, {
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
