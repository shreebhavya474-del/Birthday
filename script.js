/* ───
   Project: Secret Birthday Gift
   Compatibility fixes for the supplied current index.html and style.css
   Keeps the existing page design; no audio.
─── */

/* ─── BACKGROUND MOTES & PETALS ─── */
(function createBackground() {
  const bg = document.getElementById('bg-ambient');
  if (!bg) return;

  for (let i = 0; i < 16; i++) {
    const mote = document.createElement('div');
    mote.className = 'candle-mote';
    const size = Math.random() * 5 + 3;
    mote.style.cssText = `width:${size}px;height:${size}px;left:${Math.random() * 100}%;bottom:${Math.random() * 25}%;--md:${Math.random() * 5 + 6}s;--mdelay:-${Math.random() * 6}s;`;
    bg.appendChild(mote);
  }

  const petalColors = ['#8a1528', '#6b0f1d', '#a82035', '#4f0b15'];
  for (let i = 0; i < 16; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.style.cssText = `left:${Math.random() * 105}%;width:${Math.random() * 12 + 10}px;height:${Math.random() * 14 + 12}px;background:${petalColors[Math.floor(Math.random() * petalColors.length)]};--pd:${Math.random() * 4 + 5}s;--pdelay:-${Math.random() * 7}s;`;
    bg.appendChild(petal);
  }
})();

/* ─── PASSCODE ─── */
const TARGET_PASSCODE = '2009';
const SHINCHAN_IMAGES = {
  ask: 'shinchan-birthday.png',
  wrong: 'shinchan-wrong.png'
};
const DANCE_GIF_URL = 'shinchan-dance.gif';
const PLEADING_GIF_URL = 'shinchan-pleading.gif';
const EXCITED_GIF_URL = 'shinchan-excited.gif';

let enteredDigits = '';

function updateDateBoxes() {
  for (let i = 0; i < 4; i++) {
    const box = document.getElementById(`b${i}`);
    if (!box) continue;
    box.textContent = enteredDigits[i] || '';
    box.classList.toggle('active', i === enteredDigits.length && enteredDigits.length < 4);
  }
}

function pressKey(num) {
  if (!/^\d$/.test(String(num)) || enteredDigits.length >= 4) return;
  enteredDigits += String(num);
  updateDateBoxes();
  if (enteredDigits.length === 4) setTimeout(submitBirthdayDate, 220);
}

function deleteDigit() {
  if (!enteredDigits.length) return;
  enteredDigits = enteredDigits.slice(0, -1);
  updateDateBoxes();
}

function submitBirthdayDate() {
  const img = document.getElementById('shinchan-img');
  const txt = document.getElementById('quiz-text');
  const card = document.querySelector('.quiz-card');
  const keypad = document.querySelector('.keypad');
  const retryBtn = document.getElementById('retry-btn');
  const quizScreen = document.getElementById('quiz-screen');
  const surpriseScreen = document.getElementById('surprise-screen');

  if (enteredDigits.length < 4) {
    if (txt) txt.textContent = 'Please enter all 4 digits! ✨';
    if (card) {
      card.classList.remove('shake');
      void card.offsetWidth;
      card.classList.add('shake');
    }
    return;
  }

  if (enteredDigits === TARGET_PASSCODE) {
    const danceGif = document.getElementById('dance-gif');
    if (danceGif) danceGif.src = DANCE_GIF_URL;

    const archText = document.getElementById('arch-text-path');
    if (archText) archText.textContent = 'I have made something for you';

    const textEl = document.querySelector('.arched-text');
    if (textEl) textEl.classList.remove('excited-mode');
    triggerTitleAnim('anim-wave-drop');

    const promptEl = document.getElementById('surprise-prompt');
    if (promptEl) {
      promptEl.style.display = 'block';
      promptEl.textContent = 'Do you wanna see it?';
      triggerElementAnim(promptEl, 'prompt-entrance-pop');
    }

    const danceWrap = document.querySelector('.dance-gif-wrap');
    if (danceWrap) triggerElementAnim(danceWrap, 'gif-entrance-pop');

    const btnGroup = document.getElementById('surprise-buttons');
    if (btnGroup) {
      btnGroup.innerHTML = `
        <button id="btn-yes" class="pill-btn yes-btn" onclick="handleChoice('yes')">
          <span class="btn-shine-tr"></span><span class="btn-label">YES</span><span class="btn-shine-bl"></span>
        </button>
        <button id="btn-no" class="pill-btn no-btn" onclick="handleChoice('no')">
          <span class="btn-shine-tr"></span><span class="btn-label">NO</span><span class="btn-shine-bl"></span>
        </button>`;
      triggerElementAnim(btnGroup, 'btn-entrance-bounce');
    }

    if (quizScreen) {
      quizScreen.classList.remove('show');
      quizScreen.classList.add('hidden');
    }
    if (surpriseScreen) {
      surpriseScreen.classList.remove('hidden-screen');
      surpriseScreen.classList.add('show-screen');
    }
    launchConfetti();
  } else {
    if (img) img.src = SHINCHAN_IMAGES.wrong;
    if (txt) txt.textContent = 'Oops! Wrong passcode! Try again 🥺';
    if (card) {
      card.classList.remove('shake');
      void card.offsetWidth;
      card.classList.add('shake');
    }
    if (keypad) keypad.classList.add('hidden-btn');
    if (retryBtn) retryBtn.classList.remove('hidden-btn');
  }
}

