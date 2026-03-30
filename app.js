const eyesConfig = [
  {
    x: "18.48%",
    top: "59.62%",
    width: "4.4%",
    height: "3.5%",
    rotation: "-6deg",
  },
  {
    x: "24.17%",
    top: "58.65%",
    width: "4.4%",
    height: "3.5%",
    rotation: "2deg",
  },
  {
    x: "34.02%",
    top: "51.43%",
    width: "3.9%",
    height: "3.2%",
    rotation: "-5deg",
  },
  {
    x: "39.32%",
    top: "51.30%",
    width: "3.8%",
    height: "3.0%",
    rotation: "2deg",
  },
  {
    x: "57.50%",
    top: "63.65%",
    width: "3.5%",
    height: "2.8%",
    rotation: "-7deg",
  },
  {
    x: "62.20%",
    top: "63.37%",
    width: "3.4%",
    height: "2.7%",
    rotation: "2deg",
  },
  {
    x: "75.53%",
    top: "62.68%",
    width: "4.1%",
    height: "3.3%",
    rotation: "-8deg",
  },
  {
    x: "81.06%",
    top: "62.68%",
    width: "4.0%",
    height: "3.3%",
    rotation: "0deg",
  },
];

const eyeLayer = document.querySelector("#eye-layer");
const pupils = [];
const eyes = [];
let pointerX = window.innerWidth / 2;
let pointerY = window.innerHeight / 2;
let idleAngle = 0;

function buildEyeMarkup(eyeConfig) {
  const eyeNode = document.createElement("div");
  eyeNode.className = "eye-slot";
  eyeNode.style.setProperty("--x", eyeConfig.x);
  eyeNode.style.setProperty("--top", eyeConfig.top);
  eyeNode.style.setProperty("--width", eyeConfig.width);
  eyeNode.style.setProperty("--height", eyeConfig.height);
  eyeNode.style.setProperty("--rotation", eyeConfig.rotation);

  eyeNode.innerHTML = `
    <div class="eye">
      <div class="eye-lid"></div>
      <div class="pupil"></div>
    </div>
  `;

  eyeLayer.appendChild(eyeNode);
  pupils.push(eyeNode.querySelector(".pupil"));
  eyes.push(eyeNode.querySelector(".eye"));
}

function updateEyes() {
  const activePointer = pointerX !== null && pointerY !== null;

  pupils.forEach((pupil, index) => {
    const eye = pupil.parentElement;
    const rect = eye.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let dx;
    let dy;

    if (activePointer) {
      dx = pointerX - centerX;
      dy = pointerY - centerY;
    } else {
      const driftRadius = 12;
      const offset = index * 0.65;
      dx = Math.cos(idleAngle + offset) * driftRadius;
      dy = Math.sin(idleAngle * 0.8 + offset) * driftRadius * 0.25;
    }

    const distance = Math.hypot(dx, dy) || 1;
    const maxOffset = Math.min(rect.width, rect.height) * 0.13;
    const offsetX = (dx / distance) * maxOffset;
    const offsetY = (dy / distance) * maxOffset;

    pupil.style.setProperty("--pupil-x", `${offsetX.toFixed(2)}px`);
    pupil.style.setProperty("--pupil-y", `${offsetY.toFixed(2)}px`);
  });

  idleAngle += 0.014;
  window.requestAnimationFrame(updateEyes);
}

function triggerBlink() {
  const eye = eyes[Math.floor(Math.random() * eyes.length)];
  if (eye) {
    eye.classList.add("blinking");
    window.setTimeout(() => eye.classList.remove("blinking"), 320);
  }

  const delay = 1800 + Math.random() * 2600;
  window.setTimeout(triggerBlink, delay);
}

function setPointer(event) {
  pointerX = event.clientX;
  pointerY = event.clientY;
}

function clearPointer() {
  pointerX = null;
  pointerY = null;
}

eyesConfig.forEach(buildEyeMarkup);
window.addEventListener("pointermove", setPointer);
window.addEventListener("pointerleave", clearPointer);
window.addEventListener("blur", clearPointer);

triggerBlink();
updateEyes();
