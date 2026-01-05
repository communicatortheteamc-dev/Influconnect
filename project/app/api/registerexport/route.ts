import { getDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

const platforms = [
  "instagram",
  "facebook",
  "twitter",
  "snapchat",
  "youtube",
  "threads",
];

export async function GET() {
  try {
    const db = await getDatabase();
    const data = await db.collection("registerdata").find().toArray();

    const rows: any[] = [];
    let sno = 1;

    data.forEach((doc) => {
      let hasAnyPlatform = false;

      platforms.forEach((platform) => {
        if (!doc[platform]) return;

        hasAnyPlatform = true;
        const p = doc[platform];

        rows.push({
          "S.No": sno,
          "Name": doc.pageName || "",
          "Category": doc.category || "",
          "Platform": platform,
          "I'd Name": p.username || "",
          "Followers/ Subscribers": Number(p.followers || 0),
          "Link": p.profileLink || "",
          "Location": doc.location || "",
          "Mobile Number": doc.phoneNumber || "",
          "Email": doc.email || "",
          "Quoted Budget": p.budget?.costPerPost || "",
          "Influ Budget": p.budget?.costPerReel || "",
          "Rating": doc.rating || "",
          "Frequency": doc.frequency || "",
        });
      });

      // ✅ ADD ONE EMPTY ROW AFTER EACH PROFILE
      if (hasAnyPlatform) {
        rows.push({
          "S.No": "",
          "Name": "",
          "Category": "",
          "Platform": "",
          "I'd Name": "",
          "Followers/ Subscribers": "",
          "Link": "",
          "Location": "",
          "Mobile Number": "",
          "Email": "",
          "Quoted Budget": "",
          "Influ Budget": "",
          "Rating": "",
          "Frequency": "",
        });

        sno++; // increment ONLY once per profile
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);

    worksheet["!cols"] = [
      { wch: 6 },
      { wch: 20 },
      { wch: 18 },
      { wch: 12 },
      { wch: 18 },
      { wch: 22 },
      { wch: 30 },
      { wch: 15 },
      { wch: 15 },
      { wch: 25 },
      { wch: 15 },
      { wch: 15 },
      { wch: 10 },
      { wch: 15 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "RegisterData");

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Disposition": 'attachment; filename="registerdata.xlsx"',
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (err: any) {
    console.error("❌ Error exporting registerdata:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
