const fromSelect = document.getElementById('from');
const toSelect = document.getElementById('to');
const amountInp = document.getElementById('amount');
const resultEl = document.getElementById('result');
const btnConvert = document.getElementById('convert');
let rates = {};

// Effet Matrix
const canvas = document.createElement('canvas');
document.body.prepend(canvas);
canvas.id = 'matrix';
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789azertyuiopqsdfghjklmwxcvbnазертыуиоп́сдфгхйклмщхцвбнАЗЕРТЫУИОПQСДФГХЙКЛМЩХЦВБНא ב ג ד ה ו ז ח ט י כ ך ל מ ם נ ן ס ע פ ף צ ץ ק ר ש תا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و يבּ כּ פּ שׁ שׂ וּ זּ טּ יּ ךּ כּ לּ מּ נּ סּ כֿآ أ إ ئ ء ؤ ة ى ٱ ٲ ٳ ٵ ﭐ ﭑ ﭒ ﭓ";
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#00ff00';
    ctx.font = `${fontSize}px monospace`;
    
    for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
} 

// Lancer l'animation Matrix
const matrixInterval = setInterval(drawMatrix, 25);

// Redimensionnement du canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Charger la liste des devises
fetch('https://openexchangerates.org/api/currencies.json')
  .then(res => res.json())
  .then(currencies => {
    for (let code in currencies) {
      [fromSelect, toSelect].forEach(select => {
        const opt = document.createElement('option');
        opt.value = code;
        opt.textContent = `${code} - ${currencies[code]}`;
        select.appendChild(opt);
      });
    }
    fromSelect.value = 'EUR';
    toSelect.value = 'USD';
    loadRates(fromSelect.value);
  })
  .catch(() => {
    resultEl.textContent = 'Error';
  });

// Charger les taux en fonction de la devise de base
function loadRates(base) {
  fetch(`https://api.exchangerate-api.com/v4/latest/${base}`)
    .then(res => res.json())
    .then(data => {
      rates = data.rates;
    })
    .catch(() => {
      resultEl.textContent = 'Failed to load rates';
    });
}

// Mettre à jour les taux lorsque la devise de base change
fromSelect.addEventListener('change', () => {
  loadRates(fromSelect.value);
});

// Effectuer la conversion
btnConvert.addEventListener('click', () => {
  const amount = parseFloat(amountInp.value);
  const from = fromSelect.value;
  const to = toSelect.value;

  if (isNaN(amount) || amount <= 0) {    resultEl.textContent = 'NO VALUE ENTERED';
    return;
  }
  if (!rates[to]) {
    resultEl.textContent = 'Rate not available';
    return;
  }

  const converted = amount * rates[to];
  resultEl.textContent = `${amount.toFixed(2)} ${from} = ${converted.toFixed(2)} ${to}`;
});

// Permettre la conversion avec la touche Entrée
amountInp.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    btnConvert.click();
  }
});
