// --- Function Definitions (Must be defined first) ---

function populateStars(containerSelector, count, fallChance = 0.1) {
    const container = document.querySelector(containerSelector);
    if (!container) return; 

    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        const isFalling = Math.random() < fallChance;
        star.classList.add(isFalling ? 'falling' : 'star');

        const size = Math.random() * 1.5 + 0.5;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;

        if (isFalling) {
            const duration = 5 + Math.random() * 10;
            const delay = Math.random() * 15;
            star.style.animationDuration = `${duration}s`;
            star.style.animationDelay = `${delay}s`;
        } else {
            star.style.animationDelay = `${Math.random() * 3}s`;
        }
        container.appendChild(star);
    }
}

// -------------------------------------------------------------------------
// --- TILT ANIMATION FUNCTIONS (Keep these here for use later) ---

function handleMouseMove(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const offsetX = e.clientX - centerX;
    const offsetY = e.clientY - centerY;

    const tiltX = (offsetY / (rect.height / 2)) * 10;
    const tiltY = (offsetX / (rect.width / 2)) * -10;

    card.style.transform = `
        perspective(1000px) 
        scale(1.05) 
        translateY(-5px) 
        rotateX(${tiltX}deg) 
        rotateY(${tiltY}deg)
    `;
    card.style.boxShadow = '0 12px 20px rgba(0,0,0,0.2)';
}

function handleMouseLeave(e) {
    e.currentTarget.style.transform = '';
    e.currentTarget.style.boxShadow = '';
}

function initializeTiltListeners(cards) {
    cards.forEach(card => {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);
    });
}

// --- Background Height Fix Function ---
function setFullDocumentHeight() {
    const docHeight = Math.max(
        document.body.scrollHeight, 
        document.body.offsetHeight, 
        document.documentElement.clientHeight, 
        document.documentElement.scrollHeight, 
        document.documentElement.offsetHeight
    );
    
    const bgElements = document.querySelectorAll('.background-nebula-container, .nebula-bg, .stars, .stars2, .stars3');
    
    bgElements.forEach(el => {
        el.style.height = `${docHeight}px`;
    });
}


// -------------------------------------------------------------------------
// --- MAIN EXECUTION BLOCK (DOMContentLoaded) ---
// -------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {

    // 1. STAR BACKGROUND INITIALIZATION (Moved inside DOMContentLoaded)
    populateStars('.stars', 120, 0.05);
    populateStars('.stars2', 100, 0.1);
    populateStars('.stars3', 80, 0.15);
    setFullDocumentHeight();
    window.addEventListener('resize', setFullDocumentHeight);

    // 2. PORTFOLIO GALLERY LOGIC (Using the more complete version)
    const showMoreBtn = document.getElementById('showMoreBtn');
    const hiddenRows = document.querySelectorAll('.gallery-row.hidden');
    let visibleRowCount = 1;
    const maxRowsToShow = 4; // Based on your HTML

    const initialCards = document.querySelectorAll('.photo-card');
    initializeTiltListeners(initialCards);

    if (showMoreBtn) {
        if (hiddenRows.length === 0) {
            showMoreBtn.style.display = 'none';
        }

        showMoreBtn.addEventListener('click', () => {
            if (visibleRowCount < maxRowsToShow) {
                const nextRow = hiddenRows[visibleRowCount - 1];
                if (nextRow) {
                    nextRow.classList.remove('hidden');
                    // Add animation class here if you have it defined
                    
                    visibleRowCount++;
                    initializeTiltListeners(nextRow.querySelectorAll('.photo-card'));

                    if (visibleRowCount === maxRowsToShow) {
                        showMoreBtn.textContent = 'Full Portfolio';
                        showMoreBtn.onclick = () => {
                            window.open('https://www.behance.net/japrein', '_blank');
                        };
                    }
                }
            } else if (visibleRowCount === maxRowsToShow) {
                window.open('https://www.behance.net/japrein', '_blank');
            }
        });
    }

    // 3. ABOUT PHOTOS SLIDESHOW LOGIC (Corrected and Integrated)
    
    // Define the full array of image sources
    const imagesToCycle = [
        'photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg', 'photo5.jpg', 
        'photo6.jpg', 'photo7.jpg', 'photo8.jpg', 'photo9.jpg', 'photo10.jpg',
        'photo11.jpg', 'photo12.jpg', 'photo13.jpg', 'photo14.jpg', 'photo15.jpg',
        'photo16.jpg', 'photo17.jpg', 'photo18.jpg', 'photo19.jpg', 'photo20.jpg'
    ];

    const slideshowImages = document.querySelectorAll('.abp-photo-cell img');
    const totalImages = imagesToCycle.length;

    function cycleImagesRandomly() {
        slideshowImages.forEach((img) => {
            // Select a random photo index (0 to 19)
            const randomIndex = Math.floor(Math.random() * totalImages);
            const newSrc = imagesToCycle[randomIndex];
            const cell = img.closest('.abp-photo-cell');

            // 1. BLACK OUT: Prepare for SRC change (Shrink + Black Background)
            cell.style.backgroundColor = 'transparent';
            img.classList.remove('loaded'); // Triggers scale down/out animation
            
            // 2. Delay to allow CSS fade/scale out transition (300ms) to happen
            setTimeout(() => {
                
                // 3. CHANGE SRC: Source is changed while cell is black
                img.src = newSrc;

                // 4. FADE IN/POP IN: Use onload to ensure image is ready before popping it in
                img.onload = () => {
                    cell.style.backgroundColor = 'transparent'; 
                    img.classList.add('loaded'); // Triggers scale up/in animation
                };
                
            }, 500); 
        });
    }

    // Initial call to set the first random batch
    cycleImagesRandomly();

    // Start the automatic slideshow: change all images every 3 seconds
    setInterval(cycleImagesRandomly, 5000); 
});


