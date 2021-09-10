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
  let keys = Object.keys(data.data[0])
  let k = ""
  // create an ul with an li for each key in keys
  for (let i = 0; i < keys.length; i++) {
    k += `<li>${keys[i]}</li>`
  }
  novo = novo.replace('${keys}', k);
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
    // split section.section into ; separated values
    let values = section.section.split(";")
    let main = ''
    // create a new p for each value
    values.forEach((value) => {
      // format value if it has a : make a <small> tag
      if (value.indexOf(":") !== -1) {
        let sec = value.split(":")
        if (sec[0].toLowerCase().trim() === 'palestra' || sec[0].toLowerCase().trim() === 'painel' || sec[0].toLowerCase().trim() === 'st' || sec[0].toLowerCase().trim() === 'session') {
          sec.shift()
        }
        main += `${sec[0]} `
        sec.shift()
        main += `<small>${sec.join(':')}</small>`
      } else {
        main += value
      }
      main += "<br>"
    })
    nova = nova.replace('${main}', main);
    // if the template is a youtube one, we add the speakers
    if (template == 'youtube') {
      let people = '';
      if (section.people) {
        section.people.forEach(person => {
          // check if person has a headline and it is not an empty string
          if (person.headline && person.headline != "") {
            people += `${person.name} <small>(${person.headline})</small></br>`
          } else if (person.name && person.name != "" && person.name !== 'nan') {
            people += `${person.name}`
            // check if it is not the last person and add a comma
            if (!(section.people.length - 1 == section.people.indexOf(person))) {
              people += ', '
            }
          }

        });
      }
      nova = nova.replace('${small}', people);
    }

    let bann = document.createElement('div');

    bann.classList.add('banner')
    // only has a custom type if is a hopin template
    if (template == 'hopin') {
      bann.classList.add(section.type)
    }

    bann.classList.add(template)
    // if the title lenght is bigger than 75, we add a long class to make the font smaller
    if (section.section.length >= 75 || values.length >= 2) {
      bann.classList.add('long')
    }
    // check if the section has a color atributte and add it to the banner
    if (section.colors) {
      // check if there is more than two colors
      bann.style.backgroundColor = section.colors[0]

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
      console.log(`${i} feito`)
      link.setAttribute('download', `${sections[i].event}/${sections[i].section}.png`);
      link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
      link.click();
    })
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

