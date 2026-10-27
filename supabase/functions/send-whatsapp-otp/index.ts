import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";

type SendSmsEvent = {
  user?: { phone?: string };
  sms?: { otp?: string };
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const configuredSecret = Deno.env.get("SEND_SMS_HOOK_SECRET");
  if (!configuredSecret) {
    console.error("SEND_SMS_HOOK_SECRET is not configured");
    return json({ error: "SMS hook is not configured" }, 500);
  }

  let event: SendSmsEvent;
  try {
    const payload = await req.text();
    const secret = configuredSecret.replace(/^v1,whsec_/, "");
    event = new Webhook(secret).verify(payload, Object.fromEntries(req.headers)) as SendSmsEvent;
  } catch (error) {
    console.error("Invalid Supabase Auth hook signature", error);
    return json({ error: "Invalid hook signature" }, 401);
  }

  const phone = event.user?.phone;
  const otp = event.sms?.otp;
  if (!phone || !otp || !/^\+[1-9]\d{7,14}$/.test(phone)) {
    return json({ error: "Hook event is missing a valid phone number or OTP" }, 400);
  }

  const accessToken = Deno.env.get("WHATSAPP_ACCESS_TOKEN");
  const phoneNumberId = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");
  const templateName = Deno.env.get("WHATSAPP_AUTH_TEMPLATE_NAME");
  const templateLanguage = Deno.env.get("WHATSAPP_AUTH_TEMPLATE_LANGUAGE") ?? "en_US";
  const graphApiVersion = Deno.env.get("WHATSAPP_GRAPH_API_VERSION");

  if (!accessToken || !phoneNumberId || !templateName || !graphApiVersion) {
    console.error("WhatsApp Cloud API secrets are incomplete");
    return json({ error: "WhatsApp sender is not configured" }, 500);
  }

  const response = await fetch(
    `https://graph.facebook.com/${graphApiVersion}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: phone.slice(1),
        type: "template",
        template: {
          name: templateName,
          language: { code: templateLanguage },
          components: [
            { type: "body", parameters: [{ type: "text", text: otp }] },
            {
              type: "button",
              sub_type: "url",
              index: "0",
              parameters: [{ type: "text", text: otp }],
            },
          ],
        },
      }),
    },
  );

  if (!response.ok) {
    const providerError = await response.text();
    console.error("WhatsApp Cloud API rejected OTP message", response.status, providerError);
    return json({ error: "WhatsApp could not send the verification message" }, 502);
  }

  return json({});
});
