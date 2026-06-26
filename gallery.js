document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    const modalClose = document.getElementById('modal-close');

    // Fetch images from JSON
    fetch('../images.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                // Only display if link is not empty
                if (item.link && item.link.trim() !== "") {
                    const div = document.createElement('div');
                    div.className = 'masonry-item';
                    
                    const img = document.createElement('img');
                    img.src = '../' + item.link;
                    img.alt = item.caption || '';
                    img.loading = 'lazy';
                    
                    // Hide if image fails to load
                    img.onerror = () => {
                        div.style.display = 'none';
                    };
                    
                    // Click to enlarge
                    div.addEventListener('click', () => {
                        modalImg.src = '../' + item.link;
                        modal.style.display = 'flex';
                    });

                    div.appendChild(img);

                    if (item.caption && item.caption !== "Your text here") {
                        const caption = document.createElement('div');
                        caption.className = 'caption';
                        caption.textContent = item.caption;
                        div.appendChild(caption);
                    }

                    gallery.appendChild(div);
                }
            });
        })
        .catch(error => console.error('Error loading gallery images:', error));

    // Close Modal
    modal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    modalClose.addEventListener('click', (e) => {
        e.stopPropagation();
        modal.style.display = 'none';
    });
});