function resetQuiz() {
  enteredDigits = '';
  updateDateBoxes();
  const img = document.getElementById('shinchan-img');
  const txt = document.getElementById('quiz-text');
  const keypad = document.querySelector('.keypad');
  const retryBtn = document.getElementById('retry-btn');
  if (img) img.src = SHINCHAN_IMAGES.ask;
  if (txt) txt.textContent = 'Enter the secret 4-digit code to unlock 🎀';
  if (keypad) keypad.classList.remove('hidden-btn');
  if (retryBtn) retryBtn.classList.add('hidden-btn');
}

/* ─── OPTIONAL ENTRANCE ANIMATIONS ─── */
function triggerTitleAnim(animClass) {
  const svg = document.querySelector('.curved-title-svg');
  if (!svg) return;
  svg.classList.remove('anim-wave-drop', 'anim-excited-bounce');
  svg.style.animation = 'none';
  void svg.offsetWidth;
  svg.style.animation = '';
  svg.classList.add(animClass);
}

function triggerElementAnim(element, animClass) {
  if (!element) return;
  element.classList.remove(animClass);
  element.style.animation = 'none';
  void element.offsetWidth;
  element.style.animation = '';
  element.classList.add(animClass);
}

/* ─── YES / NO SURPRISE ─── */
function handleChoice(choice) {
  const danceGif = document.getElementById('dance-gif');

  if (choice === 'no') {
    if (danceGif) danceGif.src = PLEADING_GIF_URL;
    const promptEl = document.getElementById('surprise-prompt');
    if (promptEl) {
      promptEl.textContent = 'Are you sure? 🥺 Please say YES! 💖';
      triggerElementAnim(promptEl, 'prompt-entrance-pop');
    }
    const noBtn = document.getElementById('btn-no');
    if (noBtn) {
      noBtn.style.animation = 'none';
      void noBtn.offsetWidth;
      noBtn.style.animation = 'cardShake 0.4s ease';
    }
    return;
  }

  const archText = document.getElementById('arch-text-path');
  if (archText) archText.textContent = 'Are you really excited?';
  const textEl = document.querySelector('.arched-text');
  if (textEl) textEl.classList.add('excited-mode');
  triggerTitleAnim('anim-excited-bounce');

  if (danceGif) danceGif.src = EXCITED_GIF_URL;
  const danceWrap = document.querySelector('.dance-gif-wrap');
  if (danceWrap) triggerElementAnim(danceWrap, 'gif-entrance-pop');
  const promptEl = document.getElementById('surprise-prompt');
  if (promptEl) promptEl.style.display = 'none';

  const btnGroup = document.getElementById('surprise-buttons');
  if (btnGroup) {
    btnGroup.innerHTML = `
      <button class="pill-btn yes-btn" onclick="handleExcitedChoice()"><span class="btn-shine-tr"></span><span class="btn-label">YES</span><span class="btn-shine-bl"></span></button>
      <button class="pill-btn yes-btn" onclick="handleExcitedChoice()"><span class="btn-shine-tr"></span><span class="btn-label">YES</span><span class="btn-shine-bl"></span></button>`;
    triggerElementAnim(btnGroup, 'btn-entrance-bounce');
  }
}

function handleExcitedChoice() {
  launchConfetti();
  const surpriseScreen = document.getElementById('surprise-screen');
  const giftScreen = document.getElementById('gift-screen');

  setTimeout(() => {
    if (surpriseScreen) {
      surpriseScreen.classList.remove('show-screen');
      surpriseScreen.classList.add('hidden-screen');
    }
    if (giftScreen) {
      giftScreen.classList.remove('hidden-screen');
      giftScreen.classList.add('show-screen');
      launchConfetti();
    }
  }, 400);
}

