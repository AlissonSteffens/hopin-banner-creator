let data;
let sections;

function checkStorage() {
  if (localStorage.getItem('data')) {
    loadJSON(localStorage.getItem('data'))
  }
}

function loadJSON(json) {
  data = JSON.parse(json)
  sections = data.data
  let info = document.getElementById('info-template').innerHTML
  let novo = info.replace('${count}', sections.length);
  novo = novo.replace('${keys}', Object.keys(sections[0]));
  novo = novo.replace('${name}', data.name);
  document.getElementById('infos').innerHTML = novo
  document.getElementById("generate").disabled = false
}

async function askJSON() {
  const { value: json } = await Swal.fire({
    title: 'Input Banners Json',
    input: 'textarea',
    inputLabel: 'Your JSON',
    inputPlaceholder: 'Enter your JSON'
  })

  if (json) {
    localStorage.setItem('data', json)
    loadJSON(json)
  }
}

function generateHopinBanner() {
  let text = document.getElementById('hopin-template').innerHTML
  let component = document.getElementById('banners')
  let count = 0

  sections.forEach((section) => {
    let nova = text.replace('${event}', section.event);
    nova = nova.replace('${section}', section.section);
    let bann = document.createElement('div');
    bann.classList.add('banner')
    bann.classList.add('hopin')
    bann.classList.add(section.type)
    if (section.section.length >= 200) {
      bann.classList.add('long')
    }
    bann.innerHTML = nova
    bann.id = count
    count++
    component.append(bann)
  })
  document.getElementById("save").disabled = false
}

function generateYoutubeBanner() {
  let text = document.getElementById('youtube-template').innerHTML
  let component = document.getElementById('banners')
  let count = 0

  sections.forEach((section) => {
    let nova = text.replace('${event}', section.event);
    nova = nova.replace('${section}', section.section);
    nova = nova.replace('${people}', section.people);
    let bann = document.createElement('div');
    bann.classList.add('banner')
    bann.classList.add('youtube')
    bann.classList.add(section.type)
    if (section.section.length >= 200) {
      bann.classList.add('long')
    }
    bann.innerHTML = nova
    bann.id = count
    count++
    component.append(bann)
  })
  document.getElementById("save").disabled = false
}

function generateBanners() {
  let template = document.getElementById("template-selector").value
  document.getElementById('banners').innerHTML = ""
  if (template === "Hopin") {
    generateHopinBanner()
  }
  else if (template === "Youtube") {
    generateYoutubeBanner()
  }
}

function save() {
  for (let i = 0; i < sections.length; i++) {
    html2canvas(document.getElementById(i)).then(canvas => {
      var link = document.getElementById('link');
      link.setAttribute('download', `${sections[i].event}/${sections[i].section}.png`);
      link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
      link.click();
    });
  }
}

function docReady(fn) {
  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(fn, 1);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

docReady(checkStorage)
