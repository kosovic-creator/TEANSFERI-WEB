import nodemailer from "nodemailer"

export async function sendConfirmationEmail(to: string, transferData: { korisnik: string, datum: string, relacija: string }) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("SMTP config missing")
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const info = await transporter.sendMail({
    from: `Transferi <${process.env.SMTP_USER}>`,
    to,
    subject: "Potvrda transfera / Transfer Confirmation",
    text: `Poštovani ${transferData.korisnik},\n\nVaš transfer (${transferData.relacija}) za datum ${transferData.datum} je uspješno zabilježen.\n\nHvala!\n\nDear ${transferData.korisnik},\nYour transfer (${transferData.relacija}) for ${transferData.datum} is confirmed.\n\nThank you!`,
  })

  return info
}
