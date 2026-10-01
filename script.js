"use strict";
const $ = (s) => document.querySelector(s);

// 1. Menu hamburger (mobile)
const nav = $("#nav"), menuBtn = $("#menuBtn");
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});

// 2. Smooth scroll: bấm link menu thì cuộn mượt và đóng menu
document.querySelectorAll('a[href^="#"]').forEach((a) =>
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  })
);

// 3. Dark / light mode (nhớ lựa chọn bằng localStorage)
const root = document.documentElement, themeBtn = $("#themeBtn");
function setTheme(t) {
  root.setAttribute("data-theme", t);
  themeBtn.textContent = t === "dark" ? "☀️" : "🌙";
  try { localStorage.setItem("theme", t); } catch (e) {}
}
let saved = null;
try { saved = localStorage.getItem("theme"); } catch (e) {}
setTheme(saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
themeBtn.addEventListener("click", () =>
  setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark")
);

// 4. Lọc theo tag + tìm kiếm theo từ khóa
const cards = [...document.querySelectorAll(".card")];
let activeTag = "all";
function filterProjects() {
  const kw = $("#search").value.trim().toLowerCase();
  let shown = 0;
  cards.forEach((c) => {
    const okTag = activeTag === "all" || c.dataset.tag.split(" ").includes(activeTag);
    const okKw = c.textContent.toLowerCase().includes(kw);
    c.hidden = !(okTag && okKw);
    if (!c.hidden) shown++;
  });
  $("#empty").hidden = shown > 0;
}
$("#search").addEventListener("input", filterProjects);
$("#tags").addEventListener("click", (e) => {
  const btn = e.target.closest(".tag");
  if (!btn) return;
  document.querySelectorAll(".tag").forEach((t) => t.classList.remove("active"));
  btn.classList.add("active");
  activeTag = btn.dataset.tag;
  filterProjects();
});

// 5. Validate form (nhiều điều kiện) + đếm ký tự
const msg = $("#msg");
msg.addEventListener("input", () => ($("#count").textContent = msg.value.length));

function setErr(input, errId, text) {
  $(errId).textContent = text;
  input.classList.toggle("invalid", !!text);
  return !text;
}
function checkName() {
  const v = $("#name").value.trim();
  let e = "";
  if (!v) e = "Vui lòng nhập họ tên.";
  else if (v.length < 2) e = "Họ tên phải có ít nhất 2 ký tự.";
  else if (/\d/.test(v)) e = "Họ tên không được chứa chữ số.";
  return setErr($("#name"), "#nameErr", e);
}
function checkEmail() {
  const v = $("#email").value.trim();
  let e = "";
  if (!v) e = "Vui lòng nhập email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) e = "Email không đúng định dạng (ví dụ: ten@gmail.com).";
  return setErr($("#email"), "#emailErr", e);
}
function checkMsg() {
  const n = msg.value.trim().length;
  let e = "";
  if (!n) e = "Vui lòng nhập lời nhắn.";
  else if (n < 10) e = "Lời nhắn phải có ít nhất 10 ký tự.";
  return setErr(msg, "#msgErr", e);
}
$("#name").addEventListener("blur", checkName);
$("#email").addEventListener("blur", checkEmail);
msg.addEventListener("blur", checkMsg);
$("#form").addEventListener("submit", (e) => {
  e.preventDefault();
  const ok = [checkName(), checkEmail(), checkMsg()].every(Boolean);
  $("#ok").hidden = !ok;
  if (ok) { e.target.reset(); $("#count").textContent = 0; }
});

// 6. Hiệu ứng xuất hiện khi cuộn (scroll reveal)
const io = new IntersectionObserver(
  (entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("show"); io.unobserve(en.target); }
  }),
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// 7. Năm hiện tại ở footer
$("#year").textContent = new Date().getFullYear();
