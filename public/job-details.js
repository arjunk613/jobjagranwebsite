document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get("id");

    if (!jobId) {
        document.body.innerHTML = "<h2 class='text-center text-red-600 mt-10'>Job Not Found</h2>";
        return;
    }

    const response = await fetch("/data/jobs.json");
    const jobs = await response.json();
    const job = jobs.find(j => j.id == jobId);

    if (!job) {
        document.body.innerHTML = "<h2 class='text-center text-red-600 mt-10'>Job Not Found</h2>";
        return;
    }

    // Populate Job Details Page
    document.getElementById("job-title").textContent = job.title;
    document.getElementById("job-category").textContent = job.category;
    const postedDate = new Date(job.postedTime);
    document.getElementById("job-time").textContent = !isNaN(postedDate)
        ? postedDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        : "Invalid Date";

    document.getElementById("last-date").textContent = `📅 Last Date: ${job.lastDateToApply}`;

    document.getElementById("job-image").src = job.image;
    document.getElementById("job-description").innerHTML = job.description;
    document.getElementById("job-eligibility").innerHTML = job.eligibility;
    document.getElementById("job-apply-link").href = job.apply_link;
    document.getElementById("last-date").innerHTML = `
    <div class="bg-red-100 text-red-700 font-bold px-4 py-2 rounded-lg shadow-md text-center text-lg animate-pulse flex items-center justify-center space-x-2">
        <i class="ph ph-warning text-2xl"></i>
        <span>🚨 Last Date to Apply: ${job.lastDateToApply}</span>
    </div>
`;

    // Load Related Jobs
    loadRelatedJobs(job.category, job.id, jobs);
});

// Function to Load Related Jobs with Auto-Scrolling & Navigation
function loadRelatedJobs(category, currentJobId, jobs) {
    const relatedJobsContainer = document.getElementById("related-jobs");
    const relatedJobsWrapper = document.getElementById("related-jobs-container");
    const prevBtn = document.getElementById("related-prev-btn");
    const nextBtn = document.getElementById("related-next-btn");

    relatedJobsContainer.innerHTML = "";

    // 🔥 Fetch all related jobs (not limiting to 5)
    const relatedJobs = jobs
        .filter(job => job.category === category && job.id != currentJobId);

    if (relatedJobs.length === 0) {
        relatedJobsContainer.innerHTML = "<p class='text-gray-600'>No related jobs found.</p>";
        return;
    }

    // Dynamically create related job cards
    relatedJobs.forEach(job => {
        const jobCard = document.createElement("div");
        jobCard.className = "bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition inline-block w-56 text-center";

        jobCard.innerHTML = `
            <a href="/job-details.html?id=${job.id}">
                <h3 class="text-lg font-bold mt-3">${job.title}</h3>
                <p class="text-sm text-red-600 font-semibold">${job.category}</p>
            </a>
        `;

        relatedJobsContainer.appendChild(jobCard);
    });

    // 🔥 Ensure scrolling & navigation works
    let autoScroll;
    const scrollAmount = 250; // Scroll per click
    const autoScrollInterval = 3000; // 3 seconds auto-scroll

    function startAutoScroll() {
        stopAutoScroll(); // Prevent duplicate intervals
        autoScroll = setInterval(() => {
            if (relatedJobsWrapper.scrollLeft + relatedJobsWrapper.clientWidth >= relatedJobsWrapper.scrollWidth) {
                relatedJobsWrapper.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                relatedJobsWrapper.scrollBy({ left: scrollAmount, behavior: "smooth" });
            }
        }, autoScrollInterval);
    }

    function stopAutoScroll() {
        clearInterval(autoScroll);
    }

    // Scroll Left
    prevBtn.addEventListener("click", () => {
        relatedJobsWrapper.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });

    // Scroll Right
    nextBtn.addEventListener("click", () => {
        relatedJobsWrapper.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });

    // Show/Hide Arrows Based on Scroll Position
    function updateArrows() {
        setTimeout(() => {
            prevBtn.classList.toggle("hidden", relatedJobsWrapper.scrollLeft <= 0);
            nextBtn.classList.toggle("hidden", relatedJobsWrapper.scrollLeft + relatedJobsWrapper.clientWidth >= relatedJobsWrapper.scrollWidth);
        }, 300);
    }

    // Listen for Scroll Events to Update Arrows
    relatedJobsWrapper.addEventListener("scroll", updateArrows);

    // Pause on Hover
    relatedJobsWrapper.addEventListener("mouseenter", stopAutoScroll);
    relatedJobsWrapper.addEventListener("mouseleave", startAutoScroll);

    // 🔥 Start Auto-scroll on Page Load
    startAutoScroll();

    // 🔥 Ensure arrows are updated correctly
    updateArrows();
}