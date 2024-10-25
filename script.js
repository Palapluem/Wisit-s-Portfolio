let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
}

const typed = new Typed('.home-content h3 span', {
    strings: ['Instant Noodle guy', 'Game Developer', 'Cyber Security'],
    typeSpeed: 75,
    backSpeed: 95,
    backDelay: 100,
    loop: true
  });
  

const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('mouseover', () => {
      card.style.transform = 'scale(1.05)';
      card.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
    });
    card.addEventListener('mouseout', () => {
      card.style.transform = 'scale(1)';
      card.style.boxShadow = 'none';
    });
  });

const servicesHeading = new Typed('#services-heading', {
    strings: ['Skills', 'Interests'],
    typeSpeed: 100,
    backSpeed: 50,
    loop: true
  });
  
const educationCards = document.querySelectorAll('.education-card');

educationCards.forEach(card => {
  card.addEventListener('mouseover', () => {
    educationCards.forEach(c => {
      if (c !== card) {
        c.style.filter = 'blur(3px)';
        c.style.transform = 'scale(1)';
      }
    });
    card.style.filter = 'blur(0)';
    card.style.transform = 'scale(1.1)';
  });

  card.addEventListener('mouseout', () => {
    educationCards.forEach(c => {
      c.style.filter = 'blur(0)';
      c.style.transform = 'scale(1)';
    });
  });
});

const minimizeBtn = document.getElementById('minimize-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const closeFullscreenBtn = document.getElementById('close-fullscreen-btn');
const chatContainer = document.getElementById('chat-container');

minimizeBtn.addEventListener('click', toggleMinimize);
fullscreenBtn.addEventListener('click', toggleFullscreen);
closeFullscreenBtn.addEventListener('click', toggleFullscreen);

function copyToClipboard() {
  var emailText = document.getElementById("email").innerText;
  navigator.clipboard.writeText(emailText).then(function() {
    alert("Email address copied to clipboard!");
  }, function() {
    alert("Failed to copy email address.");
  });
}