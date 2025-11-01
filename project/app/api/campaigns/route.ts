import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
// import nodemailer from "nodemailer";
import nodemailer from "nodemailer";
import twilio from "twilio";
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get("slug");

        const db = await getDatabase();
        let query: any = {};

        // if (slug) {
        //     const influencer = await db
        //         .collection("influencers")
        //         .findOne({ slug: { $regex: `^${slug}$`, $options: "i" } });

        //     if (!influencer) {
        //         return NextResponse.json({
        //             success: true,
        //             data: [],
        //             message: `No influencer found for slug "${slug}"`,
        //         });
        //     }

        //     query.influencerId = influencer._id;
        // }
        if (slug) {
            const influencer = await db
                .collection("influencers")
                .findOne({ slug: { $regex: `^${slug}$`, $options: "i" } });

            if (!influencer) {
                return NextResponse.json({
                    success: true,
                    data: [],
                    message: `No influencer found for slug "${slug}"`,
                });
            }

            query["influencers.influencerId"] = influencer._id;
        }

        const campaigns = await db.collection("campaigns").find(query).toArray();
        return NextResponse.json({ success: true, data: campaigns });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// ✅ POST create new campaign + send styled email
// export async function POST(req: Request) {
//   try {
//     const db = await getDatabase();
//     const body = await req.json();
//     const { title, influencerId, clientId, startDate, endDate, status, budget } = body;

//     if (!title || !influencerId || !clientId) {
//       return NextResponse.json(
//         { success: false, error: "Missing required fields" },
//         { status: 400 }
//       );
//     }
//     // Fetch influencer email
//     const influencer = await db
//       .collection("influencers")
//       .findOne({ _id: new ObjectId(influencerId) });
//     const newCampaign = {
//       title,
//       influencerId: new ObjectId(influencerId),
//       clientId: new ObjectId(clientId),
//       startDate: startDate ? new Date(startDate) : null,
//       endDate: endDate ? new Date(endDate) : null,
//       status: status || "Pending",
//       budget: budget || 0,
//        influencerEmail: influencer?.email || "",
//       influencerPhone: influencer?.phone || "",
//       createdAt: new Date(),
//     };

//     const result = await db.collection("campaigns").insertOne(newCampaign);



//     if (influencer?.email) {
//       try {
//         const transporter = nodemailer.createTransport({
//           service: "gmail",
//           auth: {
//             user: process.env.SMTP_EMAIL,
//             pass: process.env.SMTP_PASSWORD,
//           },
//         });

//         const mailOptions = {
//           from: `"InfluConnect" <${process.env.SMTP_EMAIL}>`,
//           to: influencer.email,
//           subject: `📢 New Campaign Assigned: ${title}`,
//           html: `
//           <div style="background-color:#f5f7fa;padding:40px 0;font-family:Arial,sans-serif;">
//             <div style="max-width:600px;margin:auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.1);">
//               <div style="background-color:#2563eb;color:white;padding:20px;text-align:center;">
//                 <h1 style="margin:0;font-size:22px;">InfluConnect</h1>
//               </div>
//               <div style="padding:25px 30px;color:#333;">
//                 <h2 style="margin:0 0 15px;font-size:20px;">Hi ${influencer.name || "Influencer"},</h2>
//                 <p style="font-size:15px;line-height:1.6;">
//                   You’ve been assigned a new campaign! Below are the details:
//                 </p>

//                 <table style="width:100%;margin:20px 0;border-collapse:collapse;">
//                   <tr>
//                     <td style="padding:8px 0;font-weight:bold;width:150px;">📌 Campaign</td>
//                     <td>${title}</td>
//                   </tr>
//                   <tr>
//                     <td style="padding:8px 0;font-weight:bold;">💰 Budget</td>
//                     <td>₹${budget?.toLocaleString() || "N/A"}</td>
//                   </tr>
//                   <tr>
//                     <td style="padding:8px 0;font-weight:bold;">📅 Start Date</td>
//                     <td>${startDate ? new Date(startDate).toDateString() : "N/A"}</td>
//                   </tr>
//                   <tr>
//                     <td style="padding:8px 0;font-weight:bold;">⏰ End Date</td>
//                     <td>${endDate ? new Date(endDate).toDateString() : "N/A"}</td>
//                   </tr>
//                   <tr>
//                     <td style="padding:8px 0;font-weight:bold;">📂 Status</td>
//                     <td>${status || "Pending"}</td>
//                   </tr>
//                 </table>

