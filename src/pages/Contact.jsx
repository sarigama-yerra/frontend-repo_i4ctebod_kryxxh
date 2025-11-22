import React from 'react';
import { toast } from 'react-toastify';

export default function Contact() {
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      // EmailJS REST API (no server). Requires public key and service/template IDs
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        // Demo mode fallback
        await new Promise(r => setTimeout(r, 800));
        toast.success('Message sent (demo)');
        e.currentTarget.reset();
        return;
      }

      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            from_name: payload.name,
            from_email: payload.email,
            subject: payload.subject,
            message: payload.message,
          },
        }),
      });

      if (!res.ok) throw new Error('Failed to send');
      toast.success('Message sent!');
      e.currentTarget.reset();
    } catch (err) {
      console.error(err);
      toast.error('Could not send message');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold text-white mb-6">Contact Me</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input name="name" placeholder="Your name" className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white focus:outline-none focus:border-blue-500" />
          <input type="email" name="email" placeholder="Your email" className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white focus:outline-none focus:border-blue-500" />
        </div>
        <input name="subject" placeholder="Subject" className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white focus:outline-none focus:border-blue-500" />
        <textarea name="message" rows="6" placeholder="Message" className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white focus:outline-none focus:border-blue-500" />
        <button disabled={loading} className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-60">
          {loading ? 'Sending…' : 'Send Message'}
        </button>
      </form>
      <p className="text-blue-300/70 text-sm mt-3">Powered by EmailJS (client‑side). Configure keys to enable live emails.</p>
    </div>
  );
}
