"use client";

import { useState, useRef } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const errorRef = useRef<HTMLDivElement>(null);

  function showError(message: string) {
    setError(message);

    setTimeout(() => {
      errorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 50);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const fullName = String(formData.get("full_name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const targetRole = String(formData.get("target_role") || "").trim();
    const experience = String(formData.get("experience") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const consent = formData.get("consent") === "on";

    if (!fullName || !email || !phone || !targetRole || !experience) {
      showError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (!/^[A-Za-z ]+$/.test(fullName)) {
      showError("Please enter a valid name using letters only.");
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    const cleanPhone = phone.replace(/[\s-]/g, "");

    if (!/^(\+91)?[0-9]{10}$/.test(cleanPhone)) {
      showError("Please enter a valid 10-digit phone number.");
      setLoading(false);
      return;
    }

    if (targetRole.length < 2) {
      showError("Please enter a valid job role.");
      setLoading(false);
      return;
    }

    if (!consent) {
      showError("Please agree to be contacted.");
      setLoading(false);
      return;
    }

    try {
      const { error: supabaseError } = await supabase
        .from("leads")
        .insert({
          full_name: fullName,
          email: email,
          phone: phone,
          target_role: targetRole,
          experience: experience,
          message: message || null,
          consent: consent,
        });

      if (supabaseError) {
        console.error("Supabase error:", supabaseError);
        showError(`Database error: ${supabaseError.message}`);
        setLoading(false);
        return;
      }

      setSuccess(
        "Thank you! Your enquiry has been submitted successfully."
      );

      form.reset();
    } catch (err) {
      console.error("Unexpected error:", err);
      showError("Something went wrong. Please try again.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">

      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <h1 className="text-2xl font-bold">
            HireMe
          </h1>

          <nav className="hidden gap-6 md:flex">
            <a href="#benefits" className="text-gray-600 hover:text-black">
              Benefits
            </a>

            <a
              href="#how-it-works"
              className="text-gray-600 hover:text-black"
            >
              How It Works
            </a>

            <a href="#contact" className="text-gray-600 hover:text-black">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <p className="mb-4 font-semibold text-blue-600">
            JOB SEEKER SUPPORT
          </p>

          <h2 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
            Get the support you need to land your next job
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Get personalized guidance for your job search, resume,
            interviews, and career growth.
          </p>

          <a
            href="#contact"
            className="mt-8 inline-block rounded-lg bg-blue-600 px-8 py-4 font-semibold text-white hover:bg-blue-700"
          >
            Get Started
          </a>
        </div>
      </section>

      <section id="benefits" className="py-20">
        <div className="mx-auto max-w-6xl px-6">

          <div className="text-center">
            <h2 className="text-3xl font-bold">
              How we can help
            </h2>

            <p className="mt-3 text-gray-600">
              Practical support to help you move forward in your career.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            <div className="rounded-xl bg-white p-8 shadow-sm">
              <h3 className="text-xl font-bold">
                Resume Support
              </h3>

              <p className="mt-3 text-gray-600">
                Improve your resume and present your skills more effectively.
              </p>
            </div>

            <div className="rounded-xl bg-white p-8 shadow-sm">
              <h3 className="text-xl font-bold">
                Interview Preparation
              </h3>

              <p className="mt-3 text-gray-600">
                Prepare for interviews with practical guidance and feedback.
              </p>
            </div>

            <div className="rounded-xl bg-white p-8 shadow-sm">
              <h3 className="text-xl font-bold">
                Career Guidance
              </h3>

              <p className="mt-3 text-gray-600">
                Get guidance based on your experience and target career.
              </p>
            </div>

          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">

          <h2 className="text-3xl font-bold">
            How it works
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">

            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                1
              </div>

              <h3 className="mt-4 text-xl font-bold">
                Submit your enquiry
              </h3>

              <p className="mt-2 text-gray-600">
                Tell us about your career goals and what support you need.
              </p>
            </div>

            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                2
              </div>

              <h3 className="mt-4 text-xl font-bold">
                We contact you
              </h3>

              <p className="mt-2 text-gray-600">
                Our team reviews your enquiry and gets in touch with you.
              </p>
            </div>

            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                3
              </div>

              <h3 className="mt-4 text-xl font-bold">
                Get personalized guidance
              </h3>

              <p className="mt-2 text-gray-600">
                Get the support you need for your next career step.
              </p>
            </div>

          </div>
        </div>
      </section>

      <section id="contact" className="py-20">
        <div className="mx-auto max-w-2xl px-6">

          <div className="rounded-2xl bg-white p-8 shadow-lg md:p-10">

            <div className="text-center">
              <h2 className="text-3xl font-bold">
                Let's talk about your career
              </h2>

              <p className="mt-3 text-gray-600">
                Fill in your details and we'll get in touch with you.
              </p>
            </div>

            {success && (
              <div className="mt-6 rounded-lg bg-green-50 p-4 text-green-700">
                {success}
              </div>
            )}

            {error && (
              <div
                ref={errorRef}
                className="mt-6 rounded-lg bg-red-50 p-4 text-red-700"
              >
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >

              <div>
                <label className="mb-2 block font-medium">
                  Full Name *
                </label>

                <input
                  name="full_name"
                  type="text"
                  placeholder="Enter your full name"
                  required
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  Email *
                </label>

                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  Phone Number *
                </label>

                <input
                  name="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  required
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  Target Job Role *
                </label>

                <input
                  name="target_role"
                  type="text"
                  placeholder="Example: Software Developer"
                  required
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  Years of Experience *
                </label>

                <select
                  name="experience"
                  required
                  defaultValue=""
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                >
                  <option value="" disabled>
                    Select experience
                  </option>

                  <option>Fresher</option>
                  <option>0–1 years</option>
                  <option>1–3 years</option>
                  <option>3–5 years</option>
                  <option>5+ years</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  How can we help?
                </label>

                <textarea
                  name="message"
                  placeholder="Tell us what kind of support you need..."
                  rows={4}
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                />
              </div>

              <label className="flex items-start gap-3 text-sm text-gray-600">
                <input
                  name="consent"
                  type="checkbox"
                  required
                  className="mt-1"
                />

                <span>
                  I agree to be contacted regarding my enquiry.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 px-6 py-4 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit Enquiry"}
              </button>

            </form>
          </div>
        </div>
      </section>

      <footer className="border-t bg-white py-8 text-center text-sm text-gray-500">
        © 2026 HireMe. All rights reserved.
      </footer>

    </main>
  );
}