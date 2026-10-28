const titles = [
  ['First Day','Bunk Off','Thorpe Park','Girlfriend','Caravan Club','Xmas Party'],
  ['The Field Trip','Work Experience',"Will’s Birthday",'A Night Out in London','The Duke of Edinburgh Awards','Exam Time'],
  ['The Fashion Show','The Gig and the Girlfriend',"Will’s Dilemma",'The Trip to Warwick','Home Alone','The Camping Trip']
];
const ratings = [[7.7,8.6,8.1,7.9,8.3,8.0],[8.7,8.1,8.1,8.0,8.1,8.6],[8.4,8.3,8.1,8.7,8.2,8.5]];
const dates = [['1 May 2008','1 May 2008','8 May 2008','15 May 2008','22 May 2008','29 May 2008'],['2 Apr 2009','9 Apr 2009','16 Apr 2009','23 Apr 2009','30 Apr 2009','7 May 2009'],['13 Sep 2010','20 Sep 2010','27 Sep 2010','4 Oct 2010','11 Oct 2010','18 Oct 2010']];
const episodes = titles.flatMap((series, seasonIndex) => series.map((title, episodeIndex) => ({season:seasonIndex+1,number:episodeIndex+1,title,rating:ratings[seasonIndex][episodeIndex],date:dates[seasonIndex][episodeIndex]})));
const average = values => values.reduce((sum,value)=>sum+value,0)/values.length;
const episodeCode = episode => `S${episode.season.toString().padStart(2,'0')}E${episode.number.toString().padStart(2,'0')}`;
const transcriptUrl = episode => `https://www.springfieldspringfield.co.uk/view_episode_scripts.php?episode=s0${episode.season}e0${episode.number}&tv-show=the-inbetweeners`;
let selectedEpisode = episodes[0];
let selectedSeason = 'all';
let transcripts = [];

function selectEpisode(episode) {
  selectedEpisode = episode;
  document.querySelectorAll('[data-episode]').forEach(button => button.classList.toggle('active', Number(button.dataset.episode) === episodes.indexOf(episode)));
  const transcript = transcripts.find(item => item.season === episode.season && item.number === episode.number);
  document.querySelector('#episode-detail').innerHTML = `<span class="file-kicker">CASE FILE / ${episodeCode(episode)}</span><h3>${episode.title}</h3><div class="score">${episode.rating.toFixed(1)}<span style="font-size:.3em"> / 10</span></div><div class="detail-meta"><span>FIRST AIRED<br>${episode.date}</span><span>SERIES ${episode.season}<br>EPISODE ${episode.number}</span></div><p>${transcript ? `${transcript.wordCount.toLocaleString()} words in the available transcript.` : 'Explore the full episode run, then dive into the language data below.'} Viewer score from IMDb’s episode ratings grid.</p><a href="${transcriptUrl(episode)}" target="_blank" rel="noopener noreferrer">READ SOURCE TRANSCRIPT ↗</a>`;
}

function renderGrid() {
  const grid = document.querySelector('#episode-grid');
  grid.innerHTML = `<div class="grid-label"></div>${Array.from({length:6},(_,index)=>`<div class="grid-label">EP ${String(index+1).padStart(2,'0')}</div>`).join('')}`;
  for (let season=1;season<=3;season++) {
    grid.insertAdjacentHTML('beforeend',`<div class="grid-label">SERIES ${season}</div>`);
    episodes.filter(episode=>episode.season===season).forEach(episode=>{
      const lightness=72-(episode.rating-7.7)*45;
      const button=document.createElement('button');
      button.className='grid-cell'; button.dataset.episode=episodes.indexOf(episode);
      button.style.background=`hsl(217 65% ${lightness}%)`;
      button.style.color=lightness>55?'#172b46':'#ffffff';
      button.setAttribute('aria-label',`${episodeCode(episode)} ${episode.title}: ${episode.rating} out of 10`);
      button.innerHTML=`<span>${episodeCode(episode)}</span><strong>${episode.rating.toFixed(1)}</strong>`;
      button.addEventListener('click',()=>{selectEpisode(episode);document.querySelector('#episode-file').scrollIntoView({behavior:'smooth'});});
      grid.append(button);
    });
  }
}

