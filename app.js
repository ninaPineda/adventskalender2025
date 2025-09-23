const lsKey='advent_opened_v1';
const opened=new Set(JSON.parse(localStorage.getItem(lsKey)||'[]'));

function today(){ const v=fakeDate.value; return v?new Date(v+'T00:00:00'):new Date(); }
function dayNumber(d){ return d.getMonth()===11 ? Math.min(d.getDate(),24) : 24; }

function buildDoors(){
  doors.innerHTML='';
  const canOpen=dayNumber(today());
  for(let i=1;i<=24;i++){
    const b=document.createElement('button'); b.className='door'; b.dataset.day=i; b.textContent=i;
    if(i>canOpen) b.classList.add('locked');
    if(opened.has(i)) b.classList.add('opened');
    b.onclick=handleDoor; doors.appendChild(document.createElement('li')).appendChild(b);
  }
  openedCount.textContent=opened.size;
}

function handleDoor(e){
  const day=+e.currentTarget.dataset.day;
  if(e.currentTarget.classList.contains('locked')) return;
  const c=dayContents[day]||{title:`Tag ${day}`,html:`<p>Kein Inhalt… noch.</p>`};
  modalBody.innerHTML=`<h2>${c.title}</h2>${c.html}`; doorModal.showModal();
  if(!opened.has(day)){ opened.add(day); localStorage.setItem(lsKey,JSON.stringify([...opened]));
    e.currentTarget.classList.add('opened'); openedCount.textContent=opened.size; }
}

modalClose.onclick=()=>doorModal.close();
resetBtn.onclick=()=>{ localStorage.removeItem(lsKey); opened.clear(); buildDoors(); }
fakeDate.onchange=buildDoors;
buildDoors();

const dayContents={
  1:{title:"1. Dezember",html:`<p>Willkommen! ❄️</p>`},
  2:{title:"2. Dezember",html:`<p>Rätsel hier.</p>`},
  3:{title:"3. Dezember",html:`<p>Mini-Spiel später.</p>`}
};