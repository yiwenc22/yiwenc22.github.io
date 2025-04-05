const body = document.body;
const btnTheme = document.querySelector('.fa-moon');
const btnHamburger = document.querySelector('.fa-bars');

// Set default to dark theme
if (!localStorage.getItem('theme')) {
  localStorage.setItem('theme', 'dark');
}

// Check if the user has a theme preference
const theme = localStorage.getItem('theme');
if (theme === 'dark') {
  body.classList.replace('light', 'dark');
  btnTheme.classList.replace('fa-moon', 'fa-sun');
}

// Switch theme function
const changeTheme = () => {
  if (body.classList.contains('light')) {
    body.classList.replace('light', 'dark');
    btnTheme.classList.replace('fa-moon', 'fa-sun');
    localStorage.setItem('theme', 'dark');
  } else {
    body.classList.replace('dark', 'light');
    btnTheme.classList.replace('fa-sun', 'fa-moon');
    localStorage.setItem('theme', 'light');
  }
};

// Responsive navigation menu
const openMenu = () => {
  const navList = document.querySelector('.nav__list');
  if (!navList.classList.contains('display-nav-list')) {
    navList.classList.add('display-nav-list');
    btnHamburger.classList.replace('fa-bars', 'fa-times');
  } else {
    navList.classList.remove('display-nav-list');
    btnHamburger.classList.replace('fa-times', 'fa-bars');
  }
};

// Event listeners
btnTheme.addEventListener('click', changeTheme);
btnHamburger.addEventListener('click', openMenu);

// Scroll to top functionality
const scrollUp = document.querySelector('.scroll-top');
if (scrollUp) {
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100) {
      scrollUp.style.display = 'block';
    } else {
      scrollUp.style.display = 'none';
    }
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});