function renderTimeline() {
  const svg=document.querySelector('#ratings-chart');
  svg.setAttribute('viewBox','0 0 1000 330');
  const point=(episode,index)=>({x:48+index*52.5,y:280-(episode.rating-7.5)*210});
  const points=episodes.map(point);
  const line=points.map((point,index)=>`${index?'L':'M'} ${point.x} ${point.y}`).join(' ');
  svg.innerHTML=[7.5,8,8.5,9].map(value=>`<line class="chart-gridline" x1="45" x2="950" y1="${280-(value-7.5)*210}" y2="${280-(value-7.5)*210}"/><text class="chart-axis" x="0" y="${285-(value-7.5)*210}">${value.toFixed(1)}</text>`).join('')+`<line x1="337" x2="337" y1="45" y2="280" stroke="#aaa396" stroke-dasharray="5 5"/><line x1="652" x2="652" y1="45" y2="280" stroke="#aaa396" stroke-dasharray="5 5"/><path class="chart-line" d="${line}"/>`;
  points.forEach((point,index)=>{const dot=document.createElementNS('http://www.w3.org/2000/svg','circle');dot.setAttribute('class','chart-dot');dot.setAttribute('cx',point.x);dot.setAttribute('cy',point.y);dot.setAttribute('r','8');dot.setAttribute('tabindex','0');dot.setAttribute('aria-label',`${episodeCode(episodes[index])} ${episodes[index].title}: ${episodes[index].rating}`);const title=document.createElementNS('http://www.w3.org/2000/svg','title');title.textContent=`${episodes[index].title} — ${episodes[index].rating}/10`;dot.append(title);dot.addEventListener('click',()=>{selectEpisode(episodes[index]);document.querySelector('#episode-file').scrollIntoView({behavior:'smooth'});});dot.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();dot.dispatchEvent(new Event('click'));}});svg.append(dot);});
}

function renderInsights() {
  const highest=Math.max(...episodes.map(episode=>episode.rating));
  const lowest=Math.min(...episodes.map(episode=>episode.rating));
  const top=episodes.filter(episode=>episode.rating===highest).map(episode=>episode.title).join(' & ');
  document.querySelector('#overall-rating').textContent=average(episodes.map(episode=>episode.rating)).toFixed(1);
  document.querySelector('#insights').innerHTML=`<div class="insight"><strong>${highest.toFixed(1)}</strong><span>Top score: ${top}.</span></div><div class="insight"><strong>${(highest-lowest).toFixed(1)}</strong><span>Points separate the highest and lowest rated episodes.</span></div><div class="insight"><strong>18/18</strong><span>Episodes score at least 7.7 out of 10.</span></div>`;
  document.querySelector('#series-bars').innerHTML=[1,2,3].map(season=>{const score=average(episodes.filter(episode=>episode.season===season).map(episode=>episode.rating));return `<button class="series-bar" data-series="${season}" aria-label="Show series ${season} episodes"><span>SERIES 0${season}</span><span class="series-bar-track"><span class="series-bar-fill" style="display:block;width:${score*10}%"></span></span><strong>${score.toFixed(2)}</strong></button>`;}).join('');
  document.querySelectorAll('.series-bar').forEach(button=>button.addEventListener('click',()=>{setSeason(button.dataset.series);document.querySelector('#episode-file').scrollIntoView({behavior:'smooth'});}));
}

