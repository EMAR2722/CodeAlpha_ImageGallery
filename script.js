document.addEventListener('DOMContentLoaded', () => {
    // Select elements
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const categoryTitles = document.querySelectorAll('.category-title');
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCounter = document.getElementById('lightbox-counter');
    
    const closeBtn = document.querySelector('.close');
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');

    // State for filtering and lightbox
    let currentCategory = 'all';
    let visibleItems = Array.from(galleryItems); // Initially all items are visible
    let currentIndex = 0;

    // 🎨 --- Category Filtering Logic ---
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            currentCategory = btn.getAttribute('data-filter');
            
            // Filter gallery items
            visibleItems = [];
            
            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (currentCategory === 'all' || itemCategory === currentCategory) {
                    item.classList.remove('hide');
                    visibleItems.push(item);
                    
                    // Small delay for smooth entry animation
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.classList.add('hide');
                }
            });

            // Filter category titles
            categoryTitles.forEach(title => {
                const titleCategory = title.getAttribute('data-category');
                if (currentCategory === 'all' || titleCategory === currentCategory) {
                    title.classList.remove('hide');
                } else {
                    title.classList.add('hide');
                }
            });
        });
    });


    // 🔍 --- Lightbox Logic ---

    // Open Lightbox
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            // Only allow clicking if the item is visible
            if (item.classList.contains('hide')) return;
            
            // Find index of clicked item within VISIBLE items
            currentIndex = visibleItems.indexOf(item);
            
            updateLightbox(currentIndex);
            
            // Show Lightbox
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    });

    // Close Lightbox function
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    };

    closeBtn.addEventListener('click', closeLightbox);
    
    // Close on backdrop click
    lightbox.addEventListener('click', (e) => {
        if (e.target.classList.contains('lightbox-backdrop') || e.target === lightbox) {
            closeLightbox();
        }
    });

    // Next/Prev Image specific to visible items
    const showNextImage = () => {
        if (visibleItems.length === 0) return;
        currentIndex = (currentIndex + 1) % visibleItems.length;
        updateLightbox(currentIndex);
    };

    const showPrevImage = () => {
        if (visibleItems.length === 0) return;
        currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
        updateLightbox(currentIndex);
    };

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent backdrop click
        showNextImage();
    });
    
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrevImage();
    });

    // Function to update the lightbox content based on currentIndex of visibleItems
    function updateLightbox(index) {
        if (visibleItems.length === 0) return;
        
        const currentItem = visibleItems[index];
        const img = currentItem.querySelector('img');
        const captionText = currentItem.querySelector('.caption').textContent;

        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = captionText;
        lightboxCounter.textContent = `${index + 1} / ${visibleItems.length}`;
    }

    // ⌨️ Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'Escape') closeLightbox();
        }
    });
});