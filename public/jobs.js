document.addEventListener("DOMContentLoaded", async function () {
    const jobList = document.getElementById("job-list");
    const jobListContainer = document.getElementById("job-list-container");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");

    let jobs = [];
    let autoScroll;
    const scrollAmount = 300; // How much to scroll per step
    const autoScrollInterval = 3000; // Time in ms before auto-scrolling

    // Fetch JSON data
    async function fetchJobs() {
        const response = await fetch("src/data/jobs.json");
        jobs = await response.json();

        // Sort jobs by latest date & time
        jobs.sort((a, b) => new Date(b.time) - new Date(a.time));

        renderJobs();
    }

    // Render jobs
    function renderJobs() {
        jobList.innerHTML = "";

        jobs.forEach(job => {
            const jobCard = document.createElement("div");
            jobCard.className = "bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition inline-block w-64";

            jobCard.innerHTML = `
                <a href="job-details.html?id=${job.id}">
                    <img src="${job.image}" alt="${job.title}" class="rounded-lg w-full h-40 object-cover">
                    <h3 class="text-lg font-bold mt-3">${job.title}</h3>
                    <p class="text-sm text-red-600 font-semibold">${job.category}</p>
                    <p class="text-xs text-gray-500">${new Date(job.time).toLocaleString()}</p>
                </a>
            `;

            jobList.appendChild(jobCard);
        });

        updateArrows();
    }

    // Scroll Left
    prevBtn.addEventListener("click", () => {
        jobListContainer.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });

    // Scroll Right
    nextBtn.addEventListener("click", () => {
        jobListContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });

    // Show/Hide Arrows Based on Scroll Position
    function updateArrows() {
        setTimeout(() => {
            prevBtn.classList.toggle("hidden", jobListContainer.scrollLeft <= 0);
            nextBtn.classList.toggle("hidden", jobListContainer.scrollLeft + jobListContainer.clientWidth >= jobListContainer.scrollWidth);
        }, 300);
    }

    // Autoplay Scrolling
    function startAutoScroll() {
        stopAutoScroll(); // Ensure previous interval is cleared
        autoScroll = setInterval(() => {
            if (jobListContainer.scrollLeft + jobListContainer.clientWidth >= jobListContainer.scrollWidth) {
                jobListContainer.scrollTo({ left: 0, behavior: "smooth" }); // Loop back to the start
            } else {
                jobListContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
            }
        }, autoScrollInterval);
    }

    // Stop Autoplay
    function stopAutoScroll() {
        clearInterval(autoScroll);
    }

    // Pause on Hover
    jobListContainer.addEventListener("mouseenter", stopAutoScroll);
    jobListContainer.addEventListener("mouseleave", startAutoScroll);

    // Listen for Scroll Events to Update Arrows
    jobListContainer.addEventListener("scroll", updateArrows);

    // Initialize
    fetchJobs();
});