'use strict';
const CONFIG_KEY='tiempoEsVida.config.v1';
const defaults={salaryType:'monthly',salary:'',hoursPerDay:8,daysPerWeek:5};
const $=id=>document.getElementById(id); let config=loadConfig(), priceValue=null, lastFocus=null, resetStage=0;
function loadConfig(){try{const v=JSON.parse(localStorage.getItem(CONFIG_KEY)||'null');const c={...defaults,...(v||{})};return validConfig(c)?c:{...defaults}}catch{return {...defaults}}}
function parseNumber(v){if(typeof v==='number')return v;let s=String(v??'').trim().replace(/[€\s]/g,'');if(!s)return NaN;if(s.includes(',')&&s.includes('.')){if(s.lastIndexOf(',')>s.lastIndexOf('.'))s=s.replace(/\./g,'').replace(',','.');else s=s.replace(/,/g,'')}else s=s.replace(',','.');return Number(s)}
function validConfig(c){const s=parseNumber(c.salary),h=Number(c.hoursPerDay),d=Number(c.daysPerWeek);return ['monthly','hourly'].includes(c.salaryType)&&Number.isFinite(s)&&s>0&&s<=1e7&&Number.isFinite(h)&&h>=1&&h<=24&&Number.isInteger(d)&&d>=1&&d<=7}
function hourly(c=config){const s=parseNumber(c.salary);return c.salaryType==='hourly'?s:(s*12)/(Number(c.hoursPerDay)*Number(c.daysPerWeek)*52)}
function money(n){return new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR',maximumFractionDigits:2}).format(n)}
function fmt(n,max=2){return new Intl.NumberFormat('es-ES',{maximumFractionDigits:max}).format(n)}
function plural(n,s,p){return `${n} ${n===1?s:p}`}
function formatUnits(totalMinutes,units){let remaining=Math.max(0,Math.round(totalMinutes));const values=units.map(([size,one,many])=>{const value=Math.floor(remaining/size);remaining-=value*size;return [value,one,many]});const parts=values.filter(([v])=>v>0).map(([v,one,many])=>`${fmt(v,0)} ${v===1?one:many}`);return parts.length?parts.join(', ').replace(/, ([^,]*)$/,' y $1'):'0 minutos'}
function duration(hours){
  if(!Number.isFinite(hours)||hours<0)return null;
  const totalMinutes=Math.max(0,Math.round(hours*60));
  const minutesPerWorkday=Number(config.hoursPerDay)*60;
  const totalWorkdays=totalMinutes/minutesPerWorkday;
  const wholeWorkdays=Math.floor(totalMinutes/minutesPerWorkday);
  const remainingMinutes=totalMinutes-wholeWorkdays*minutesPerWorkday;
  const remainderHours=Math.floor(remainingMinutes/60);
  const remainderMins=remainingMinutes%60;
  const workYears=Math.floor(wholeWorkdays/360);
  const afterWorkYears=wholeWorkdays-workYears*360;
  const workMonths=Math.floor(afterWorkYears/30);
  const afterWorkMonths=afterWorkYears-workMonths*30;
  const workParts=[];
  if(workYears)workParts.push(plural(workYears,'año','años'));
  if(workMonths)workParts.push(plural(workMonths,'mes','meses'));
  if(afterWorkMonths)workParts.push(plural(afterWorkMonths,'día','días'));
  if(remainderHours)workParts.push(plural(remainderHours,'hora','horas'));
  if(remainderMins)workParts.push(plural(remainderMins,'minuto','minutos'));
  const workTime=workParts.length?workParts.join(', ').replace(/, ([^,]*)$/,' y $1'):'0 minutos';
  const totalHours=Math.floor(totalMinutes/60);
  const total=`${fmt(totalHours,0)} ${totalHours===1?'hora':'horas'} y ${totalMinutes%60} ${totalMinutes%60===1?'minuto':'minutos'}`;
  // Convierte las jornadas en tiempo natural estimado según la proporción trabajo/descanso semanal.
  const realDays=totalWorkdays*(7/Number(config.daysPerWeek));
  const realMinutes=Math.round(realDays*24*60);
  const realDayCount=Math.floor(realMinutes/(24*60));
  const remRealMinutes=realMinutes-realDayCount*24*60;
  const realHours=Math.floor(remRealMinutes/60);
  const realMins=remRealMinutes%60;
  const realYears=Math.floor(realDayCount/360);
  const afterRealYears=realDayCount-realYears*360;
  const realMonths=Math.floor(afterRealYears/30);
  const realDayRemainder=afterRealYears-realMonths*30;
  const realParts=[];
  if(realYears)realParts.push(plural(realYears,'año','años'));
  if(realMonths)realParts.push(plural(realMonths,'mes','meses'));
  if(realDayRemainder)realParts.push(plural(realDayRemainder,'día','días'));
  if(realHours)realParts.push(plural(realHours,'hora','horas'));
  if(realMins)realParts.push(plural(realMins,'minuto','minutos'));
  const realTime=realParts.length?realParts.join(', ').replace(/, ([^,]*)$/,' y $1'):'0 minutos';
  return {workTime,total,realTime,workBasis:`Jornadas de ${fmt(config.hoursPerDay)} horas; meses de 30 días y años de 360 días.`};
}
function calculate(){const input=$('productPrice'),err=$('priceError'),raw=input.value.trim();if(!raw){priceValue=null;err.textContent='';$('resultCard').hidden=true;return}const p=parseNumber(raw);if(!Number.isFinite(p)||p<0||p>1e8){priceValue=null;err.textContent='Introduce un precio válido entre 0 y 100.000.000 €.';$('resultCard').hidden=true;return}if(!validConfig(config)){err.textContent='Configura primero tu salario y tu jornada.';$('resultCard').hidden=true;return}err.textContent='';priceValue=p;const h=p/hourly();const result=duration(h);$('realTimeResult').textContent=result.realTime;$('timeResult').textContent=result.workTime;$('workBasis').textContent=result.workBasis;$('totalTimeResult').textContent=result.total;$('resultCard').hidden=false}
function showScreen(name){$('priceScreen').classList.toggle('active',name==='price');$('settingsScreen').classList.toggle('active',name==='settings');if(name==='settings')renderSettings();else{calculate();$('productPrice').focus({preventScroll:true})}window.scrollTo({top:0,behavior:'smooth'})}
function renderSettings(){document.querySelector(`input[name="salaryType"][value="${config.salaryType}"]`).checked=true;$('salary').value=String(config.salary);$('hoursPerDay').value=config.hoursPerDay;$('daysPerWeek').value=String(config.daysPerWeek);updateSettingsPreview()}
function updateSettingsPreview(){const type=document.querySelector('input[name="salaryType"]:checked').value;$('salaryLabel').textContent=type==='monthly'?'Salario bruto mensual (€)':'Salario bruto por hora (€)';const c={salaryType:type,salary:$('salary').value,hoursPerDay:Number($('hoursPerDay').value),daysPerWeek:Number($('daysPerWeek').value)};if(!validConfig(c)){$('previewHourly').textContent='—';$('previewExplanation').textContent='Introduce valores válidos para ver la estimación.';return}const v=hourly(c);$('previewHourly').textContent=`${money(v)}/h`;$('previewExplanation').textContent=type==='monthly'?`Estimación anual: ${money(parseNumber(c.salary)*12)} ÷ ${fmt(c.hoursPerDay*c.daysPerWeek*52)} horas de trabajo al año.`:'Se utiliza directamente el importe por hora que has indicado.'}
$('settingsShortcut').addEventListener('click',()=>showScreen('settings'));$('cancelSettings').addEventListener('click',()=>showScreen('price'));$('priceForm').addEventListener('submit',e=>e.preventDefault());$('productPrice').addEventListener('input',calculate);$('clearPrice').addEventListener('click',()=>{$('productPrice').value='';calculate();$('productPrice').focus()});document.querySelectorAll('input[name="salaryType"]').forEach(x=>x.addEventListener('change',updateSettingsPreview));['salary','hoursPerDay','daysPerWeek'].forEach(id=>$(id).addEventListener('input',updateSettingsPreview));
$('settingsForm').addEventListener('submit',e=>{e.preventDefault();const next={salaryType:document.querySelector('input[name="salaryType"]:checked').value,salary:$('salary').value.trim(),hoursPerDay:parseNumber($('hoursPerDay').value),daysPerWeek:Number($('daysPerWeek').value)};if(!validConfig(next)){$('settingsError').textContent='Comprueba el salario (mayor que 0), las horas (1–24) y los días (1–7).';return}$('settingsError').textContent='';config=next;try{localStorage.setItem(CONFIG_KEY,JSON.stringify(config))}catch{}showScreen('price')});
function confirmReset(){resetStage=0;$('confirmTitle').textContent='Restablecer configuración';$('confirmMessage').textContent='Se borrarán el salario, el tipo de salario, las horas al día y los días a la semana. Los recursos de la aplicación se conservarán.';$('confirmProceed').textContent='Continuar';$('confirmModal').hidden=false;lastFocus=$('resetSettings')}
$('resetSettings').addEventListener('click',confirmReset);$('confirmCancel').addEventListener('click',()=>{$('confirmModal').hidden=true;if(lastFocus)lastFocus.focus()});$('confirmProceed').addEventListener('click',()=>{if(resetStage===0){resetStage=1;$('confirmTitle').textContent='Confirmación final';$('confirmMessage').textContent='¿Seguro que quieres borrar la configuración personal? Esta acción no se puede deshacer.';$('confirmProceed').textContent='Sí, restablecer';return}try{localStorage.removeItem(CONFIG_KEY)}catch{}config={...defaults};$('confirmModal').hidden=true;renderSettings();showScreen('settings');$('settingsError').textContent='Configuración restablecida. Introduce tus datos para continuar.';$('resetSettings').focus()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('confirmModal').hidden){$('confirmModal').hidden=true;if(lastFocus)lastFocus.focus()}});

