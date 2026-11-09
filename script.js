/* Secret Birthday Gift — reconstructed script. No audio is used. */
"use strict";
const TARGET_PASSCODE = "2009";
const SHINCHAN_GIFS = { ask:"shinchan-birthday.png", wrong:"shinchan-wrong.png" };
const DANCE_GIF_URL = "shinchan-dance.gif";
const PLEADING_GIF_URL = "shinchan-pleading.gif";
const EXCITED_GIF_URL = "shinchan-excited.gif";
let enteredDigits = "";
let blownCandlesCount = 0;
let isWishMade = false;
let letterTimer = null;
let confettiTimer = null;

function $(id){return document.getElementById(id)}
function setScreen(id, activeClass, inactiveClass){
  const el=$(id); if(!el)return;
  el.classList.remove(inactiveClass); el.classList.add(activeClass);
}
function hideScreen(id, inactiveClass, activeClass){
  const el=$(id); if(!el)return;
  el.classList.remove(activeClass); el.classList.add(inactiveClass);
}
function updateDateBoxes(){
  for(let i=0;i<4;i++){
    const box=$("b"+i); if(!box)continue;
    box.textContent=enteredDigits[i] ? "●" : "";
    box.classList.toggle("active",i===enteredDigits.length);
  }
}
function pressKey(digit){
  if(enteredDigits.length>=4)return;
  enteredDigits+=String(digit); updateDateBoxes();
  if(enteredDigits.length===4) submitBirthdayDate();
}
function deleteDigit(){enteredDigits=enteredDigits.slice(0,-1);updateDateBoxes();if($("quiz-feedback"))$("quiz-feedback").textContent=""}
function submitBirthdayDate(){
  if(enteredDigits.length!==4)return;
  if(enteredDigits===TARGET_PASSCODE){
    if($("quiz-feedback"))$("quiz-feedback").textContent="Unlocked! 🎉";
    const q=$("quiz-screen"); q?.classList.remove("show"); q?.classList.add("hidden");
    setTimeout(()=>{hideScreen("surprise-screen","hidden-screen","show-screen");launchConfetti(65)},350);
  }else{
    if($("quiz-feedback"))$("quiz-feedback").textContent="Oops! That's not the secret code. Try again 💗";
    const img=$("shinchan-img");if(img)img.src=SHINCHAN_GIFS.wrong;
    $("retry-btn")?.classList.remove("hidden-btn");
    $("quiz-card")?.classList.add("shake");
    setTimeout(()=>$("quiz-card")?.classList.remove("shake"),500);
  }
}
function resetQuiz(){
  enteredDigits="";updateDateBoxes();
  if($("quiz-feedback"))$("quiz-feedback").textContent="";
  $("retry-btn")?.classList.add("hidden-btn");
  const img=$("shinchan-img");if(img)img.src=SHINCHAN_GIFS.ask;
}
function handleChoice(choice){
  const gif=$("dance-gif"),prompt=$("surprise-prompt"),buttons=$("surprise-buttons");
  if(choice==="no"){
    if(gif)gif.src=PLEADING_GIF_URL;
    if(prompt)prompt.textContent="Aww, are you sure? Give the surprise a chance! 🥺";
    return;
  }
  if(gif)gif.src=EXCITED_GIF_URL;
  if(prompt)prompt.textContent="Yay! One more time… are you REALLY excited? ✨";
  if(buttons)buttons.innerHTML='<button class="pill-btn" onclick="handleExcitedChoice()"><span class="btn-label">YES!!</span></button><button class="pill-btn" onclick="handleExcitedChoice()"><span class="btn-label">YES!!</span></button>';
  const path=$("arch-text-path");if(path)path.textContent="Are you really excited?";
}
function handleExcitedChoice(){
  hideScreen("surprise-screen","hidden-screen","show-screen");
  setTimeout(()=>{setScreen("gift-screen","show-screen","hidden-screen");launchConfetti(90)},350);
}
function launchConfetti(count=45){
  const layer=$("confetti-layer");if(!layer)return;
  const colors=["#f26b8a","#ffd166","#8ecae6","#b8e0a5","#cdb4db","#ff9f1c"];
  for(let i=0;i<count;i++){
    const piece=document.createElement("i");piece.className="confetti";
    piece.style.left=Math.random()*100+"%";piece.style.background=colors[i%colors.length];
    piece.style.setProperty("--dur",(2.2+Math.random()*2.5)+"s");
    piece.style.setProperty("--drift",(Math.random()*180-90)+"px");
    piece.style.animationDelay=(Math.random()*.7)+"s";layer.appendChild(piece);
    setTimeout(()=>piece.remove(),5500);
  }
}
function openMysteryBox(number){
  if(number===1){openMemoriesModal();return}
  if(number===2){openCakeModal();return}
  if(number===3){openLetterModal();return}
}
function openMemoriesModal(){
  $("memories-modal")?.classList.remove("hidden");
  const track=$("clothesline-photos-track");if(track)track.scrollLeft=0;
}
function closeMemoriesModal(){$("memories-modal")?.classList.add("hidden")}
function scrollClothesline(direction){
  $("clothesline-photos-track")?.scrollBy({left:260*direction,behavior:"smooth"});
}
function focusHangingPhoto(el){
  document.querySelectorAll(".hanging-polaroid-item").forEach(item=>item.classList.remove("active-sway"));
  el.classList.add("active-sway");
}
function openCakeModal(){
  $("cake-modal")?.classList.remove("hidden");
  resetCake();
}
function closeCakeModal(){$("cake-modal")?.classList.add("hidden")}
function blowCandle(num,event){
  if(event){event.preventDefault();event.stopPropagation()}
  if(isWishMade)return;
  const flame=$("flame-"+num);
  if(flame&&!flame.classList.contains("blown")){
    flame.classList.add("blown");blownCandlesCount++;
    if($("cake-footer-hint"))$("cake-footer-hint").textContent=blownCandlesCount+" of 7 candles blown out ✨";
    if(blownCandlesCount===7&&$("cake-wish-button"))$("cake-wish-button").disabled=false;
  }
}
function makeCakeWish(event){
  if(event)event.stopPropagation();
  if(blownCandlesCount<7||isWishMade)return;
  isWishMade=true;
  const banner=$("cake-wish-banner");banner?.classList.remove("hidden");
  if($("cake-footer-hint"))$("cake-footer-hint").textContent="Your wish is on its way! 💫";
  const button=$("cake-wish-button");if(button)button.disabled=true;
  const title=$("cake-title");if(title)title.textContent="Happy Birthday! 🎉";
  launchConfetti(80);
}
function resetCake(){
  blownCandlesCount=0;isWishMade=false;
  for(let i=1;i<=7;i++)$("flame-"+i)?.classList.remove("blown");
  if($("cake-footer-hint"))$("cake-footer-hint").textContent="7 candles • 7 wishes • one wonderful day";
  if($("cake-wish-button"))$("cake-wish-button").disabled=true;
  $("cake-wish-banner")?.classList.add("hidden");
  if($("cake-title"))$("cake-title").textContent="Make a Birthday Wish! 🎂";
}
const LETTER_SECTIONS=[
 {id:"letter-headline-el",text:"Happy birthday to my favourite person! ❤️"},
 {id:"letter-p1-el",text:"I hope this year brings you everything you've been wishing for and so much more. Thank you for making days happier, bad days easier, and life a little more beautiful just by being you. 🥺💖"},
 {id:"letter-p2-el",text:"I'm so glad to have you in my life, and I hope we make a million more happy memories. Here's to you, your dreams, and all the happiness you deserve."},
 {id:"letter-closing-el",text:"Have the most wonderful birthday! 🫶🏻🎂❤️"}
];
function renderLetterInstant(){
  LETTER_SECTIONS.forEach(section=>{const el=$(section.id);if(el)el.textContent=section.text});
}
function skipLetterTypewriter(){clearInterval(letterTimer);letterTimer=null;renderLetterInstant();$("letter-skip-btn")?.classList.add("hidden-btn")}
function startLetterTypewriter(){
  clearInterval(letterTimer);
  LETTER_SECTIONS.forEach(s=>{const el=$(s.id);if(el)el.textContent=""});
  $("letter-skip-btn")?.classList.remove("hidden-btn");
  let sectionIndex=0,charIndex=0;
  letterTimer=setInterval(()=>{
    const section=LETTER_SECTIONS[sectionIndex],el=$(section.id);
    if(!section){clearInterval(letterTimer);letterTimer=null;$("letter-skip-btn")?.classList.add("hidden-btn");return}
    if(el)el.textContent=section.text.slice(0,++charIndex);
    if(charIndex>=section.text.length){sectionIndex++;charIndex=0}
  },22);
}
function openLetterModal(){$("letter-modal")?.classList.remove("hidden");startLetterTypewriter()}
function closeLetterModal(){clearInterval(letterTimer);letterTimer=null;$("letter-modal")?.classList.add("hidden")}
function handleLetterOverlayClick(event){if(event.target===$("letter-modal"))closeLetterModal()}