/* ─── CONFETTI ─── */
function launchConfetti() {
  const layer = document.getElementById('confetti-layer');
  if (!layer) return;
  const colors = ['#ff6b9d', '#ffd700', '#ff4db8', '#00bcd4', '#69f0ae', '#ff5722'];

  for (let i = 0; i < 55; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti';
    const size = Math.random() * 8 + 5;
    piece.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size * 1.4}px;background:${colors[Math.floor(Math.random() * colors.length)]};border-radius:${Math.random() > 0.5 ? '50%' : '3px'};--dur:${Math.random() * 2 + 2}s;--drift:${Math.random() * 100 - 50}px;`;
    layer.appendChild(piece);
    piece.addEventListener('animationend', () => piece.remove(), { once: true });
  }
}

/* ─── MEMORY GALLERY ─── */
function openMemoriesModal() {
  launchConfetti();
  const modal = document.getElementById('memories-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  const container = document.getElementById('memories-board-container');
  if (container) {
    container.style.animation = 'none';
    void container.offsetWidth;
    container.style.animation = 'clotheslineDropIn 0.55s cubic-bezier(0.34, 1.35, 0.64, 1)';
  }
  const track = document.getElementById('clothesline-photos-track');
  if (track) track.scrollTo({ left: 0, behavior: 'smooth' });
}

function closeMemoriesModal() {
  const modal = document.getElementById('memories-modal');
  if (modal) modal.classList.add('hidden');
}

function scrollClothesline(direction) {
  const track = document.getElementById('clothesline-photos-track');
  if (track) track.scrollBy({ left: 260 * direction, behavior: 'smooth' });
}

function focusHangingPhoto(element) {
  if (!element) return;
  launchConfetti();
  element.classList.add('active-sway');
  setTimeout(() => element.classList.remove('active-sway'), 1200);
}

/* ─── BIRTHDAY CAKE ─── */
let isWishMade = false;
let blownCandlesCount = 0;

function openCakeModal() {
  launchConfetti();
  resetCake();
  const modal = document.getElementById('cake-modal');
  if (modal) modal.classList.remove('hidden');
}

function closeCakeModal() {
  const modal = document.getElementById('cake-modal');
  if (modal) modal.classList.add('hidden');
}

function blowCandle(num, event) {
  if (event) event.stopPropagation();
  if (isWishMade) return;
  const flame = document.getElementById(`flame-${num}`);
  if (!flame || flame.classList.contains('blown')) return;

  flame.classList.add('blown');
  blownCandlesCount++;
  if (blownCandlesCount >= 7) {
    const wishButton = document.getElementById('cake-wish-button');
    if (wishButton) wishButton.disabled = false;
    const hint = document.getElementById('cake-footer-hint');
    if (hint) hint.textContent = 'All candles are out! Make your birthday wish ✨';
  }
}

function makeCakeWish(event) {
  if (event) event.stopPropagation();
  if (isWishMade || blownCandlesCount < 7) return;
  isWishMade = true;

  for (let i = 1; i <= 7; i++) {
    const flame = document.getElementById(`flame-${i}`);
    if (flame) flame.classList.add('blown');
  }
  launchConfetti();
  setTimeout(launchConfetti, 350);

  const hint = document.getElementById('cake-footer-hint');
  if (hint) hint.style.display = 'none';
  const wishButton = document.getElementById('cake-wish-button');
  if (wishButton) wishButton.disabled = true;
  const banner = document.getElementById('cake-wish-banner');
  if (banner) banner.classList.remove('hidden');
}

function resetCake() {
  isWishMade = false;
  blownCandlesCount = 0;
  for (let i = 1; i <= 7; i++) {
    const flame = document.getElementById(`flame-${i}`);
    if (flame) flame.classList.remove('blown');
  }
  const hint = document.getElementById('cake-footer-hint');
  if (hint) {
    hint.style.display = 'block';
    hint.textContent = '7 candles • 7 wishes • one wonderful day';
  }
  const wishButton = document.getElementById('cake-wish-button');
  if (wishButton) wishButton.disabled = true;
  const banner = document.getElementById('cake-wish-banner');
  if (banner) banner.classList.add('hidden');
}

/* ─── THREE MYSTERY GIFTS ─── */
function openMysteryBox(boxNum) {
  if (boxNum === 1) return openMemoriesModal();
  if (boxNum === 2) return openCakeModal();
  if (boxNum === 3) return openLetterModal();
}

/* ─── BIRTHDAY LETTER / TYPEWRITER ─── */
const LETTER_SECTIONS = [
  { id: 'letter-headline-el', text: 'Happy birthday to my favourite\nperson! ❤️' },
  { id: 'letter-p1-el', text: "I hope this year brings you everything you've been wishing for and so much more. Thank you for making my days happier, my bad days easier, and my life a little more beautiful just by being in it. 🥺💖" },
  { id: 'letter-p2-el', text: "I'm so lucky to have you, and I can't wait to make a million more memories with you. Here's to you, your dreams, and all the happiness you deserve." },
  { id: 'letter-closing-el', text: 'Happy birthday, my love. I love you more than you know. 🫶🏻🎂❤️' }
];

let letterTypewriterTimer = null;
let isLetterTyping = false;

function renderLetterInstant() {
  if (letterTypewriterTimer) clearTimeout(letterTypewriterTimer);
  letterTypewriterTimer = null;
  isLetterTyping = false;
  LETTER_SECTIONS.forEach(section => {
    const element = document.getElementById(section.id);
    if (element) element.innerHTML = section.text.replace(/\n/g, '<br>');
  });
  const cursor = document.getElementById('letter-typing-cursor');
  if (cursor) cursor.remove();
}

function skipLetterTypewriter() {
  if (isLetterTyping) renderLetterInstant();
}

function startLetterTypewriter() {
  if (letterTypewriterTimer) clearTimeout(letterTypewriterTimer);
  letterTypewriterTimer = null;
  isLetterTyping = true;

  LETTER_SECTIONS.forEach(section => {
    const element = document.getElementById(section.id);
    if (element) element.innerHTML = '';
  });

  let cursor = document.getElementById('letter-typing-cursor');
  if (!cursor) {
    cursor = document.createElement('span');
    cursor.id = 'letter-typing-cursor';
    cursor.className = 'typewriter-cursor';
  }

  let sectionIndex = 0;
  let charIndex = 0;

  function typeNextChar() {
    if (!isLetterTyping) return;
    if (sectionIndex >= LETTER_SECTIONS.length) {
      isLetterTyping = false;
      setTimeout(() => {
        if (cursor && cursor.parentNode) cursor.remove();
      }, 1600);
      return;
    }

    const section = LETTER_SECTIONS[sectionIndex];
    const element = document.getElementById(section.id);
    const chars = Array.from(section.text);

    if (charIndex < chars.length) {
      const character = chars[charIndex++];
      if (element) {
        if (character === '\n') element.appendChild(document.createElement('br'));
        else element.appendChild(document.createTextNode(character));
        element.appendChild(cursor);
      }
      const delay = ['.', '!', '?', '💖'].includes(character) ? 110 : character === ',' ? 50 : 16;
      letterTypewriterTimer = setTimeout(typeNextChar, delay);
    } else {
      sectionIndex++;
      charIndex = 0;
      letterTypewriterTimer = setTimeout(typeNextChar, 140);
    }
  }

  letterTypewriterTimer = setTimeout(typeNextChar, 380);
}

function openLetterModal() {
  launchConfetti();
  const modal = document.getElementById('letter-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  const card = modal.querySelector('.letter-card-container');
  if (card) {
    card.classList.remove('animate-letter');
    void card.offsetWidth;
    card.classList.add('animate-letter');
  }
  startLetterTypewriter();
}

function closeLetterModal() {
  if (letterTypewriterTimer) clearTimeout(letterTypewriterTimer);
  letterTypewriterTimer = null;
  isLetterTyping = false;
  const modal = document.getElementById('letter-modal');
  if (modal) modal.classList.add('hidden');
}

function handleLetterOverlayClick(event) {
  if (event.target.id === 'letter-modal' || event.target.classList.contains('letter-bg-backdrop')) {
    closeLetterModal();
  }
}

/* ─── KEYBOARD SUPPORT ─── */
window.addEventListener('keydown', event => {
  const letterModal = document.getElementById('letter-modal');
  if (letterModal && !letterModal.classList.contains('hidden')) {
    if (event.key === 'Escape') closeLetterModal();
    return;
  }

  const cakeModal = document.getElementById('cake-modal');
  if (cakeModal && !cakeModal.classList.contains('hidden')) {
    if (event.key === 'Escape') closeCakeModal();
    return;
  }

  const memoriesModal = document.getElementById('memories-modal');
  if (memoriesModal && !memoriesModal.classList.contains('hidden')) {
    if (event.key === 'ArrowRight') scrollClothesline(1);
    else if (event.key === 'ArrowLeft') scrollClothesline(-1);
    else if (event.key === 'Escape') closeMemoriesModal();
    return;
  }

  const quizScreen = document.getElementById('quiz-screen');
  if (!quizScreen || !quizScreen.classList.contains('show')) return;
  if (/^\d$/.test(event.key)) pressKey(event.key);
  else if (event.key === 'Backspace') deleteDigit();
  else if (event.key === 'Enter') submitBirthdayDate();
});

/* ─── INITIALIZE ─── */
updateDateBoxes();
