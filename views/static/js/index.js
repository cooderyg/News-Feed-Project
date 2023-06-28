const swiper = new Swiper(".swiper-container", {
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  autoplay: true,
  loop: true,
  spaceBetween: 30,
  slidesPerView: 3,
});
