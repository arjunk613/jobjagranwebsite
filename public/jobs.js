document.addEventListener("DOMContentLoaded", async function () {
    const jobList = document.getElementById("job-list");
    const jobListContainer = document.getElementById("job-list-container");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");

    const jobTabsContainer = document.getElementById("jobTabs"); // Category Tabs Container
    const jobTableBody = document.getElementById("jobTableBody"); // Table Body for Jobs

    let jobs = [];
    let activeTab = "Government Jobs"; // Default selected category
    let autoScroll;
    const scrollAmount = 300; // How much to scroll per step
    const autoScrollInterval = 3000; // Time in ms before auto-scrolling

    const categories = [
        "Government Jobs", "IT & Software Jobs", "Banking & Finance Jobs",
        "Engineering Jobs", "Healthcare & Medical Jobs", "Teaching & Education Jobs",
        "Defence & Police Jobs", "Railway Jobs", "Public Sector (PSU) Jobs", "SSC & UPSC Jobs"
    ];

    // Fetch JSON data
    async function fetchJobs() {
        try {
            const response = await fetch("/data/jobs.json");
            if (!response.ok) throw new Error("Failed to load jobs.json");

            jobs = await response.json();
            jobs.sort((a, b) => new Date(b.time) - new Date(a.time));

            renderJobs();  // Show Latest Updates
            renderTabs();  // Render Category Tabs
            updateFilteredJobs(); // Show jobs for the default category
        } catch (error) {
            console.error("❌ Error loading jobs:", error);
        }
    }

    // 🔹 Render Scrolling Job Cards (Latest Updates)
    function renderJobs() {
        if (!jobList) return;
        jobList.innerHTML = "";

        jobs.forEach(job => {
            const jobCard = document.createElement("div");
            jobCard.className = "bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition inline-block w-64";

            jobCard.innerHTML = `
                <a href="/job-details.html?id=${job.id}">
                    <img src="${job.image || '/default-image.jpg'}" alt="${job.title}" class="rounded-lg w-full h-40 object-cover">
                    <h3 class="text-lg font-bold mt-3">${job.title}</h3>
                    <p class="text-sm text-red-600 font-semibold">${job.category}</p>
                    <p class="text-xs text-gray-500">${new Date(job.time).toLocaleString()}</p>
                </a>
            `;

            jobList.appendChild(jobCard);
        });

        updateArrows();
    }

    // 🔹 Render Job Category Tabs (Below Latest Updates)
    function renderTabs() {
        if (!jobTabsContainer) return;
        jobTabsContainer.innerHTML = ""; // Clear existing tabs

        categories.forEach(category => {
            const tab = document.createElement("button");
            tab.className = `px-5 py-3 rounded-full bg-white text-gray-700 border border-gray-300 shadow-md hover:bg-blue-400 hover:text-white transition duration-300 ease-in-out transform hover:scale-105 ${
                activeTab === category ? "bg-blue-500 text-white" : ""
            }`;
            tab.innerText = category;

            tab.onclick = () => {
                activeTab = category;
                updateFilteredJobs();
            };

            jobTabsContainer.appendChild(tab);
        });
    }

    // 🔹 Filter Jobs by Selected Category and Render Table
    function updateFilteredJobs() {
        jobTableBody.innerHTML = ""; // Clear previous job list

        const filteredJobs = jobs.filter(job => job.subcategory === activeTab);
        
        if (filteredJobs.length === 0) {
            jobTableBody.innerHTML = `<tr><td colspan="5" class="text-center text-gray-500 p-4">No jobs available in this category</td></tr>`;
            return;
        }

        filteredJobs.forEach(job => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="border p-2 text-blue-500 underline cursor-pointer" onclick="navigateToJob(${job.id})">${job.title}</td>
                <td class="border p-2">${job.category}</td>
                <td class="border p-2">${job.subcategory}</td>
                <td class="border p-2">${job.description}</td>
                <td class="border p-2">${job.eligibility}</td>
            `;
            jobTableBody.appendChild(row);
        });

        // Re-render tabs to update the active state
        renderTabs();
    }

    // 🔹 Navigate to Job Details Page
    window.navigateToJob = function (jobId) {
        window.location.href = `/job-details.html?id=${jobId}`;
    };

    // 🔹 Scroll Left
    prevBtn?.addEventListener("click", () => {
        jobListContainer?.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });

    // 🔹 Scroll Right
    nextBtn?.addEventListener("click", () => {
        jobListContainer?.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });

    // 🔹 Show/Hide Arrows Based on Scroll Position
    function updateArrows() {
        setTimeout(() => {
            prevBtn?.classList.toggle("hidden", jobListContainer.scrollLeft <= 0);
            nextBtn?.classList.toggle("hidden", jobListContainer.scrollLeft + jobListContainer.clientWidth >= jobListContainer.scrollWidth);
        }, 300);
    }

    // 🔹 Autoplay Scrolling
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

    // 🔹 Stop Autoplay
    function stopAutoScroll() {
        clearInterval(autoScroll);
    }

    // 🔹 Pause on Hover
    jobListContainer?.addEventListener("mouseenter", stopAutoScroll);
    jobListContainer?.addEventListener("mouseleave", startAutoScroll);

    // 🔹 Listen for Scroll Events to Update Arrows
    jobListContainer?.addEventListener("scroll", updateArrows);

    // 🔹 Initialize
    fetchJobs();
});