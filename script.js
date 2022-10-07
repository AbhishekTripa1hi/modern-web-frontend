'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const divObj = document.createElement('div');
const headerClassObjCollection = document.getElementsByClassName('header');
const tabs = document.querySelectorAll('.operations__tab');
const tabContents = document.querySelector('.operations__content');
const tabsContainer = document.querySelector('.operations__tab-container');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const imgTargets = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const sliderBtnLeft = document.querySelector('.slider__btn--left');
const sliderBtnRight = document.querySelector('.slider__btn--right');
const dotsContainer = document.querySelector('.dots');

const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

divObj.classList.add('cookie-message');
divObj.innerHTML =
  'We use cookies for our purpose.<button class="btn btn--close-cookie">Got it<button>';

headerClassObjCollection[0].append(divObj);

document.querySelector('.btn--close-cookie').addEventListener('click', () => {
  divObj.parentElement.removeChild(divObj);
});

//Styles
divObj.style.backgroundColor = '#37383d';
divObj.style.width = '120%';
divObj.style.height =
  Number.parseFloat(getComputedStyle(divObj).height, 10) + 25 + `px`;

btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({
    behavior: 'smooth',
  });
});

//Page Scroll
document.querySelector('.nav__links').addEventListener('click', e => {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    document
      .querySelector(e.target.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  }
});

//tabbed component
tabsContainer.addEventListener('click', e => {
  if (!e.target.classList.contains('operations__tab-container')) {
    const data =
      e.target.getAttribute('data-tab') ||
      e.target.parentElement.getAttribute('data-tab');
    document
      .querySelectorAll('.operations__tab')
      .forEach(elem => elem.classList.remove('operations__tab--active'));

    document
      .querySelector(`.operations__tab--${data}`)
      .classList.add('operations__tab--active');

    document.querySelectorAll('.operations__content').forEach(elem => {
      elem.classList.remove('operations__content--active');
    });

    document
      .querySelector(`.operations__content--${data}`)
      .classList.add('operations__content--active');
  }
});

//hover on links
nav.addEventListener('mouseover', e => {
  if (e.target.classList.contains('nav__link')) {
    const siblings = nav.querySelectorAll('.nav__link');
    const logo = nav.querySelector('img');
    siblings.forEach(elem => {
      if (elem !== e.target) elem.style.opacity = 0.5;
    });

    logo.style.opacity = 0.5;
  }
});

nav.addEventListener('mouseout', e => {
  if (e.target.classList.contains('nav__link')) {
    const siblings = nav.querySelectorAll('.nav__link');
    const logo = nav.querySelector('img');
    siblings.forEach(elem => (elem.style.opacity = 1));

    logo.style.opacity = 1;
  }
});

//sticky nav
const navHeight = nav.getBoundingClientRect().height;

const stickyNavFunc = function (entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting == false) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
  });
};

const headerObserver = new IntersectionObserver(stickyNavFunc, {
  root: null,
  threshold: 0,
  rootMargin: `${navHeight}px`,
});

headerObserver.observe(header);

//reveal sections
const revealSections = function (entries, observer) {
  const entriesArr = [...entries];
  entriesArr.forEach(entry => {
    if (entry.isIntersecting) {
      document
        .querySelector(`#${entry.target.id}`)
        .classList.remove('section--hidden');
      observer.unobserve(entry.target);
    }
  });
};