function createAmbient(){
  const area=$("bg-ambient");if(!area)return;
  for(let i=0;i<18;i++){
    const mote=document.createElement("span");mote.className="candle-mote";
    const size=3+Math.random()*5;mote.style.width=size+"px";mote.style.height=size+"px";
    mote.style.left=Math.random()*100+"%";mote.style.top=(45+Math.random()*55)+"%";
    mote.style.setProperty("--md",(6+Math.random()*8)+"s");mote.style.setProperty("--mdelay",(-Math.random()*12)+"s");area.appendChild(mote);
  }
  for(let i=0;i<10;i++){
    const petal=document.createElement("span");petal.className="petal";
    petal.style.left=Math.random()*100+"%";petal.style.setProperty("--pd",(8+Math.random()*9)+"s");
    petal.style.setProperty("--pdelay",(-Math.random()*15)+"s");area.appendChild(petal);
  }
}
function init(){
  updateDateBoxes();createAmbient();
  document.addEventListener("keydown",e=>{
    if(e.key==="Escape"){closeLetterModal();closeCakeModal();closeMemoriesModal();return}
    if(!$("quiz-screen")?.classList.contains("show"))return;
    if(/^\d$/.test(e.key))pressKey(e.key);
    else if(e.key==="Backspace")deleteDigit();
    else if(e.key==="Enter")submitBirthdayDate();
  });
}
document.addEventListener("DOMContentLoaded",init);
