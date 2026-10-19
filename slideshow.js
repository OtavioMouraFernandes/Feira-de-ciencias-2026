/* Slideshow reutilizável.
   Uso: <div class="slideshow" data-folder="img/1203/" data-prefix="frame-" data-ext="png"
             data-total="10" data-ratio="3/2" data-label="Slide"></div>
   Arquivos esperados: {folder}{prefix}{1..total}.{ext}
   Opcionais: data-interval (ms, padrão 4000), data-ratio (padrão 16/10). */
document.querySelectorAll('.slideshow[data-total]').forEach(root => {
  const total = +root.dataset.total;
  const folder = root.dataset.folder || '';
  const prefix = root.dataset.prefix || 'foto-';
  const ext = root.dataset.ext || 'jpg';
  const intervalo = +(root.dataset.interval || 4000);
  const label = root.dataset.label || 'Foto';
  const arquivos = Array.from({length: total}, (_, i) => `${folder}${prefix}${i + 1}.${ext}`);

  root.innerHTML = `
    <div class="stage">
      <img alt="">
      <div class="ph"><b></b><span>Imagem não encontrada. Coloque o arquivo em <code></code></span></div>
      <button class="arrow prev" aria-label="Anterior">‹</button>
      <button class="arrow next" aria-label="Próximo">›</button>
      <div class="counter"></div>
    </div>
    <div class="controls"><button class="play">▶ Reproduzir</button><span>Troca a cada ${intervalo / 1000} segundos</span></div>
    <div class="thumbs"></div>`;

  const stage = root.querySelector('.stage');
  stage.style.aspectRatio = root.dataset.ratio || '16/10';
  const img = stage.querySelector('img'), ph = stage.querySelector('.ph');
  const counter = stage.querySelector('.counter'), thumbs = root.querySelector('.thumbs');
  const play = root.querySelector('.play');
  let atual = 0, timer = null;

  arquivos.forEach((src, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', `${label} ${i + 1}`);
    const im = document.createElement('img');
    im.src = src; im.alt = ''; im.loading = 'lazy';
    im.onerror = () => { im.remove(); b.textContent = i + 1; };
    b.appendChild(im);
    b.onclick = () => ir(i);
    thumbs.appendChild(b);
  });

  function ir(i) {
    atual = (i + total) % total;
    ph.style.display = 'none'; img.style.display = 'block';
    img.src = arquivos[atual];
    img.alt = `${label} ${atual + 1} de ${total}`;
    counter.textContent = `${atual + 1} / ${total}`;
    [...thumbs.children].forEach((b, j) => b.classList.toggle('active', j === atual));
    const t = thumbs.children[atual];
    thumbs.scrollTo({left: t.offsetLeft - thumbs.clientWidth / 2 + t.clientWidth / 2, behavior: 'smooth'});
  }
  img.onerror = () => {
    img.style.display = 'none'; ph.style.display = 'flex';
    ph.querySelector('b').textContent = atual + 1;
    ph.querySelector('code').textContent = arquivos[atual];
  };

  root.querySelector('.prev').onclick = () => ir(atual - 1);
  root.querySelector('.next').onclick = () => ir(atual + 1);
  play.onclick = () => {
    if (timer) { clearInterval(timer); timer = null; play.textContent = '▶ Reproduzir'; }
    else { timer = setInterval(() => ir(atual + 1), intervalo); play.textContent = '❚❚ Pausar'; }
  };
  document.addEventListener('keydown', e => {
    const r = root.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return; /* só reage se o slideshow estiver na tela */
    if (e.key === 'ArrowLeft') ir(atual - 1);
    if (e.key === 'ArrowRight') ir(atual + 1);
  });
  ir(0);
});
