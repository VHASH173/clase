// 1. Menú móvil
const btn = document.querySelector('.menu-btn');
const menu = document.getElementById('menu');
btn.addEventListener('click', () => {
  const abierto = menu.classList.toggle('abierto');
  btn.setAttribute('aria-expanded', abierto);
});
menu.addEventListener('click', e => {
  if (e.target.tagName === 'A') { menu.classList.remove('abierto'); btn.setAttribute('aria-expanded', false); }
});

// 2. Selector de tueste
const niveles = {
  claro:  { color: '#c58a52', texto: 'Tueste claro: más acidez y notas de fruta y flor. Cuerpo ligero. Se disfruta mejor en filtrado.' },
  medio:  { color: '#7a4a2a', texto: 'Tueste medio: equilibrio entre dulzor y acidez. Notas de chocolate y caramelo. Sirve para casi todo.' },
  oscuro: { color: '#2a1c14', texto: 'Tueste oscuro: cuerpo denso y sabor a cacao amargo y nuez tostada. Va bien en espresso y con leche.' }
};
const botones = document.querySelectorAll('.roast button');
const bean = document.getElementById('bean');
const texto = document.getElementById('roast-text');
function elegir(nivel) {
  botones.forEach(b => b.setAttribute('aria-checked', b.dataset.level === nivel));
  bean.style.background = niveles[nivel].color;
  texto.textContent = niveles[nivel].texto;
}
botones.forEach(b => b.addEventListener('click', () => elegir(b.dataset.level)));
elegir('claro');

// 3. Resaltar la sección visible en el menú
const enlaces = document.querySelectorAll('nav a');
const obs = new IntersectionObserver(entradas => {
  entradas.forEach(en => {
    if (en.isIntersecting) enlaces.forEach(a => a.classList.toggle('activo', a.getAttribute('href') === '#' + en.target.id));
  });
}, { rootMargin: '-40% 0px -55% 0px' });
document.querySelectorAll('main section').forEach(s => obs.observe(s));

// 4. Resumen del pedido (sin servidor)
document.getElementById('pedido').addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target);
  document.getElementById('resumen').textContent =
    `Gracias, ${f.get('nombre')}. Tu pedido: café ${f.get('cafe')}, ${f.get('molido').toLowerCase()}.`;
});

// 5. Año del pie de página
document.getElementById('anio').textContent = new Date().getFullYear();

// 6. Carrusel
const track = document.getElementById('track');
const slides = track.children;
const dots = document.getElementById('dots');
const pausa = document.getElementById('pausa');
let i = 0, timer = null;
const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
for (let n = 0; n < slides.length; n++) {
  const d = document.createElement('button');
  d.type = 'button';
  d.setAttribute('aria-label', 'Ir a la diapositiva ' + (n + 1));
  d.addEventListener('click', () => ir(n));
  dots.appendChild(d);
}
function ir(n) {
  i = (n + slides.length) % slides.length;
  track.style.transform = `translateX(-${i * 100}%)`;
  [...dots.children].forEach((d, k) => d.setAttribute('aria-current', k === i));
}
function iniciar() { timer = setInterval(() => ir(i + 1), 5000); pausa.textContent = 'Pausar'; pausa.setAttribute('aria-pressed', false); }
function detener() { clearInterval(timer); timer = null; pausa.textContent = 'Reanudar'; pausa.setAttribute('aria-pressed', true); }
document.getElementById('prev').addEventListener('click', () => ir(i - 1));
document.getElementById('next').addEventListener('click', () => ir(i + 1));
pausa.addEventListener('click', () => timer ? detener() : iniciar());
ir(0);
reducido ? detener() : iniciar();