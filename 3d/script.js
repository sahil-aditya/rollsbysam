const ASSETS = [
  {
    src: 'https://images.unsplash.com/photo-1769921546096-7a648d953a3e?q=80&w=1200&auto=format&fit=crop',
    title: 'urban exploration',
  },
  {
    src: 'https://images.unsplash.com/photo-1777726515600-65be20641e1b?q=80&w=1200&auto=format&fit=crop',
    title: 'night scene',
  },
  {
    src: 'https://images.unsplash.com/photo-1776582929657-9710d9cfa46a?q=80&w=1200&auto=format&fit=crop',
    title: 'yellow wildflowers',
  },
  {
    src: 'https://images.unsplash.com/photo-1776582929656-78ad8b515d75?q=80&w=1200&auto=format&fit=crop',
    title: 'street with mount fuji',
  },
  {
    src: 'https://images.unsplash.com/photo-1775990630948-3c1f696f4ab1?q=80&w=1200&auto=format&fit=crop',
    title: 'bridgestone bicycle shop',
  },
  {
    src: 'https://images.unsplash.com/photo-1775380744191-8fbff371c40b?q=80&w=1200&auto=format&fit=crop',
    title: 'train window view',
  },
  {
    src: 'https://images.unsplash.com/photo-1774775479879-082fd47d41e1?q=80&w=1200&auto=format&fit=crop',
    title: 'train tracks',
  },
  {
    src: 'https://images.unsplash.com/photo-1773544517453-95c148cb42b7?q=80&w=1200&auto=format&fit=crop',
    title: 'lawson convenience store',
  }
];

let currentIndex = 0;
const imgElement = document.getElementById('galleryImg');
const titleElement = document.getElementById('galleryTitle');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

function updateGallery() {
  // Pehle image ko blur aur fade out karo
  imgElement.classList.remove('loaded');
  
  // Fade out complete hone ke baad source change karo
  setTimeout(() => {
    imgElement.src = ASSETS[currentIndex].src;
    titleElement.textContent = ASSETS[currentIndex].title;
  }, 400); 
}

// Jab nayi image load ho jaye, toh class wapas add karke fade in aur unblur karo
imgElement.onload = () => {
  imgElement.classList.add('loaded');
};

// Next Button Click 
nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % ASSETS.length;
  updateGallery();
});

// Previous Button Click
prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex === 0) ? ASSETS.length - 1 : currentIndex - 1;
  updateGallery();
});

// Shuruwaat me pehli image set karna
imgElement.src = ASSETS[currentIndex].src;
titleElement.textContent = ASSETS[currentIndex].title;