function setSeason(season) { selectedSeason=season;document.querySelectorAll('.filter').forEach(button=>button.classList.toggle('active',button.dataset.season===season));renderEpisodeList(); }
function renderEpisodeList() {
  const visible=selectedSeason==='all'?episodes:episodes.filter(episode=>episode.season===Number(selectedSeason));
  const list=document.querySelector('#episode-list');list.innerHTML='';
  visible.forEach(episode=>{const button=document.createElement('button');button.className='episode-button';button.dataset.episode=episodes.indexOf(episode);button.innerHTML=`<small>${episodeCode(episode)}</small><strong>${episode.title}</strong><b>${episode.rating.toFixed(1)}</b>`;button.addEventListener('click',()=>selectEpisode(episode));list.append(button);});
  selectEpisode(visible.includes(selectedEpisode)?selectedEpisode:visible[0]);
}

function renderWord(word) {
  const clean=word.toLowerCase().trim().replace(/[^a-z']/g,'');
  if (!clean || !transcripts.length) return;
  document.querySelector('#word-input').value=clean;
  const counts=transcripts.map(episode=>episode.words[clean]||0);
  const total=counts.reduce((sum,count)=>sum+count,0);
  document.querySelector('#word-count').textContent=total.toLocaleString();
  document.querySelector('#word-caption').textContent=`OCCURRENCES OF “${clean.toUpperCase()}”`;
  const max=Math.max(1,...counts);
  document.querySelector('#word-chart').innerHTML=counts.map((count,index)=>`<button class="word-column" data-episode="${index}" title="${episodes[index].title}: ${count} matches"><span class="word-value">${count}</span><span class="word-bar" style="height:${Math.max(3,count/max*100)}%"></span><span class="word-label">${episodes[index].season}.${episodes[index].number}</span></button>`).join('');
  document.querySelectorAll('.word-column').forEach(button=>button.addEventListener('click',()=>{selectEpisode(episodes[Number(button.dataset.episode)]);document.querySelector('#episode-file').scrollIntoView({behavior:'smooth'});}));
}

function renderSwearJar() {
  const terms=['fuck','fucking','shit','shitting','wank','wanker','wanking','bollocks','dickhead','twat','arsehole','bastard','piss'];
  const rows=transcripts.map((transcript,index)=>({episode:episodes[index],count:terms.reduce((sum,term)=>sum+(transcript.words[term]||0),0),rate:0,wordCount:transcript.wordCount}));
  rows.forEach(row=>row.rate=row.count/row.wordCount*1000);
  rows.sort((a,b)=>b.rate-a.rate);
  document.querySelector('#swear-leader-rate').textContent=rows[0].rate.toFixed(1);
  document.querySelector('#swear-leader-name').textContent=rows[0].episode.title;
  document.querySelector('#swear-bars').innerHTML=rows.map(row=>`<button class="swear-row" data-episode="${episodes.indexOf(row.episode)}" title="${row.count} matches in ${row.wordCount.toLocaleString()} words"><span>${episodeCode(row.episode)}<strong>${row.episode.title}</strong></span><span class="swear-track"><span style="width:${row.rate/rows[0].rate*100}%"></span></span><b>${row.rate.toFixed(1)}</b></button>`).join('');
  document.querySelectorAll('.swear-row').forEach(button=>button.addEventListener('click',()=>{selectEpisode(episodes[Number(button.dataset.episode)]);document.querySelector('#episode-file').scrollIntoView({behavior:'smooth'});}));
}

function loadTranscripts() {
  transcripts=transcriptData;
  document.querySelector('#word-total').textContent=transcripts.reduce((sum,episode)=>sum+episode.wordCount,0).toLocaleString();
  renderWord('friend');
  renderSwearJar();
  selectEpisode(selectedEpisode);
}

renderGrid();renderTimeline();renderInsights();renderEpisodeList();
document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>setSeason(button.dataset.season)));
document.querySelector('#word-search').addEventListener('click',()=>renderWord(document.querySelector('#word-input').value));
document.querySelector('#word-input').addEventListener('keydown',event=>{if(event.key==='Enter')renderWord(event.target.value);});
document.querySelectorAll('[data-word]').forEach(button=>button.addEventListener('click',()=>renderWord(button.dataset.word)));
loadTranscripts();
