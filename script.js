document.addEventListener("DOMContentLoaded", () => {
    const likeButtons = document.querySelectorAll(".like-btn");

    likeButtons.forEach((btn, index) => {
        const postId = `post-like-${index}`;

        let data = JSON.parse(localStorage.getItem(postId)) || {
            liked: false,
            count: 0
        };

        const counter = document.createElement("span");
        counter.className = "like-count";
        counter.style.marginLeft = "6px";
        counter.textContent = data.count;

        btn.appendChild(counter);

        if (data.liked) {
            btn.classList.add("active");
        }

        btn.addEventListener("click", () => {
            data.liked = !data.liked;
            data.count += data.liked ? 1 : -1;
            if (data.count < 0) data.count = 0;

            btn.classList.toggle("active");
            counter.textContent = data.count;

            localStorage.setItem(postId, JSON.stringify(data));
        });
    });
});

document.querySelectorAll(".feed").forEach((feed, index) => {
    const input = feed.querySelector(".comment-box input");
    const btn = feed.querySelector(".comment-box button");
    const list = feed.querySelector(".comments-list");

    const postId = `post-comments-${index}`;
    let comments = JSON.parse(localStorage.getItem(postId)) || [];

    const counter = document.createElement("small");
    counter.className = "comment-counter";
    feed.querySelector(".comments").appendChild(counter);

    function render() {
        list.innerHTML = "";
        comments.forEach(c => {
            const div = document.createElement("div");
            div.className = "comment";
            div.textContent = c;
            list.appendChild(div);
        });
        counter.textContent = `💬 ${comments.length} comments`;
        localStorage.setItem(postId, JSON.stringify(comments));
    }

    render();

    btn.addEventListener("click", () => {
        if (input.value.trim() === "") return;
        comments.push(input.value);
        input.value = "";
        render();
    });
});


const messagesBtn = document.querySelector(".menu-item i.fa-message");
const chatPage = document.getElementById("chatPage");
const backBtn = document.querySelector(".back-chat");

if (messagesBtn) {
    messagesBtn.parentElement.addEventListener("click", () => {
        chatPage.classList.add("active");
    });
}

if (backBtn) {
    backBtn.addEventListener("click", () => {
        chatPage.classList.remove("active");
    });
}

// =============================
// Standalone Notification System
// =============================

const notifyBtn = document.getElementById("notify-btn");
const notifyBox = document.getElementById("notification-box");
const notifyCounter = document.querySelector(".notfy-counter");

const NOTIFY_KEY = "notifications";

// تحميل الإشعارات
let notifications = JSON.parse(localStorage.getItem(NOTIFY_KEY)) || [];

// تحديث العداد
function updateNotifyCounter() {
    const unread = notifications.filter(n => !n.read).length;
    notifyCounter.textContent = unread;
    notifyCounter.style.display = unread ? "inline-block" : "none";
}

// رسم الإشعارات
function renderNotifications() {
    notifyBox.innerHTML = "";

    if (notifications.length === 0) {
        notifyBox.innerHTML = `<p class="text-muted">No notifications yet</p>`;
        return;
    }

    notifications.slice().reverse().forEach(n => {
        const div = document.createElement("div");
        div.className = "notification";

        div.innerHTML = `
      <div class="notification-body">
        <b>${n.type === "like" ? "❤️ Like" : "💬 Comment"}</b>
        <span>${n.text}</span>
        <small class="text-gry">${timeAgo(n.time)}</small>
      </div>
    `;

        notifyBox.appendChild(div);
    });
}

// إضافة إشعار (تناديها من أي مكان)
function addNotification(type, text) {
    notifications.push({
        id: Date.now(),
        type,
        text,
        time: Date.now(),
        read: false
    });

    localStorage.setItem(NOTIFY_KEY, JSON.stringify(notifications));
    updateNotifyCounter();
}

// فتح الإشعارات
notifyBtn.addEventListener("click", () => {
    notifyBox.classList.toggle("active");

    // تعليم الكل كمقروء
    notifications.forEach(n => n.read = true);
    localStorage.setItem(NOTIFY_KEY, JSON.stringify(notifications));
    updateNotifyCounter();
    renderNotifications();
});

// وقت ذكي
function timeAgo(ts) {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    return `${Math.floor(diff / 86400)} days ago`;
}

// أول تحميل
updateNotifyCounter();
renderNotifications();


document.addEventListener("DOMContentLoaded", () => {
    const COMMENT_KEY = "comments";
    let allComments = JSON.parse(localStorage.getItem(COMMENT_KEY)) || {};

    const feeds = document.querySelectorAll(".feed");

    feeds.forEach(feed => {
        const postId = feed.dataset.id;
        const input = feed.querySelector(".comment-box input");
        const btn = feed.querySelector(".comment-box button");
        const list = feed.querySelector(".comments-list");
        const countSpan = feed.querySelector(".comment-count");

        // تحميل التعليقات من LocalStorage
        if (allComments[postId]) {
            allComments[postId].forEach(c => {
                const div = document.createElement("div");
                div.className = "comment";
                div.textContent = c;
                list.appendChild(div);
            });
            countSpan.textContent = allComments[postId].length;
        }

        // إضافة تعليق
        btn.addEventListener("click", () => {
            const text = input.value.trim();
            if (!text) return;

            if (!allComments[postId]) allComments[postId] = [];
            allComments[postId].push(text);
            localStorage.setItem(COMMENT_KEY, JSON.stringify(allComments));

            // عرض التعليق فورًا
            const div = document.createElement("div");
            div.className = "comment";
            div.textContent = text;
            list.appendChild(div);

            // تحديث العداد
            countSpan.textContent = allComments[postId].length;

            input.value = "";
        });
    });
});


// 
// ===============================
// THEME TOGGLE (LIGHT / DARK)
// ===============================
const themeBtn = document.getElementById("theme-btn");
const body = document.body;

// استرجاع الثيم المحفوظ إن وجد
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    body.classList.add("dark");
    if (themeBtn) {
        themeBtn.innerHTML = '<i class="fa fa-sun"></i>';
    }
}

if (themeBtn) {
    themeBtn.addEventListener("click", () => {
        const isDark = body.classList.toggle("dark");

        // تبديل الأيقونة
        themeBtn.innerHTML = isDark
            ? '<i class="fa fa-sun"></i>'
            : '<i class="fa fa-moon"></i>';

        // حفظ الاختيار
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });
}
