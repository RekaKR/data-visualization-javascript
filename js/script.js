function pageLoad() {
  
  function rotate() {
    let elements = document.getElementsByClassName('txt-rotate');
    console.log(elements);
    console.log(elements.length);
    for (let i = 0; i < elements.length; i++) {
        let toRotate = elements[i].getAttribute('data-rotate');
        let period = elements[i].getAttribute('data-period');
        if (toRotate) {
            new TxtRotate(elements[i], JSON.parse(toRotate), period);
        }
    }

    let css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".txt-rotate > .wrap { border-right: 2px solid #fff }";
    document.body.appendChild(css);
  }
  
  function change() {
    const solarLogo = document.getElementById("solar-logo");
    const changeText = document.getElementById("change-text");
  
    function lineIn() {
      changeText.classList.add('toggle');
    }

    function lineOut() {
      changeText.classList.remove('toggle');
    }

    solarLogo.addEventListener('mouseover', lineIn);
    solarLogo.addEventListener('mouseout', lineOut);
  }  

  const root = document.getElementById('root');

  root.insertAdjacentHTML('beforeend', `
    <div id="preloader">
      <img src="preloader.png" alt="">
    </div>
  `);

  setTimeout(() => {
    rotate();
    change();
  }, 3000);
}

window.addEventListener('load', pageLoad);