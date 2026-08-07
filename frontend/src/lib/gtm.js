import { sendGTMEvent } from "@next/third-parties/google";

export function trackPageView(url) {
  sendGTMEvent({ event: "page_view", page_path: url });
}

export function trackContactFormSubmit({ name, email, phone, message }) {
  sendGTMEvent({
    event: "contact_form_submit",
    form_name: "contact_form",
    contact_name: name || "not_set",
    contact_email: email || "not_set",
    contact_phone: phone || "not_set",
    contact_message: message || "not_set",
  });
}
