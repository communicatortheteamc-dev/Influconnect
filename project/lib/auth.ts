import jwt from "jsonwebtoken"

export const signToken = (user: any) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  )
}

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!)
}