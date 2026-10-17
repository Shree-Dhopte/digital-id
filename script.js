
const userName = "Uravi Holidays";

// Generate initials automatically
const nameParts = userName.trim().split(/\s+/).filter(Boolean);

const initials = nameParts.length > 1
    ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
    : (nameParts[0] || "U").slice(0, 2).toUpperCase();

// Update profile details
const brandInitials = document.getElementById("brandInitials");
const profileInitials = document.getElementById("profileInitials");
const profileName = document.getElementById("profileName");

if (brandInitials) brandInitials.textContent = initials;
if (profileInitials) profileInitials.textContent = initials;
if (profileName) profileName.textContent = userName;


// Generate QR Code
function generateQR() {
    const profileURL = window.location.href;

    const qrImage = document.getElementById("qrImage");
    const qrDisplay = document.getElementById("qrDisplay");

    if (!qrImage || !qrDisplay) {
        console.error("QR code elements not found in HTML.");
        return;
    }

    qrImage.src =
        "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" +
        encodeURIComponent(profileURL);

    qrDisplay.hidden = false;
}


// Share Profile
async function shareProfile() {
    const profile = {
        title: "Uravi Holidays - Digital ID",
        text: "Check out Uravi Holidays! Explore our holiday packages.",
        url: window.location.href
    };

    try {
        if (navigator.share) {
            await navigator.share(profile);
        } else if (navigator.clipboard) {
            await navigator.clipboard.writeText(profile.url);
            alert("Profile link copied!");
        } else {
            window.prompt("Copy your profile link:", profile.url);
        }
    } catch (error) {
        if (error.name !== "AbortError") {
            alert("Unable to share. Please copy your profile link.");
        }
    }
}


// Open Uravi Holidays Location
function getLocation() {
    const mapURL = "https://maps.app.goo.gl/xikMJF9QvYEE35hi8";

    // Open Google Maps directly
    window.open(mapURL, "_blank");
}


// WhatsApp Contact Details
const whatsappNumber = "98329056457";

const whatsappMessage =
    "Hello! 👋 I'm interested in your travel packages. Please share the available holiday packages and pricing. ✈️🌍";


// Create WhatsApp Link Automatically
const whatsappLink = document.getElementById("whatsappLink");

if (whatsappLink) {
    whatsappLink.href =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
}


// ================= FEEDBACK SYSTEM =================
(() => {
    const form = document.getElementById("feedbackForm");
    if (!form) return;

    const stars = [...document.querySelectorAll(".star")];
    const ratingHint = document.getElementById("ratingHint");
    const reviewText = document.getElementById("reviewText");
    const reviewerName = document.getElementById("reviewerName");
    const status = document.getElementById("feedbackStatus");
    const reviewList = document.getElementById("reviewList");
    const storageKey = "uraviHolidaysReviews";
    let selectedRating = 0;
    let reviewWasEdited = false;

    const ratingWords = {
        1: "poor",
        2: "fair",
        3: "good",
        4: "very good",
        5: "excellent"
    };

    function updateStars(rating) {
        selectedRating = rating;
        stars.forEach((star) => {
            const active = Number(star.dataset.rating) <= rating;
            star.classList.toggle("active", active);
            star.setAttribute("aria-pressed", String(Number(star.dataset.rating) === rating));
        });
        ratingHint.textContent = rating
            ? `${rating} out of 5 stars — ${ratingWords[rating]}`
            : "Tap a star to rate us";
        generateSentence();
    }

    function selectedValues(name) {
        return [...form.querySelectorAll(`input[name="${name}"]:checked`)].map(input => input.value);
    }

    function generateSentence() {
        if (reviewWasEdited) return;
        const positives = selectedValues("positive");
        const improvements = selectedValues("improvement");
        const parts = [];

        if (selectedRating) {
            parts.push(`My experience with Uravi Holidays was ${ratingWords[selectedRating]}`);
        } else if (positives.length) {
            parts.push("My experience with Uravi Holidays was enjoyable");
        }

        if (positives.length) {
            const list = positives.length === 1
                ? positives[0]
                : positives.slice(0, -1).join(", ") + " and " + positives[positives.length - 1];
            parts.push(`I especially appreciated the ${list}`);
        }

        let sentence = parts.length ? parts.join(". ") + "." : "";
        if (improvements.length) {
            sentence += (sentence ? " " : "") +
                `I would appreciate ${improvements.join(" and ")} in the future.`;
        }
        reviewText.value = sentence;
    }

    stars.forEach(star => star.addEventListener("click", () => {
        reviewWasEdited = false;
        updateStars(Number(star.dataset.rating));
    }));

    form.querySelectorAll('input[type="checkbox"]').forEach(input => {
        input.addEventListener("change", () => {
            reviewWasEdited = false;
            generateSentence();
        });
    });

    reviewText.addEventListener("input", () => { reviewWasEdited = true; });

    function getReviews() {
        try {
            const value = JSON.parse(localStorage.getItem(storageKey) || "[]");
            return Array.isArray(value) ? value : [];
        } catch {
            return [];
        }
    }

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, char => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
        })[char]);
    }

    function renderReviews() {
        const reviews = getReviews();
        if (!reviews.length) {
            reviewList.innerHTML = '<p class="empty-reviews">Your feedback will appear here after submission.</p>';
            return;
        }
        reviewList.innerHTML = reviews.slice(0, 5).map(review => {
            const safeName = escapeHTML(review.name || "Guest");
            const safeText = escapeHTML(review.text);
            const starsText = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
            const date = new Date(review.date);
            const dateText = Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString();
            return `<article class="review-card">
                <div class="review-card-top">
                    <span class="review-author">${safeName}</span>
                    <span class="review-stars" aria-label="${review.rating} out of 5 stars">${starsText}</span>
                </div>
                <p class="review-copy">${safeText}</p>
                <p class="review-date">${dateText}</p>
            </article>`;
        }).join("");
    }

    form.addEventListener("submit", event => {
        event.preventDefault();
        if (!selectedRating) {
            status.textContent = "Please select a star rating first.";
            status.style.color = "#b45309";
            return;
        }
        const text = reviewText.value.trim();
        if (!text) {
            status.textContent = "Please select a suggestion or write your review.";
            status.style.color = "#b45309";
            reviewText.focus();
            return;
        }

        const reviews = getReviews();
        reviews.unshift({
            name: reviewerName.value.trim() || "Guest",
            rating: selectedRating,
            text,
            date: new Date().toISOString()
        });

        try {
            localStorage.setItem(storageKey, JSON.stringify(reviews.slice(0, 30)));
            status.textContent = "Thank you! Your feedback has been saved on this device.";
            status.style.color = "#16734a";
            renderReviews();
            form.reset();
            reviewWasEdited = false;
            updateStars(0);
        } catch {
            status.textContent = "Could not save feedback in this browser. Please try again.";
            status.style.color = "#b45309";
        }
    });

    renderReviews();
})();
