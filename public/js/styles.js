document.addEventListener('DOMContentLoaded', loadStyles)

function loadStyles () {
  window.addEventListener('scroll', function () {
    const head = document.querySelector('header')
    if (window.scrollY > 100) {
      head.classList.add('nav-scroll')
    //   document.querySelector('#logo img').style.height = '25px'
    //   document.querySelector('#logo img').style.paddingBottom = '6px'
    //   const links = document.querySelectorAll('.flexnav li a')
    //   links.forEach(link => {
    //     link.style.fontSize = '15px'
    //   })
    } else {
      head.classList.remove('nav-scroll')
    //   document.querySelector('#logo img').style.height = '40px'
    //   document.querySelector('#logo img').style.paddingBottom = '5px'
    //   const links = document.querySelectorAll('.flexnav li a')
    //   links.forEach(link => {
    //     link.style.fontSize = '20px'
    //   })
    }
  })
}
