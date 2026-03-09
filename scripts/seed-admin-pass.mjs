import { randomBytes } from "node:crypto";

function generatePassword(length = 24) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
  const bytes = randomBytes(length * 2);
  let out = "";
  for (let i = 0; i < bytes.length && out.length < length; i += 1) {
    out += chars[bytes[i] % chars.length];
  }
  return out;
}

const password = generatePassword(24);

console.log("Generated admin password:");
console.log(password);
console.log("");
console.log("Copy this to your .env.local:");
console.log(`ADMIN_DASHBOARD_PASSWORD=${password}`);