const sectionObserver = new IntersectionObserver(revealSections, {
  root: null,
  threshold: 0.2,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//lazy loading

const loading = function (entries, observer) {
  //console.log([...entries][0].target instanceof HTMLElement);
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      //finding loading img happens behind the scenes
      entry.target.src = entry.target.getAttribute('data-src');
      entry.target.addEventListener('load', function () {
        entry.target.classList.remove('lazy-img');
        imgObserver.unobserve(entry.target);
      });
    }
  });
};
const imgObserver = new IntersectionObserver(loading, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
imgTargets.forEach(imgTarget => imgObserver.observe(imgTarget));

//slider+dots
let currSlide = 0;
const activateDot = function () {
  const dotsArr = document.querySelectorAll('.dots__dot');

  dotsArr.forEach(dot => {
    dot.classList.remove('dots__dot--active');

    if (Number.parseInt(dot.dataset.slide) === currSlide)
      dot.classList.add('dots__dot--active');
  });
};

const goToSlide = function () {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${(-currSlide + i) * 100}%)`;
  });

  activateDot();
};

sliderBtnRight.addEventListener('click', () => {
  currSlide = (currSlide + 1) % 3;
  goToSlide();
});
sliderBtnLeft.addEventListener('click', () => {
  currSlide = (currSlide - 1 + 3) % 3;
  goToSlide();
});
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') {
    currSlide = (currSlide - 1 + 3) % 3;
    goToSlide();
  } else if (e.key === 'ArrowRight') {
    currSlide = (currSlide + 1) % 3;
    goToSlide();
  }
});

//dots
const createDots = function () {
  for (let i = 0; i < slides.length; i++) {
    dotsContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  }
};

createDots();
goToSlide();

dotsContainer.addEventListener('click', e => {
  if (e.target.classList.contains('dots__dot')) {
    currSlide = Number.parseInt(e.target.dataset.slide);
    goToSlide();
  }
});
/////////////////////////////////////////////////////

/*
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

document.querySelector('.header');
const allSections = document.querySelectorAll('.section');

//console.log(allSections);
//console.log(document.getElementById('section--1'));
const allButtons = document.getElementsByTagName('button');

//console.log(allButtons);

const classObjBtns = document.getElementsByClassName('btn');

//console.log(classObjBtns);
*/
//document.documentElement.style.setProperty('--color-primary', 'red');

/*
const img = document.querySelector('.nav__logo');

console.log(img.src);
console.log(img.alt);
console.log(img.className);

//non standard
console.log(img.getAttribute('designer'));
img.setAttribute('alt', 'somealt');

console.log(img.src);
console.log(img.getAttribute('src'));

const lnk = document.querySelector('.twitter-link');
console.log(lnk.href);
console.log(lnk.getAttribute('href'));

const lnk2 = document.querySelector('.nav__link--btn');
console.log(lnk2.href);
console.log(lnk2.getAttribute('href'));

//data property
console.log(img.dataset.versionNaah);

img.classList.add('c', 'j');
img.classList.remove('c');
img.classList.toggle();
img.classList.contains('c');

//don't use as it will overwrite all other classes
img.className = 'newclass';
*/
/*
const h1 = document.querySelector('h1');
const func = function () {
  alert('mouseEnter');
  h1.removeEventListener('mouseenter', func);
};

h1.addEventListener('mouseenter', func);

/*h1.onmouseenter = function (e) {
  alert('hi');
};
*/
/*
const randColor = (min, max) => {
  const funcNum = () => Math.trunc(Math.random() * (max - min + 1)) + min;
  return `rgb(${funcNum()},${funcNum()},${funcNum()})`;
};

console.log(randColor(0, 255));

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randColor(0, 255);
  console.log(e.currentTarget);
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randColor(0, 255);
  console.log(e.currentTarget === this);
  //e.stopPropagation();
});

//handlers working on event capture phase
document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randColor(0, 255);
  console.log(e.currentTarget, 'nav');
});
*/
/*
document.querySelectorAll('.nav__link').forEach(elem => {
  elem.addEventListener('click', e => {
    e.preventDefault();
    const id = elem.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth',
    });
  });
});
*/
//go down
/*
const h1 = document.querySelector('h1');

//console.log(h1.querySelectorAll('.highlight'));

//console.log((h1.lastElementChild.style.color = 'red'));

//go up
h1.closest('h1').style.background = `var(--gradient-secondary)`;

console.log(h1.nextElementSibling);
console.log(h1.previousElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(elem => {
  if (elem !== h1) {
    elem.style.transform = 'scale(0.5)';
  }
});
*/
/*
const obsOptions = {
  root1: 'null',
  threshold: [0, 0.2],
};
const obsCallback = function (entries, observer) {
  console.log(entries);
  entries.forEach(entry => {
    console.log(entry);
  });
};
const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1);
*/

document.addEventListener('DOMContentLoaded', () => {
  //no wait for external stylesheets, frames or images
  console.log('HTML parsed and loaded');
});

//when complete page finishes loading including all css and externals
window.addEventListener('load', () => {
  console.log('page');
});

/*
window.addEventListener('beforeunload', e => {
  //to make it work in some browsers, not needed in chrome
  //e.preventDefault();
  console.log(e);
  //this was abused to show messages to users when they closed the tab, hence it won't affect whether you put in a message for returnValue or not
  e.returnValue = '';
});
*/
/*
window.onbeforeunload = function () {
  return 'Are you sure';
};
*/