//                 <p style="font-size:15px;line-height:1.6;">
//                   Please check your <a href="${process.env.APP_URL || "#"}" style="color:#2563eb;text-decoration:none;">InfluConnect Dashboard</a> for more details.
//                 </p>

//                 <div style="margin-top:25px;">
//                   <a href="${process.env.APP_URL || "#"}"
//                     style="background-color:#2563eb;color:white;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">
//                     View Campaign
//                   </a>
//                 </div>

//                 <p style="margin-top:30px;font-size:13px;color:#777;">
//                   — The InfluConnect Team
//                 </p>
//               </div>
//             </div>
//           </div>
//           `,
//         };

//         await transporter.sendMail(mailOptions);
//       } catch (mailErr) {
//         console.error("❌ Email send failed:", mailErr);
//       }
//     }

//     return NextResponse.json({ success: true, data: result });
//   } catch (error: any) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }
// export async function POST(req: Request) {
//     try {
//         const db = await getDatabase();
//         const body = await req.json();
//         const { title, influencerIds, clientId, startDate, endDate, status, budget, description } = body;

//         if (!title || !influencerIds?.length || !clientId) {
//             return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
//         }

//         // Fetch influencer details
//         const selectedInfluencers = await db
//             .collection("influencers")
//             .find({ _id: { $in: influencerIds.map((id: string) => new ObjectId(id)) } })
//             .toArray();

//         const campaign = {
//             title,
//             clientId: new ObjectId(clientId),
//             influencers: selectedInfluencers.map((i) => ({
//                 influencerId: i._id,
//                 name: i.name,
//                 email: i.email,
//                 phone: i.phone,
//             })),
//             startDate: startDate ? new Date(startDate) : null,
//             endDate: endDate ? new Date(endDate) : null,
//             description,
//             status: status || "Pending",
//             budget: budget || 0,
//             createdAt: new Date(),
//         };

//         const result = await db.collection("campaigns").insertOne(campaign);

//         // 📧 Send emails and WhatsApp
//         for (const influencer of selectedInfluencers) {
//             try {
//                 // Send Email
//                 if (influencer.email) {
//                     const transporter = nodemailer.createTransport({
//                         service: "gmail",
//                         auth: {
//                             user: process.env.SMTP_EMAIL,
//                             pass: process.env.SMTP_PASSWORD,
//                         },
//                     });

//                     await transporter.sendMail({
//                         from: `"InfluConnect" <${process.env.SMTP_EMAIL}>`,
//                         to: "influconnectbytheteamc@gmail.com",
//                         subject: `📢 New Campaign: ${title}`,
//                         html: `<p>Hi ${influencer.name},</p><p>${description}</p>`,
//                     });
//                 }

//                 // Send WhatsApp
//                 if (influencer.phone) {
//                     const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

//                     try {
//                         await client.messages.create({
//                             from: "whatsapp:+14155238886", // Twilio Sandbox number
//                             to: `whatsapp:+91${influencer.phone}`, // influencer’s WhatsApp number (e.g. +919951903109)
//                             body: `Hi ${influencer.name || "there"} 👋,
// You’ve been assigned a new campaign:
// 📢 ${campaign.title}
// 💰 Budget: ₹${campaign.budget}
// 📅 ${campaign.startDate} → ${campaign.endDate}
// Please check your InfluConnect dashboard for details.`,
//                         });

//                         console.log("✅ Message sent to influencer:", influencer.phone);
//                     } catch (error) {
//                         if (error instanceof Error) {
//                             console.error("❌ Error sending WhatsApp message:", error.message);
//                         } else {
//                             console.error("❌ Error sending WhatsApp message:", error);
//                         }
//                     }
//                 }
//             } catch (msgErr) {
//                 console.error("Message send failed:", msgErr);
//             }
//         }

