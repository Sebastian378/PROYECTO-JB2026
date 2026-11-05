const WHATSAPP_NUMBER = "573046580213";

const scenes = [...document.querySelectorAll(".scene")];
const progressFill = document.querySelector("#progress-fill");
const progressLabel = document.querySelector("#progress-label");
const song = document.querySelector("#song");
const playToggle = document.querySelector("#play-toggle");
const playIcon = document.querySelector("#play-icon");
const audioProgress = document.querySelector("#audio-progress");
const volumeControl = document.querySelector("#volume-control");
const audioStatus = document.querySelector("#audio-status");
const questionTitle = document.querySelector("#title-4");
const questionCount = document.querySelector("#question-count");
const answerList = document.querySelector("#answer-list");
const answerFeedback = document.querySelector("#answer-feedback");
const questionNext = document.querySelector("#question-next");
const finalNote = document.querySelector("#final-note");

const questions = [
  {
    question: "¿Es ilegal<br><em>extrañar a alguien?</em>",
    answers: [
      { label: "No, pero debería pagar multa.", reply: "Y la multa se paga invitándome a un cafecito 😌" },
      { label: "Depende... ¿a quién extrañas?", reply: "Uy, qué pregunta tan específica. Digamos que a alguien con una J 👀" }
    ]
  },
  {
    question: "¿No me has pensado<br><em>en lo absoluto?</em>",
    answers: [
      { label: "Ni un poquito. (guiño)", reply: "Ese guiño te delató, Juana. Caso cerrado 🕵️" },
      { label: "Tal vez un poquito.", reply: "Acepto ese poquito y lo guardo con cariño." }
    ]
  },
  {
    question: "Si extrañarme fuera deporte,<br><em>¿ya estarías en la Selección?</em>",
    answers: [
      { label: "Titular indiscutible.", reply: "Con razón tanta resistencia para no escribirme 😂" },
      { label: "Apenas calentando.", reply: "Bueno, te espero en la cancha. Sin VAR y sin presión 😌" }
    ]
  }
];

let activeQuestion = 0;

function showScene(number) {
  scenes.forEach((scene, index) => {
    const active = index === number - 1;
    scene.hidden = !active;
    scene.classList.toggle("is-active", active);
  });
  progressFill.style.width = `${(number / scenes.length) * 100}%`;
  progressLabel.textContent = `${String(number).padStart(2, "0")} / ${String(scenes.length).padStart(2, "0")}`;
  const activeScene = document.querySelector(`#scene-${number}`);
  activeScene.querySelector("h1, h2")?.focus({ preventScroll: true });
  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  window.scrollTo({ top: 0, behavior });
}

document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.next === "2") {
      song.volume = Number(volumeControl.value);
      song.play().then(() => {
        audioStatus.textContent = "La canción seguirá sonando mientras avanzas.";
        audioStatus.classList.remove("has-error");
      }).catch(() => {
        audioStatus.textContent = "No encontré el MP3. Revisa la carpeta assets y vuelve a intentarlo con ▶.";
        audioStatus.classList.add("has-error");
      });
    }
    showScene(Number(button.dataset.next));
  });
});

playToggle.addEventListener("click", () => {
  if (song.paused) {
    song.play().then(() => {
      audioStatus.textContent = "La canción seguirá sonando mientras avanzas.";
      audioStatus.classList.remove("has-error");
    }).catch(() => {
      audioStatus.textContent = "No encontré el MP3. Revisa la carpeta assets y vuelve a intentarlo.";
      audioStatus.classList.add("has-error");
    });
  } else {
    song.pause();
  }
});

song.addEventListener("play", () => {
  playIcon.textContent = "Ⅱ";
  playToggle.setAttribute("aria-label", "Pausar canción");
});

song.addEventListener("pause", () => {
  playIcon.textContent = "▶";
  playToggle.setAttribute("aria-label", "Reproducir canción");
});

song.addEventListener("timeupdate", () => {
  if (Number.isFinite(song.duration) && song.duration > 0) {
    audioProgress.style.width = `${(song.currentTime / song.duration) * 100}%`;
  }
});

song.addEventListener("error", () => {
  audioStatus.textContent = "No encontré el MP3. Revisa que esté guardado como assets/tabaco.mp3.";
  audioStatus.classList.add("has-error");
});

volumeControl.addEventListener("input", () => {
  song.volume = Number(volumeControl.value);
});

function renderQuestion() {
  const question = questions[activeQuestion];
  questionCount.textContent = `pregunta ${String(activeQuestion + 1).padStart(2, "0")} de ${String(questions.length).padStart(2, "0")}`;
  questionTitle.innerHTML = question.question;
  answerFeedback.textContent = "";
  questionNext.hidden = true;
  answerList.replaceChildren();

  question.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.className = "answer-option";
    button.type = "button";
    button.textContent = answer.label;
    button.addEventListener("click", () => {
      answerList.querySelectorAll("button").forEach((option) => {
        option.disabled = true;
        option.classList.toggle("is-selected", option === button);
      });
      answerFeedback.textContent = answer.reply;
      questionNext.hidden = false;
      questionNext.textContent = activeQuestion === questions.length - 1 ? "Ahora sí, en serio" : "Siguiente pregunta";
    });
    answerList.append(button);
  });
}

questionNext.addEventListener("click", () => {
  if (activeQuestion < questions.length - 1) {
    activeQuestion += 1;
    renderQuestion();
    questionTitle.focus({ preventScroll: true });
  } else {
    showScene(5);
  }
});

function openWhatsApp(message) {
  if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
    finalNote.textContent = "Para que llegue a tu chat, agrega tu número con código de país en WHATSAPP_NUMBER, en script.js.";
    finalNote.classList.add("configuration-note");
    return;
  }

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
  finalNote.textContent = "Tu WhatsApp se abrirá con el mensaje listo para enviar 💌";
  finalNote.classList.remove("configuration-note");
}

document.querySelectorAll("[data-answer]").forEach((button) => {
  button.addEventListener("click", () => {
    const isYes = button.dataset.answer === "yes";
    openWhatsApp(isYes ? "hola mi amor veamos💕🥰" : "sebas no🥺");
  });
});

renderQuestion();
