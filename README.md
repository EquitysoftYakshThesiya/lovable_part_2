# 📝 Fix Log – Lead Form Email Issue

## 🧩 What's This About?

We recently tackled a glitch where the lead capture form wasn’t sending emails after submission. This was affecting how we tracked new contacts and got in touch with potential leads. Here's a full breakdown of what went wrong and how we patched it.

---

## 🧨 The Problem

- Submissions were going through, but no email notifications were firing.
- SMTP credentials weren’t correctly set up in the environment.
- The code used an outdated mailing function.
- There was no fallback or log to catch these failures, so errors went unnoticed.

---

## 🛠️ How We Fixed It

- Set up and verified SMTP settings using environment-based configuration.
- Swapped the legacy mail method with the latest `nodemailer` utility (`sendMail()`).
- Added field validation to the lead form to avoid sending garbage data.
- Introduced logging so we can catch and diagnose email failures moving forward.
- Ran a few tests to confirm everything's working fine now.

---

## 📂 Files You’ll See Changes In

- `leadForm.js` – Tightened up the form logic and added validations.
- `mailerService.js` – Refactored the function that handles email sending.
- `config/email.js` – Centralized SMTP setup.
- `.env` – Added actual mail service credentials.
- `logs/email-errors.log` – Captures email-related issues.

---

## 🧪 Quick Test Rundown

- ✅ Valid submission? Email delivered ✅
- ❌ Bad email format? Validation kicks in ❌
- 🔌 Mail server offline? Caught in logs + friendly message to user

---

## 📅 Rolled Out On

**7th August, 2025**

---

## 👤 Handled By

**Yaksh Thesiya**

---

## 🔍 Extra Notes

- We should probably set up alerts for repeated email errors.
- It might be worth exploring transactional email services for production (e.g., Mailgun or Postmark).
- Let’s monitor the logs weekly just to be safe.