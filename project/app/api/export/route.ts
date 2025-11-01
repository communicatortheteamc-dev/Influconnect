import * as XLSX from "xlsx";
import { NextResponse } from "next/server";
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
  const db = await getDatabase();
  const collection1 = db.collection('influencers');
  const collection2 = db.collection('users');
  const influencersData = await collection1.find().toArray();
  const clientsData = await collection2.find().toArray();
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(influencersData), "Influencers");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(clientsData), "Clients");

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  return new NextResponse(buffer, {
    headers: { "Content-Disposition": "attachment; filename=data.xlsx", "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
  });
}