//         return NextResponse.json({ success: true, data: result });
//     } catch (error: any) {
//         return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//     }
// }
export async function POST(req: Request) {
    try {
        const db = await getDatabase();
        const body = await req.json();
        const {
            title,
            influencerIds,
            clientId,
            startDate,
            endDate,
            status,
            budget,
            description,
            campaignCode,
        } = body;

        if (!title || !influencerIds?.length || !clientId || !campaignCode) {
            return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
        }

        const selectedInfluencers = await db
            .collection("influencers")
            .find({ _id: { $in: influencerIds.map((id: string) => new ObjectId(id)) } })
            .toArray();

        const campaign = {
            title,
            campaignCode,
            clientId: new ObjectId(clientId),
            influencers: selectedInfluencers.map((i) => ({
                influencerId: i._id,
                name: i.name,
                email: i.email,
                phone: i.phone,
            })),
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
            description,
            status: status || "Pending",
            budget: budget || 0,
            createdAt: new Date(),
        };

        const result = await db.collection("campaigns").insertOne(campaign);
        // 📧 Send emails and WhatsApp
        for (const influencer of selectedInfluencers) {
            try {
                // Send Email
                if (influencer.email) {
                    const transporter = nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                            user: process.env.SMTP_EMAIL,
                            pass: process.env.SMTP_PASSWORD,
                        },
                    });

                    await transporter.sendMail({
                        from: `"InfluConnect" <${process.env.SMTP_EMAIL}>`,
                        to: influencer.email,
                        subject: `📢 New Campaign: ${title}`,
                        html: ` <div style="background-color:#f5f7fa;padding:40px 0;font-family:Arial,sans-serif;">
            <div style="max-width:600px;margin:auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.1);">
              <div style="background-color:#2563eb;color:white;padding:20px;text-align:center;">
                <h1 style="margin:0;font-size:22px;">InfluConnect</h1>
              </div>
              <div style="padding:25px 30px;color:#333;">
                <h2 style="margin:0 0 15px;font-size:20px;">Hi ${influencer.name || "Influencer"},</h2>
                <p style="font-size:15px;line-height:1.6;">
                  You’ve been assigned a new campaign! Below are the details:
                </p>

                <table style="width:100%;margin:20px 0;border-collapse:collapse;">
                  <tr>
                    <td style="padding:8px 0;font-weight:bold;width:150px;">📌 Campaign</td>
                    <td>${title}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;font-weight:bold;">💰 Budget</td>
                    <td>₹${budget?.toLocaleString() || "N/A"}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;font-weight:bold;">📅 Start Date</td>
                    <td>${startDate ? new Date(startDate).toDateString() : "N/A"}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;font-weight:bold;">⏰ End Date</td>
                    <td>${endDate ? new Date(endDate).toDateString() : "N/A"}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;font-weight:bold;">📂 Status</td>
                    <td>${status || "Pending"}</td>
                  </tr>
                </table>

                <p style="font-size:15px;line-height:1.6;">
                  Please check your <a href="${process.env.APP_URL || "#"}" style="color:#2563eb;text-decoration:none;">InfluConnect Dashboard</a> for more details.
                </p>

                <div style="margin-top:25px;">
                  <a href="${process.env.APP_URL || "#"}"
                    style="background-color:#2563eb;color:white;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">
                    View Campaign
                  </a>
                </div>

                <p style="margin-top:30px;font-size:13px;color:#777;">
                  — The InfluConnect Team
                </p>
              </div>
            </div>
          </div>`,
                    });
                }

                // Send WhatsApp
                if (influencer.phone) {
                    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

                    try {
                        await client.messages.create({
                            from: "whatsapp:+14155238886", // Twilio Sandbox number
                            to: `whatsapp:+91${influencer.phone}`, // influencer’s WhatsApp number (e.g. +919951903109)
                            body: `Hi ${influencer.name || "there"} 👋,
You’ve been assigned a new campaign:
📢 ${campaign.title}
💰 Budget: ₹${campaign.budget}
📅 ${campaign.startDate} → ${campaign.endDate}
Please check your InfluConnect dashboard for details.`,
                        });

                      
                    } catch (error) {
                        if (error instanceof Error) {
                            console.error("❌ Error sending WhatsApp message:", error.message);
                        } else {
                            console.error("❌ Error sending WhatsApp message:", error);
                        }
                    }
                }
            } catch (msgErr) {
                console.error("Message send failed:", msgErr);
            }
        }


        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// ✅ PATCH update campaign status
// ✅ PATCH update influencer status in a campaign
export async function PATCH(req: Request) {
    try {
        const db = await getDatabase();
        const body = await req.json();
        const { campaignId, influencerId, status } = body;

        if (!campaignId || !influencerId || !status) {
            return NextResponse.json(
                { success: false, error: "Campaign ID, Influencer ID and status are required" },
                { status: 400 }
            );
        }

        const result = await db.collection("campaigns").updateOne(
            { _id: new ObjectId(campaignId), "influencers.influencerId": new ObjectId(influencerId) },
            { $set: { "influencers.$.status": status } }
        );

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

