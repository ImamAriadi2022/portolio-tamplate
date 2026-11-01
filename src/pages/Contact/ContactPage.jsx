import { useState } from "react";
import { getContact, getProfile } from "../../utils/dataHelpers.js";

const INITIAL_FORM = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const ContactPage = () => {
  const contact = getContact();
  const profile = getProfile();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  const validateForm = () => {
    const nextErrors = {};
    if (!formData.name.trim()) {
      nextErrors.name = "Nama lengkap wajib diisi.";
    } else if (formData.name.trim().length < 2) {
      nextErrors.name = "Nama lengkap minimal 2 karakter.";
    }

    const emailTrimmed = formData.email.trim();
    if (!emailTrimmed) {
      nextErrors.email = "Alamat email wajib diisi.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      nextErrors.email = "Format alamat email tidak valid.";
    }

    if (!formData.message.trim()) {
      nextErrors.message = "Pesan wajib diisi.";
    } else if (formData.message.trim().length < 10) {
      nextErrors.message = "Pesan minimal terdiri dari 10 karakter.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (submitStatus) {
      setSubmitStatus(null);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) {
      setSubmitStatus({
        type: "error",
        message: "Mohon periksa kembali kolom formulir yang belum sesuai.",
      });
      return;
    }

    setSubmitStatus({
      type: "success",
      message: `Terima kasih, ${formData.name.trim()}! Pesan Anda telah siap dikirim.`,
      submittedData: { ...formData },
    });
    setFormData(INITIAL_FORM);
  };

  return (
    <section className="pt-8 pb-16">
      <div className="mb-10">
        <h1 className="sm:text-4xl/snug text-3xl/snug font-bold mb-3">
          Kontak
        </h1>
        <p className="text-base/loose opacity-60 max-w-2xl">
          Mari terhubung untuk diskusi proyek, kolaborasi pengembangan website, maupun peluang kerja sama.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 grid-cols-1 gap-8 items-start">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-800 border border-zinc-700/60 p-6 sm:p-8 rounded-2xl">
            <h2 className="text-xl font-bold mb-4">Informasi Kontak</h2>
            <p className="text-sm/relaxed opacity-60 mb-6">
              Anda dapat menghubungi saya secara langsung melalui email atau berbagai kanal media sosial berikut.
            </p>

            <div className="space-y-4">
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/80 border border-zinc-700/60 hover:border-violet-500/60 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-violet-700/20 text-violet-400 flex items-center justify-center shrink-0 group-hover:bg-violet-700 group-hover:text-white transition-colors">
                    <i className="ri-mail-send-line ri-xl"></i>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-zinc-400">Email</p>
                    <p className="font-semibold text-sm sm:text-base truncate">
                      {contact.email}
                    </p>
                  </div>
                </a>
              )}

              {profile.location && (
                <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/80 border border-zinc-700/60">
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 text-violet-400 flex items-center justify-center shrink-0">
                    <i className="ri-map-pin-line ri-xl"></i>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400">Lokasi</p>
                    <p className="font-semibold text-sm sm:text-base">
                      {profile.location}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {contact.socials && contact.socials.length > 0 && (
              <div className="mt-8 pt-6 border-t border-zinc-700/60">
                <h3 className="text-base font-bold mb-4">Media Sosial</h3>
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-3">
                  {contact.socials.map((social) => (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-700/60 hover:border-violet-500/60 hover:bg-zinc-900 transition-all group"
                    >
                      <i
                        className={`${social.iconClass} ri-xl text-violet-400 group-hover:text-violet-300`}
                      ></i>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {social.platform}
                        </p>
                        {social.username && (
                          <p className="text-xs text-zinc-400 truncate">
                            {social.username}
                          </p>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="bg-zinc-800 border border-zinc-700/60 p-6 sm:p-10 rounded-2xl"
          >
            <h2 className="text-2xl font-bold mb-2">Kirim Pesan</h2>
            <p className="text-sm opacity-60 mb-6">
              Silakan isi formulir di bawah ini untuk mengirimkan pesan atau pertanyaan.
            </p>

            {submitStatus && (
              <div
                role="alert"
                className={`p-4 rounded-xl mb-6 border text-sm flex items-start gap-3 ${
                  submitStatus.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                }`}
              >
                <i
                  className={`${
                    submitStatus.type === "success"
                      ? "ri-checkbox-circle-line"
                      : "ri-error-warning-line"
                  } ri-lg mt-0.5 shrink-0`}
                ></i>
                <div className="flex-1">
                  <p className="font-medium">{submitStatus.message}</p>
                  {submitStatus.type === "success" && contact.email && (
                    <a
                      href={`mailto:${contact.email}?subject=${encodeURIComponent(
                        submitStatus.submittedData?.subject ||
                          `Pesan Portofolio dari ${submitStatus.submittedData?.name || ""}`
                      )}&body=${encodeURIComponent(
                        `Nama: ${submitStatus.submittedData?.name}\nEmail: ${submitStatus.submittedData?.email}\n\n${submitStatus.submittedData?.message}`
                      )}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold underline mt-2 hover:text-white"
                    >
                      <span>Buka di Aplikasi Email ({contact.email})</span>
                      <i className="ri-external-link-line"></i>
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-sm font-semibold mb-2"
                >
                  Nama Lengkap
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap Anda..."
                  className={`w-full bg-zinc-900 border ${
                    errors.name ? "border-rose-500" : "border-zinc-700"
                  } focus:border-violet-500 outline-none p-3.5 rounded-xl text-sm transition-colors`}
                />
                {errors.name && (
                  <p className="text-xs text-rose-400 mt-1.5">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-sm font-semibold mb-2"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nama@email.com"
                  className={`w-full bg-zinc-900 border ${
                    errors.email ? "border-rose-500" : "border-zinc-700"
                  } focus:border-violet-500 outline-none p-3.5 rounded-xl text-sm transition-colors`}
                />
                {errors.email && (
                  <p className="text-xs text-rose-400 mt-1.5">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="block text-sm font-semibold mb-2"
                >
                  Subjek <span className="text-zinc-500 font-normal">(Opsional)</span>
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Topik diskusi atau kerja sama..."
                  className="w-full bg-zinc-900 border border-zinc-700 focus:border-violet-500 outline-none p-3.5 rounded-xl text-sm transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-sm font-semibold mb-2"
                >
                  Pesan
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tuliskan pesan Anda di sini..."
                  className={`w-full bg-zinc-900 border ${
                    errors.message ? "border-rose-500" : "border-zinc-700"
                  } focus:border-violet-500 outline-none p-3.5 rounded-xl text-sm transition-colors resize-y`}
                ></textarea>
                {errors.message && (
                  <p className="text-xs text-rose-400 mt-1.5">
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-violet-700 hover:bg-violet-600 p-4 rounded-xl font-semibold transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Kirim Pesan</span>
                <i className="ri-send-plane-fill ri-lg"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
