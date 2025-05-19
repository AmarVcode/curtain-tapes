// Initialize AOS
AOS.init({
    duration: 1000,
    once: true
});

// Header scroll effect
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});

// Create global blob background
function createGlobalBlobBackground() {
    const canvas = document.getElementById('global-blob-canvas');
    if (!canvas) return;

    // Set canvas size to window size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create blobs
    const blobs = [];
    const blobCount = 5;
    const colors = [0x4a90e2, 0x2c3e50, 0x34495e, 0x6ec6ff, 0x90caf9];
    for (let i = 0; i < blobCount; i++) {
        const geometry = new THREE.SphereGeometry(1.2, 32, 32);
        const material = new THREE.MeshBasicMaterial({
            color: colors[i % colors.length],
            transparent: true,
            opacity: 0.13
        });
        const blob = new THREE.Mesh(geometry, material);
        blob.position.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 8
        );
        blob.userData = {
            baseX: blob.position.x,
            baseY: blob.position.y,
            baseZ: blob.position.z,
            timeOffset: Math.random() * 1000,
            floatRadius: 2 + Math.random() * 2
        };
        scene.add(blob);
        blobs.push(blob);
    }
    camera.position.z = 8;

    // Animate
    function animate() {
        requestAnimationFrame(animate);
        const time = Date.now() * 0.0007;
        blobs.forEach((blob, i) => {
            // Float in a 3D sine/cosine pattern
            blob.position.x = blob.userData.baseX + Math.sin(time + blob.userData.timeOffset + i) * blob.userData.floatRadius;
            blob.position.y = blob.userData.baseY + Math.cos(time * 1.2 + blob.userData.timeOffset + i) * blob.userData.floatRadius * 0.7;
            blob.position.z = blob.userData.baseZ + Math.sin(time * 0.7 + blob.userData.timeOffset + i) * blob.userData.floatRadius * 0.5;
            // Gentle pulsing
            const scale = 1 + Math.sin(time * 1.5 + blob.userData.timeOffset) * 0.08;
            blob.scale.set(scale, scale, scale);
            // Slow rotation
            blob.rotation.x += 0.001;
            blob.rotation.y += 0.001;
        });
        renderer.setSize(window.innerWidth, window.innerHeight, false);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
    }
    animate();
}

// Initialize global blob background
window.addEventListener('DOMContentLoaded', createGlobalBlobBackground);

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Image zoom effect
const productImages = document.querySelectorAll('.product-image img');
productImages.forEach(img => {
    img.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.05)';
    });
    img.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
    });
});

// Enquire button hover effect
const enquireButtons = document.querySelectorAll('.enquire-btn');
enquireButtons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-2px)';
        button.style.boxShadow = '0 6px 20px rgba(74, 144, 226, 0.4)';
    });
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = '0 4px 15px rgba(74, 144, 226, 0.3)';
    });
});

// Vanilla JS Magnifier for all .magnifier-img images
function addMagnifier(imgSelector, zoom = 2) {
  document.querySelectorAll(imgSelector).forEach(function(img) {
    let magnifierGlass = document.createElement("div");
    magnifierGlass.setAttribute("class", "magnifier-glass");
    img.parentElement.appendChild(magnifierGlass);

    let w = magnifierGlass.offsetWidth / 2;
    let h = magnifierGlass.offsetHeight / 2;

    magnifierGlass.style.backgroundImage = "url('" + img.src + "')";
    magnifierGlass.style.backgroundRepeat = "no-repeat";
    magnifierGlass.style.backgroundSize = (img.width * zoom) + "px " + (img.height * zoom) + "px";

    function moveMagnifier(e) {
      let pos = getCursorPos(e);
      let x = pos.x;
      let y = pos.y;
      if (x > img.width - w / zoom) { x = img.width - w / zoom; }
      if (x < w / zoom) { x = w / zoom; }
      if (y > img.height - h / zoom) { y = img.height - h / zoom; }
      if (y < h / zoom) { y = h / zoom; }
      magnifierGlass.style.left = (x - w) + "px";
      magnifierGlass.style.top = (y - h) + "px";
      magnifierGlass.style.backgroundPosition = "-" + ((x * zoom) - w) + "px -" + ((y * zoom) - h) + "px";
    }

    function getCursorPos(e) {
      let a = img.getBoundingClientRect();
      let x = e.touches ? e.touches[0].clientX : e.clientX;
      let y = e.touches ? e.touches[0].clientY : e.clientY;
      x = x - a.left;
      y = y - a.top;
      return { x: x, y: y };
    }

    magnifierGlass.addEventListener("mousemove", moveMagnifier);
    img.addEventListener("mousemove", moveMagnifier);
    magnifierGlass.addEventListener("touchmove", moveMagnifier);
    img.addEventListener("touchmove", moveMagnifier);

    img.addEventListener("mouseenter", function() {
      magnifierGlass.style.display = "block";
    });
    img.addEventListener("mouseleave", function() {
      magnifierGlass.style.display = "none";
    });
    magnifierGlass.style.display = "none";
  });
}

window.addEventListener('DOMContentLoaded', function() {
  addMagnifier('.magnifier-img', 2); // 2x zoom
});

// Hamburger menu toggle for mobile
$(function() {
  $('.mobile-menu-btn').on('click', function() {
    $('.nav-links').toggleClass('open');
  });
  $('.nav-links a').on('click', function() {
    if (window.innerWidth <= 900) {
      $('.nav-links').removeClass('open');
    }
  });
}); 