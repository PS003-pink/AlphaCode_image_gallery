document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const filterButtons = document.querySelectorAll('.filter-btn');
    const gallery = document.getElementById('gallery'); // The container for all images
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const closeBtn = document.querySelector('.close-btn');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const uploadInput = document.getElementById('uploadInput');

    let currentLightboxImageIndex = 0; // Tracks the currently viewed image index within the *visible* images

    /**
     * Retrieves all currently visible images in the gallery.
     * This is crucial for correct lightbox navigation after filtering.
     * @returns {NodeListOf<Element>} A NodeList of visible image elements.
     */
    const getVisibleImages = () => {
        // Query all images in the gallery and filter for those that are currently displayed
        return Array.from(gallery.querySelectorAll('img')).filter(img => img.style.display !== 'none');
    };

    /**
     * Updates the active filter button and filters images in the gallery.
     * @param {string} filterCategory - The data-filter value of the button clicked.
     */
    const filterImages = (filterCategory) => {
        // Remove 'active' class from current active button
        const currentActiveBtn = document.querySelector('.filter-btn.active');
        if (currentActiveBtn) {
            currentActiveBtn.classList.remove('active');
        }

        // Add 'active' class to the clicked button
        const clickedButton = document.querySelector(`.filter-btn[data-filter="${filterCategory}"]`);
        if (clickedButton) {
            clickedButton.classList.add('active');
        }

        // Show/hide images based on filter
        gallery.querySelectorAll('img').forEach(img => {
            const imageCategory = img.dataset.category;
            if (filterCategory === 'all' || imageCategory === filterCategory) {
                img.style.display = 'block'; // Show the image
            } else {
                img.style.display = 'none'; // Hide the image
            }
        });
    };

    /**
     * Opens the lightbox with the specified image.
     * @param {string} src - The source URL of the image to display.
     * @param {number} index - The index of the image within the *visible* images array.
     */
    const openLightbox = (src, index) => {
        lightboxImg.src = src;
        currentLightboxImageIndex = index; // Set current index for navigation
        lightbox.style.display = 'flex';
    };

    /**
     * Closes the lightbox.
     */
    const closeLightbox = () => {
        lightbox.style.display = 'none';
    };

    /**
     * Displays the next image in the lightbox, cycling through visible images.
     */
    const showNextImage = () => {
        const visibleImages = getVisibleImages();
        if (visibleImages.length === 0) return;

        currentLightboxImageIndex = (currentLightboxImageIndex + 1) % visibleImages.length;
        lightboxImg.src = visibleImages[currentLightboxImageIndex].src;
    };

    /**
     * Displays the previous image in the lightbox, cycling through visible images.
     */
    const showPrevImage = () => {
        const visibleImages = getVisibleImages();
        if (visibleImages.length === 0) return;

        currentLightboxImageIndex = (currentLightboxImageIndex - 1 + visibleImages.length) % visibleImages.length;
        lightboxImg.src = visibleImages[currentLightboxImageIndex].src;
    };

    // Event Listeners

    // Filter button clicks (delegation not strictly needed here as buttons are static)
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterImages(btn.dataset.filter);
        });
    });

    // Event delegation for gallery image clicks (handles dynamic images)
    gallery.addEventListener('click', (event) => {
        if (event.target.tagName === 'IMG') { // Check if the clicked element is an image
            const clickedImg = event.target;
            const visibleImages = getVisibleImages();
            const clickedImageIndexInVisible = Array.from(visibleImages).findIndex(img => img === clickedImg);

            if (clickedImageIndexInVisible !== -1) {
                openLightbox(clickedImg.src, clickedImageIndexInVisible);
            }
        }
    });

    // Lightbox navigation
    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNextImage);
    prevBtn.addEventListener('click', showPrevImage);

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (event) => {
        if (lightbox.style.display === 'flex') {
            if (event.key === 'ArrowRight') {
                showNextImage();
            } else if (event.key === 'ArrowLeft') {
                showPrevImage();
            } else if (event.key === 'Escape') {
                closeLightbox();
            }
        }
    });

    // Image upload functionality
    uploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) {
            console.warn('No file selected for upload.');
            return;
        }

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file (e.g., JPG, PNG, GIF).');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const newImg = document.createElement('img');
            newImg.src = e.target.result;
            newImg.alt = `User Uploaded Image: ${file.name}`; // More descriptive alt text
            newImg.dataset.category = "user"; // Assign 'user' category to uploaded images

            // Apply existing gallery image styling (from style.css)
            // It's generally better to let CSS handle styling, but ensure necessary
            // inline styles for initial display are set if not handled by CSS default.
            // In your CSS, .image-grid img already has properties, so these are mostly redundant if the CSS is linked.
            // Keeping them here as a fallback or for dynamic overrides if needed.
            newImg.style.width = "300px";
            newImg.style.height = "350px"; // Ensure consistent height
            newImg.style.objectFit = "cover";
            newImg.style.border = "1px solid var(--border-color)";
            newImg.style.borderRadius = "5px";
            newImg.style.padding = "5px";
            newImg.style.transition = "transform 0.3s ease, border-color 0.3s ease";
            newImg.style.cursor = "pointer";
            newImg.style.display = 'block'; // Ensure it's visible by default

            gallery.appendChild(newImg);

            // No need to re-attach individual listeners thanks to event delegation on 'gallery'
            // The `getVisibleImages()` function will automatically pick up this new image.

            // Clear the file input for next upload
            event.target.value = '';
        };
        reader.readAsDataURL(file);
    });

    // Initialize: ensure 'All' filter is active and apply it on load
    filterImages('all');
});

    document.addEventListener('DOMContentLoaded', function(event) {
      // array with texts to type
      var dataText = [ "Every Photo Tells a Story.", "Capture. Share. Inspire.", "A Global Gallery of Creative Minds."];

      function typeWriter(text, i, fnCallback) {
        if (i < text.length) {
          // update the span with the next character
          document.querySelector("#typewriter").innerHTML = text.substring(0, i + 1) + '<span aria-hidden="true"></span>';

          setTimeout(function() {
            typeWriter(text, i + 1, fnCallback);
          }, 100);
        } else if (typeof fnCallback == 'function') {
          setTimeout(fnCallback, 700);
        }
      }

      function StartTextAnimation(i) {
        if (i < dataText.length) {
          typeWriter(dataText[i], 0, function() {
            StartTextAnimation(i + 1);
          });
        } else {
          // Restart after some time
          setTimeout(function() {
            StartTextAnimation(0);
          }, 2000);
        }
      }

      StartTextAnimation(0);
    });