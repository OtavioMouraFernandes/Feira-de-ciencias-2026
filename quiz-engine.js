/* Quiz reutilizável.
   Uso: iniciarQuiz(elemento, [{q:'Pergunta', o:['A','B','C','D'], c:1, e:'Explicação'}, ...])
   q = pergunta, o = opções, c = índice da opção correta (começa em 0), e = explicação. */
function iniciarQuiz(raiz, perguntas) {
  raiz.innerHTML = `
    <div class="progress"><i></i></div>
    <div class="qcount"></div>
    <div class="area"></div>`;
  const bar = raiz.querySelector('.progress i');
  const qcount = raiz.querySelector('.qcount');
  const area = raiz.querySelector('.area');
  let i = 0, pontos = 0;

  function mostrar() {
    const p = perguntas[i];
    bar.style.width = (i / perguntas.length * 100) + '%';
    qcount.textContent = `Pergunta ${i + 1} de ${perguntas.length}`;
    area.innerHTML = '';
    const h = document.createElement('h2');
    h.textContent = p.q;
    area.appendChild(h);

    const opts = document.createElement('div');
    opts.className = 'opts';
    const exp = document.createElement('div');
    exp.className = 'explain-box';
    const prox = document.createElement('button');
    prox.className = 'btn';
    prox.style.display = 'none';
    prox.textContent = i === perguntas.length - 1 ? 'Ver resultado' : 'Próxima pergunta';
    prox.onclick = () => { i++; i < perguntas.length ? mostrar() : final(); };

    p.o.forEach((t, k) => {
      const b = document.createElement('button');
      b.className = 'opt';
      b.textContent = t;
      b.onclick = () => {
        [...opts.children].forEach((x, j) => {
          x.disabled = true;
          if (j === p.c) x.classList.add('correct');
          else if (j === k) x.classList.add('wrong');
        });
        if (k === p.c) pontos++;
        exp.textContent = (k === p.c ? 'Correto! ' : 'Não foi dessa vez. ') + p.e;
        exp.classList.add('show');
        prox.style.display = 'inline-block';
      };
      opts.appendChild(b);
    });
    area.append(opts, exp, prox);
  }

  function final() {
    bar.style.width = '100%';
    qcount.textContent = 'Quiz concluído';
    const n = perguntas.length;
    const msg = pontos >= n * 0.9 ? 'Excelente! Você entendeu muito bem o trabalho da turma.'
      : pontos >= n * 0.6 ? 'Muito bom! Você já sabe bastante.'
      : 'Reveja o vídeo e os slides da turma e tente de novo.';
    area.innerHTML = `<div class="result"><p>Você acertou</p><div class="score">${pontos}/${n}</div><p>${msg}</p><button class="btn again">Refazer o quiz</button></div>`;
    area.querySelector('.again').onclick = () => { i = 0; pontos = 0; mostrar(); };
  }
  mostrar();
}