// Pantalla inicial: al pulsar COMENZAR se solicita pantalla completa desde un gesto del usuario.
const startScreen=$('startScreen'), startButton=$('startButton'), appShell=$('appShell'), fullscreenMessage=$('fullscreenMessage');
function isFullscreen(){return Boolean(document.fullscreenElement||document.webkitFullscreenElement)}
function fullscreenNotice(message){fullscreenMessage.textContent=message;fullscreenMessage.hidden=!message;}
startButton.addEventListener('click',async()=>{
  startButton.disabled=true;
  startButton.textContent='ABRIENDO…';
  let fullscreenFailed=false;
  try{
    if(!isFullscreen()){
      const root=document.documentElement;
      if(root.requestFullscreen) await root.requestFullscreen({navigationUI:'hide'});
      else if(root.webkitRequestFullscreen) root.webkitRequestFullscreen();
      else fullscreenFailed=true;
    }
  }catch{fullscreenFailed=true;}
  startScreen.hidden=true;
  appShell.removeAttribute('inert');
  appShell.setAttribute('aria-hidden','false');
  if(fullscreenFailed){
    fullscreenNotice('No se pudo activar la pantalla completa en este navegador. TiempoEsVida seguirá funcionando; el modo de pantalla completa depende de Android y de la instalación.');
  }else{
    fullscreenNotice('');
  }
  startButton.disabled=false;
  startButton.textContent='COMENZAR';
});

// Service worker: caché de recursos para uso offline cuando se publica por HTTPS (por ejemplo, GitHub Pages).
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}

renderSettings();if(!localStorage.getItem(CONFIG_KEY)){showScreen('settings')}else{calculate()}
