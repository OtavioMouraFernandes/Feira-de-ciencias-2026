/* Player de vídeo no padrão do site.
   Uso: <div class="yt" data-id="ID_DO_VIDEO" data-title="Título do vídeo"></div>
   O ID é o trecho depois de /embed/ no código de incorporação do YouTube.
   O vídeo só é carregado quando a pessoa clica, o que deixa a página mais leve. */
document.querySelectorAll('.yt[data-id]').forEach(el => {
  const id = el.dataset.id;
  const titulo = el.dataset.title || 'Vídeo';
  const btn = document.createElement('button');
  btn.className = 'yt-btn';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Assistir: ' + titulo);
  btn.style.backgroundImage =
    `url(https://i.ytimg.com/vi/${id}/hqdefault.jpg), linear-gradient(135deg,#0c3850,#07364d)`;
  btn.innerHTML = '<span class="yt-play" aria-hidden="true"></span><span class="yt-label">Assistir ao vídeo</span>';
  btn.onclick = () => {
    /* O player sempre é exibido dentro do site. Atenção: abrindo o arquivo direto do computador
       (file://), o YouTube recusa o embed (erro 153). Teste por um servidor local ou publicado. */
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
    f.title = titulo;
    f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    f.referrerPolicy = 'strict-origin-when-cross-origin';
    f.allowFullscreen = true;
    el.replaceChildren(f);
  };
  el.appendChild(btn);
});
