"use client";

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useContentBySlug } from "@/lib/content/useContentBySlug";

type ContactContent = {
  title?: string;
  description?: string;
  newsletterPrompt?: string;
};

export default function ContactPage() {
  const content = useContentBySlug<ContactContent>("contact", {
    title: "تواصل معنا",
    description: "صفحة التواصل ستتضمن وسائل الاتصال والنموذج الخاص بالمراسلة.",
    newsletterPrompt: "اكتب بريدك الاكتروني ليصلك كل جديد",
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [contactSent, setContactSent] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    setContactSent(true);
  }

  function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubscribed(true);
  }

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <Header />

      <main>
        {/* Top blue wavy divider */}
        <section className="overflow-hidden bg-[#faf8f5]">
          <div className="relative h-16 bg-[#0d5f84]">
            <div className="absolute inset-x-0 bottom-0 h-10 rounded-[100%] bg-[#faf8f5]" />
          </div>
        </section>

        <section className="px-4 pb-14 pt-8 sm:px-6 sm:pt-10">
          <div className="mx-auto max-w-2xl">
            <h1 className="mb-8 text-center text-2xl font-bold text-[#1e3a5f] sm:mb-10 sm:text-3xl">
              {content.title ?? "تواصل معنا"}
            </h1>

            {/* Contact form */}
            <form
              onSubmit={handleContactSubmit}
              className="mb-14 rounded-2xl border border-[#ddd2c4] bg-white p-4 shadow-sm sm:p-6 md:p-8"
            >
              <div className="mb-4">
                <label htmlFor="contact-name" className="mb-2 block text-right text-sm font-medium text-[#1e3a5f]">
                  الاسم <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-right text-[#1e3a5f] outline-none transition focus:border-[#0d5f84] focus:ring-1 focus:ring-[#0d5f84]"
                  placeholder="الاسم"
                  dir="rtl"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="contact-email" className="mb-2 block text-right text-sm font-medium text-[#1e3a5f]">
                  البريد الاكتروني <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-right text-[#1e3a5f] outline-none transition focus:border-[#0d5f84] focus:ring-1 focus:ring-[#0d5f84]"
                  placeholder="البريد الاكتروني"
                  dir="rtl"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="contact-message" className="mb-2 block text-right text-sm font-medium text-[#1e3a5f]">
                  نص الرسالة <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full resize-y rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-right text-[#1e3a5f] outline-none transition focus:border-[#0d5f84] focus:ring-1 focus:ring-[#0d5f84]"
                  placeholder="نص الرسالة"
                  dir="rtl"
                />
              </div>
              {contactSent ? (
                <p className="mb-4 text-center text-[#0d5f84]">تم إرسال رسالتك بنجاح.</p>
              ) : null}
              <button
                type="submit"
                className="rounded-lg bg-gray-200 px-6 py-3 font-medium text-[#1e3a5f] shadow-sm transition hover:bg-gray-300"
              >
                ارسال
              </button>
            </form>

            {/* Dark blue wave divider */}
            <div className="relative mb-14 overflow-hidden">
              <div className="h-1 bg-[#0d5f84]" />
              <div className="absolute inset-x-0 -top-1 h-4 rounded-[100%] bg-[#0d5f84] opacity-30" />
            </div>

            {/* Newsletter subscription */}
            <div className="rounded-2xl border border-[#ddd2c4] bg-white p-4 shadow-sm sm:p-6 md:p-8">
              <p className="mb-6 text-center text-lg text-[#1e3a5f]">
                {content.newsletterPrompt ?? "اكتب بريدك الاكتروني ليصلك كل جديد"}
              </p>
              <form onSubmit={handleNewsletterSubmit}>
                <div className="mb-4">
                  <label htmlFor="newsletter-email" className="mb-2 block text-right text-sm font-medium text-[#1e3a5f]">
                    البريد الاكتروني <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-right text-[#1e3a5f] outline-none transition focus:border-[#0d5f84] focus:ring-1 focus:ring-[#0d5f84]"
                    placeholder="البريد الاكتروني"
                    dir="rtl"
                  />
                </div>
                {subscribed ? (
                  <p className="mb-4 text-center text-[#0d5f84]">تم الاشتراك بنجاح.</p>
                ) : null}
                <button
                  type="submit"
                  className="rounded-lg bg-gray-200 px-6 py-3 font-medium text-[#1e3a5f] shadow-sm transition hover:bg-gray-300"
                >
                  اشترك
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
