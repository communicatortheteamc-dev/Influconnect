import crypto from "crypto";

const SALT_KEY = process.env.PHONEPE_SALT_KEY!;
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX!;

export function generatePhonePeChecksum(payload: string, endpoint: string) {
  const stringToHash = payload + endpoint + SALT_KEY;
  const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
  return sha256 + "###" + SALT_INDEX;
}
