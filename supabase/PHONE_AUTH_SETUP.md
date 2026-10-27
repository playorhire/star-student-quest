# Phone sign-in with WhatsApp OTP

Phone sign-in uses Supabase Auth's Send SMS hook, with the hook delivering its OTP through the WhatsApp Cloud API. The sender uses an approved WhatsApp **authentication** template with a copy-code/URL OTP button. It sends the code in both the body and button parameters.

## Configure Supabase and Meta

1. In Meta WhatsApp Manager, set up a WhatsApp Business sender and create/approve an authentication OTP template with a body code placeholder and copy-code button. Record the sender's **Phone Number ID**, a permanent access token with `whatsapp_business_messaging`, the exact template name, and language code.
2. Deploy the Edge Function: `supabase functions deploy send-whatsapp-otp --no-verify-jwt`.
3. Generate a Standard Webhooks secret (format `v1,whsec_...`) and configure the same value in both places:

   - Edge Function secret `SEND_SMS_HOOK_SECRET`.
   - Supabase **Authentication → Hooks → Send SMS** signing secret.

4. Set these Edge Function secrets using `supabase secrets set`:

   - `WHATSAPP_ACCESS_TOKEN`
   - `WHATSAPP_PHONE_NUMBER_ID`
   - `WHATSAPP_AUTH_TEMPLATE_NAME`
   - `WHATSAPP_AUTH_TEMPLATE_LANGUAGE` (for example, `en_US`)
   - `WHATSAPP_GRAPH_API_VERSION` (a currently supported Meta Graph API version, such as `vXX.0`)

5. In **Authentication → Sign In / Providers → Phone**, enable phone sign-in and leave automatic phone confirmation off so Auth generates and verifies the OTP.
6. In **Authentication → Hooks → Send SMS**, choose the HTTP hook and set its URL to `https://<project-ref>.supabase.co/functions/v1/send-whatsapp-otp`. Save and enable it.

The handler validates Supabase's signed hook request and waits for WhatsApp's API response. If Meta rejects the send, the hook returns an error so Auth does not report that the OTP was sent. The recipient must be reachable on WhatsApp, the authentication template must be approved, and required WhatsApp opt-in/policy requirements must be met. Use the current Graph API version for your Meta app; it is deliberately supplied as a secret/config value rather than fixed in code.
