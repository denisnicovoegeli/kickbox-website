import "server-only";

export interface EmailMessage {
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
}

export interface EmailSender {
  send(message: EmailMessage): Promise<void>;
}

/** Sends email through the Resend HTTP API. */
export function createResendSender(apiKey: string, from: string): EmailSender {
  return {
    async send(message) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [message.to],
          reply_to: message.replyTo,
          subject: message.subject,
          text: message.text,
        }),
      });
      if (!response.ok) {
        throw new Error(`Resend responded with ${response.status}`);
      }
    },
  };
}

/** Records messages instead of sending them; used in tests and CI. */
export function createFakeSender(): EmailSender & { sent: EmailMessage[] } {
  const sent: EmailMessage[] = [];
  return {
    sent,
    async send(message) {
      sent.push(message);
    },
  };
}

export function getEmailSender(): EmailSender {
  const { RESEND_API_KEY, EMAIL_FROM } = process.env;
  if (RESEND_API_KEY && EMAIL_FROM) {
    return createResendSender(RESEND_API_KEY, EMAIL_FROM);
  }
  return createFakeSender();
}
