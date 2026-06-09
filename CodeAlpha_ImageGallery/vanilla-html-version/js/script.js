// DOM Elements
const fullImgBox = document.getElementById("fullImgBox");
const fullImg = document.getElementById("fullImg");
const searchBar = document.getElementById("searchBar");
const filterBtns = document.querySelectorAll(".filter-btn");
const imgBoxes = document.querySelectorAll(".img-box");
const themeToggle = document.getElementById("themeToggle");

// Lightbox Array tracking
let currentVisibleImages = [];
let currentIndex = 0;

// Initialize LocalStorage for Favorites & Theme
let favorites = JSON.parse(localStorage.getItem("galleryFavorites")) || [];
if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    themeToggle.innerText = "☀️ Light Mode";
}

// Setup favorite hearts on load
document.querySelectorAll('.fav-btn').forEach(btn => {
    const imgSrc = btn.nextElementSibling.getAttribute('src');
    if (favorites.includes(imgSrc)) {
        btn.innerHTML = "❤️";
        btn.classList.add("favorited");
    }
});

// 1. Theme Toggle Logic
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "enabled");
        themeToggle.innerText = "☀️ Light Mode";
    } else {
        localStorage.setItem("darkMode", "disabled");
        themeToggle.innerText = "🌙 Dark Mode";
    }
});

// 2. Search & Category Filter Logic
function filterImages() {
    const searchText = searchBar.value.toLowerCase();
    const activeFilter = document.querySelector(".filter-btn.active").getAttribute("data-filter");

    imgBoxes.forEach(box => {
        const title = box.getAttribute("data-title").toLowerCase();
        const category = box.getAttribute("data-category");
        const imgSrc = box.querySelector("img").getAttribute("src");
        
        let matchesSearch = title.includes(searchText);
        let matchesCategory = (activeFilter === "all") || 
                              (activeFilter === category) || 
                              (activeFilter === "favorites" && favorites.includes(imgSrc));

        if (matchesSearch && matchesCategory) {
            box.classList.remove("hidden");
        } else {
            box.classList.add("hidden");
        }
    });
}

searchBar.addEventListener("input", filterImages);

filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // Remove active class from all, add to clicked
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        filterImages();
    });
});

// 3. Favorites Logic
function toggleFavorite(iconElement, imgSrc) {
    if (favorites.includes(imgSrc)) {
        favorites = favorites.filter(src => src !== imgSrc); // Remove
        iconElement.innerHTML = "🤍";
        iconElement.classList.remove("favorited");
    } else {
        favorites.push(imgSrc); // Add
        iconElement.innerHTML = "❤️";
        iconElement.classList.add("favorited");
    }
    localStorage.setItem("galleryFavorites", JSON.stringify(favorites));
    
    // Refresh grid if currently viewing "Favorites" tab
    if (document.querySelector(".filter-btn.active").getAttribute("data-filter") === "favorites") {
        filterImages();
    }
}

// 4. Lightbox & Navigation Logic
function openFullImg(imgElement) {
    // Get all images that are currently NOT hidden
    const visibleBoxes = Array.from(document.querySelectorAll(".img-box:not(.hidden) img"));
    currentVisibleImages = visibleBoxes.map(img => img.src);
    currentIndex = currentVisibleImages.indexOf(imgElement.src);

    fullImg.src = imgElement.src;
    fullImgBox.style.display = "flex";
    document.body.style.overflow = "hidden"; // Prevent background scrolling
}

function closeFullImg() {
    fullImgBox.style.display = "none";
    document.body.style.overflow = "auto";
}

function changeImg(step) {
    currentIndex += step;
    // Loop around if out of bounds
    if (currentIndex >= currentVisibleImages.length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = currentVisibleImages.length - 1;
    
    fullImg.src = currentVisibleImages[currentIndex];
}

// 5. Keyboard Navigation Logic
document.addEventListener("keydown", (e) => {
    if (fullImgBox.style.display === "flex") {
        if (e.key === "Escape") closeFullImg();
        if (e.key === "ArrowRight") changeImg(1);
        if (e.key === "ArrowLeft") changeImg(-1);
    }
});