let data;
let sections;

// function that checks if the data is in localStorage
function checkStorage() {
  if (localStorage.getItem('data')) {
    loadJSON(localStorage.getItem('data'))
  }
}

// function that loads the JSON and displays the basic information
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

// function that asks the JSON for the user (with a modal) and save it to the localStorage
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

// function that generates the banner according to the template-selector
function generateBanners() {
  let template = document.getElementById("template-selector").value.toLowerCase();
  document.getElementById('banners').innerHTML = ""
  let text = document.getElementById(`${template}-template`).innerHTML
  let component = document.getElementById('banners')
  let count = 0
  // create a new Banner for each section
  sections.forEach((section) => {
    let nova = "";
    nova = text.replace('${secondary}', section.event);
    nova = nova.replace('${main}', section.section);
    // if the template is a youtube one, we add the speakers
    if (template == 'youtube') {
      let people = '';
      if (section.people) {
        section.people.forEach(person => {
          people += `${person.name} <small>(${person.headline})</small></br>`
        });
      }
      nova = nova.replace('${small}', people);
    }
    let bann = document.createElement('div');
    bann.classList.add('banner')
    bann.classList.add(template)
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

// function that downloads the banners as PNG images
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

// function that checks if the document is ready and calls the argument function
function ready(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(checkStorage)
