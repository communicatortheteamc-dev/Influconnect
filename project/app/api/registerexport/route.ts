import { getDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

// Flatten and clean MongoDB document
function cleanDoc(doc: any) {
  const result: any = {};
  result._id = doc._id?.$oid || doc._id;
  result.pageName = doc.pageName;
  result.phoneNumber = doc.phoneNumber;
  result.email = doc.email;

  const socialPlatforms = ["instagram", "facebook", "snapchat", "twitter", "threads"];
  socialPlatforms.forEach((platform) => {
    if (doc[platform]) {
      const p = doc[platform];
      result[`${platform}.username`] = p.username || "";
      result[`${platform}.followers`] = Number(p.followers?.$numberInt || p.followers || 0);
      result[`${platform}.profileLink`] = p.profileLink || "";

      if (p.budget) {
        result[`${platform}.budget.costPerPost`] = Number(p.budget.costPerPost || 0);
        result[`${platform}.budget.costPerReel`] = Number(p.budget.costPerReel || 0);
        result[`${platform}.budget.costPerStory`] = Number(p.budget.costPerStory || 0);
        result[`${platform}.budget.costPerCollaboration`] =
          Number(p.budget.costPerCollaboration || 0);
      }
    }
  });

  result.createdAt = doc.createdAt?.$date?.$numberLong
    ? new Date(Number(doc.createdAt.$date.$numberLong)).toISOString()
    : doc.createdAt || "";

  return result;
}

export async function GET() {
  try {
    const db = await getDatabase();
    const data = await db.collection("registerdata").find().toArray();

    const cleanedData = data.map(cleanDoc);

    const worksheet = XLSX.utils.json_to_sheet(cleanedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "RegisterData");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Disposition": 'attachment; filename="registerdata.xlsx"',
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (err: any) {
    console.error("❌ Error exporting registerdata:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
