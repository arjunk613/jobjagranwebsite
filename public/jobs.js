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
        "Defence & Police Jobs", "Railway Jobs", "Public Sector (PSU) Jobs", "SSC & UPSC Jobs","Media & Communication Jobs"
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
                    <h3 class="text-lg font-semibold text-gray-900 truncate">${job.title}</h3>
                    <p class="text-sm text-red-600 font-semibold">${job.category}</p>
                    <p class="text-xs text-gray-500">${new Date(job.postedTime).toLocaleString()}</p>
                </a>
            `;

            jobList.appendChild(jobCard);
        });

        updateArrows();
    }

    // 🔹 Render Job Category Tabs (Below Latest Updates)
  // 🔹 Render Job Category Tabs with Icons
// 🔹 Render Job Category Tabs with Icons
function renderTabs() {
    if (!jobTabsContainer) return;
    jobTabsContainer.innerHTML = ""; // Clear existing tabs

    // Define pastel colors for each category
    const categoryColors = {
        "Government Jobs": "bg-blue-100 text-blue-800 hover:bg-blue-300",
        "IT & Software Jobs": "bg-purple-100 text-purple-800 hover:bg-purple-300",
        "Banking & Finance Jobs": "bg-green-100 text-green-800 hover:bg-green-300",
        "Engineering Jobs": "bg-yellow-100 text-yellow-800 hover:bg-yellow-300",
        "Healthcare & Medical Jobs": "bg-red-100 text-red-800 hover:bg-red-300",
        "Teaching & Education Jobs": "bg-orange-100 text-orange-800 hover:bg-orange-300",
        "Defence & Police Jobs": "bg-gray-100 text-gray-800 hover:bg-gray-300",
        "Railway Jobs": "bg-teal-100 text-teal-800 hover:bg-teal-300",
        "Public Sector (PSU) Jobs": "bg-indigo-100 text-indigo-800 hover:bg-indigo-300",
        "SSC & UPSC Jobs": "bg-pink-100 text-pink-800 hover:bg-pink-300",
        "Media & Communication Jobs": "bg-cyan-100 text-cyan-800 hover:bg-cyan-300"
    };

    const icons = {
        "Government Jobs": "fa-solid fa-landmark",
        "IT & Software Jobs": "fa-solid fa-laptop-code",
        "Banking & Finance Jobs": "fa-solid fa-piggy-bank",
        "Engineering Jobs": "fa-solid fa-gears",
        "Healthcare & Medical Jobs": "fa-solid fa-user-md",
        "Teaching & Education Jobs": "fa-solid fa-chalkboard-teacher",
        "Defence & Police Jobs": "fa-solid fa-shield-halved",
        "Railway Jobs": "fa-solid fa-train",
        "Public Sector (PSU) Jobs": "fa-solid fa-building",
        "SSC & UPSC Jobs": "fa-solid fa-file-alt",
        "Media & Communication Jobs": "fa-solid fa-bullhorn"
    };

    categories.forEach(category => {
        const tab = document.createElement("button");
        tab.className = `flex items-center gap-2 justify-center px-5 py-3 rounded-lg shadow-md transition transform hover:scale-105 cursor-pointer 
                         ${categoryColors[category]} ${activeTab === category ? "border-2 border-gray-600" : ""}`;

        tab.innerHTML = `<i class="${icons[category]} text-lg"></i> <span>${category}</span>`;

        tab.onclick = () => {
            activeTab = category;
            updateFilteredJobs();
        };

        jobTabsContainer.appendChild(tab);
    });
}

    // 🔹 Filter Jobs by Selected Category and Render Table
    // 🔹 Filter Jobs by Selected Category and Render Table
    // 🔹 Filter Jobs by Selected Category and Render Table
    function updateFilteredJobs() {
        jobTableBody.innerHTML = ""; // Clear previous job list
    
        const filteredJobs = jobs.filter(job => job.subcategory === activeTab);
    
        if (filteredJobs.length === 0) {
            jobTableBody.innerHTML = `<tr><td colspan="5" class="text-center text-gray-500 p-4">No jobs available in this department</td></tr>`;
            return;
        }
    
        filteredJobs.forEach((job, index) => {
            const row = document.createElement("tr");
            row.className = `group hover:bg-blue-50 transition duration-300 ease-in-out hover:shadow-md transform hover:scale-[1.02] 
                            ${index % 2 === 0 ? "bg-white" : "bg-gray-100"} border-b`;
    
            row.innerHTML = `
            <td class="p-4 text-blue-600 font-semibold underline text-left cursor-pointer w-1/3 truncate max-w-[250px]" onclick="navigateToJob(${job.id})" title="${job.title}">
            ${job.title}
        </td>
                <td class="p-4 text-gray-700 text-left whitespace-nowrap">${job.domain}</td>
                <td class="p-4 text-gray-700 text-center whitespace-nowrap">${job.lastDateToApply}</td>
                <td class="p-4 text-center">
                    ${job.tags ? job.tags.map(tag => `<span class="inline-block bg-blue-200 text-blue-700 text-xs px-3 py-1 rounded-full mr-1">${tag}</span>`).join("") : "N/A"}
                </td>
                <td class="p-4 text-center">
                    <a href="/job-details.html?id=${job.id}" 
                       class="inline-block bg-gradient-to-r from-green-500 to-green-700 text-white px-5 py-2 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-110 hover:from-green-600 hover:to-green-800">
                       Apply Now
                    </a>
                </td>
            `;
    
            jobTableBody.appendChild(row);
        });
    
        renderTabs(); // Re-render tabs to update the active state
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