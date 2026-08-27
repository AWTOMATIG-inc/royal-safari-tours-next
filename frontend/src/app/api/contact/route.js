import { db_connect } from "@/database";
import { ContactModel } from "@/database/models/contactModel";
import { transporter } from "@/lib/transporter";
import { NextResponse } from "next/server";

export async function POST(request) {
  const formData = await request.formData();
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
      status: "New",
    });

    if (!contactData) {
      return NextResponse.json(
        { error: "Failed to save contact data" },
        { status: 500 },
      );
    }

    const adminEmail = process.env.EMAIL || "reservation.rst@gmail.com";

    // 1. Admin Email HTML
    const adminMailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #f9fbf9; border: 1px solid #e2e8f0; border-radius: 16px;">
        <div style="background-color: #0D231E; padding: 20px; text-align: center; border-radius: 12px 12px 0 0;">
          <h2 style="color: #2cb775; margin: 0; font-size: 20px; font-weight: 700;">ROYAL SAFARI TOURS</h2>
          <p style="color: #e2e8f0; margin: 4px 0 0 0; font-size: 13px;">New Expedition Inquiry Received</p>
        </div>
        <div style="padding: 24px; background-color: #ffffff; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
          <h3 style="color: #0D231E; border-bottom: 2px solid #2cb775; padding-bottom: 8px; margin-top: 0;">Customer Information</h3>
          <p><strong>Full Name:</strong> ${name}</p>
          <p><strong>Email Address:</strong> <a href="mailto:${email}" style="color: #2cb775;">${email}</a></p>
          <p><strong>Phone Number:</strong> ${phone}</p>
          <p><strong>Destination:</strong> ${destination}</p>
          <p><strong>Travel Date:</strong> ${date}</p>
          <p><strong>Number of People:</strong> ${people} Person(s)</p>
          
          <h3 style="color: #0D231E; border-bottom: 2px solid #2cb775; padding-bottom: 8px; margin-top: 20px;">Trip Description & Message</h3>
          <p style="background-color: #f8fafc; padding: 12px; border-left: 4px solid #2cb775; border-radius: 4px; color: #334155; line-height: 1.6;">${message}</p>
          
          <p style="font-size: 11px; color: #94a3b8; margin-top: 24px; text-align: center;">Received on ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `;

    // 2. Customer Confirmation Email HTML
    const customerMailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
        <div style="background-color: #0D231E; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
          <h2 style="color: #2cb775; margin: 0; font-size: 22px; font-weight: 700;">ROYAL SAFARI TOURS</h2>
          <p style="color: #f1f5f9; margin: 6px 0 0 0; font-size: 14px;">Thank You for Your Inquiry</p>
        </div>
        <div style="padding: 24px; background-color: #ffffff; color: #334155;">
          <p style="font-size: 16px; color: #0D231E;">Dear <strong>${name}</strong>,</p>
          <p style="line-height: 1.6;">We have received your expedition inquiry for <strong>${destination}</strong>! Our luxury travel specialists are reviewing your request and will reach out to you within 24 hours.</p>
          
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 12px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #0D231E; font-size: 14px; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px;">Your Expedition Summary</h4>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Destination:</strong> ${destination}</p>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Travel Date:</strong> ${date}</p>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Number of Travelers:</strong> ${people} Person(s)</p>
          </div>

          <p style="line-height: 1.6;">If you have any urgent changes or questions in the meantime, feel free to reply directly to this email.</p>
          <br/>
          <p style="margin: 0; font-weight: bold; color: #0D231E;">Warmest regards,</p>
          <p style="margin: 4px 0 0 0; color: #2cb775; font-weight: 600;">The Royal Safari Tours Team</p>
        </div>
      </div>
    `;

    // Dispatch both emails in parallel via Nodemailer
    const adminMailPromise = transporter.sendMail({
      from: `"Royal Safari Inquiries" <${adminEmail}>`,
      to: adminEmail,
      subject: `New Expedition Inquiry from ${name} (${destination})`,
      html: adminMailHtml,
    });

    const customerMailPromise = transporter.sendMail({
      from: `"Royal Safari Tours" <${adminEmail}>`,
      to: email,
      subject: `We Received Your Inquiry - Royal Safari Tours`,
      html: customerMailHtml,
    });

    await Promise.allSettled([adminMailPromise, customerMailPromise]);

    return NextResponse.json(
      { message: "Inquiry submitted successfully and confirmation sent." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing contact submission:", error);
    return NextResponse.json(
      { error: "Failed to process inquiry submission." },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await db_connect();
    const contactData = await ContactModel.find().sort({ createdAt: -1 });
    return NextResponse.json(contactData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("GET Contact error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
