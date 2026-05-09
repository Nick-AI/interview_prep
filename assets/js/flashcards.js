(function(){
  if (!window.__flashcardMode) return;

  document.body.classList.add('flashcard-mode');

  var main = document.querySelector('.main-content') || document.querySelector('main') || document.body;
  var headings = Array.prototype.slice.call(main.querySelectorAll('h3'));
  if (!headings.length) return;

  var STOP_TAGS = { H1: 1, H2: 1, H3: 1 };

  headings.forEach(function(h){
    var details = document.createElement('details');
    details.className = 'flashcard';

    var summary = document.createElement('summary');
    details.appendChild(summary);

    h.parentNode.insertBefore(details, h);
    summary.appendChild(h);

    var node = details.nextSibling;
    while (node && !(node.nodeType === 1 && STOP_TAGS[node.tagName])) {
      var next = node.nextSibling;
      details.appendChild(node);
      node = next;
    }
  });

  var controls = document.createElement('div');
  controls.className = 'flashcard-controls';

  var expandBtn = document.createElement('button');
  expandBtn.type = 'button';
  expandBtn.textContent = 'Expand all';

  var collapseBtn = document.createElement('button');
  collapseBtn.type = 'button';
  collapseBtn.textContent = 'Collapse all';

  var slideshowBtn = document.createElement('button');
  slideshowBtn.type = 'button';
  slideshowBtn.textContent = 'Slideshow';

  controls.appendChild(expandBtn);
  controls.appendChild(collapseBtn);
  controls.appendChild(slideshowBtn);

  var firstDetails = main.querySelector('details.flashcard');
  if (firstDetails) firstDetails.parentNode.insertBefore(controls, firstDetails);

  function setAll(open){
    var all = main.querySelectorAll('details.flashcard');
    Array.prototype.forEach.call(all, function(d){ d.open = open; });
  }
  expandBtn.addEventListener('click', function(){ setAll(true); });
  collapseBtn.addEventListener('click', function(){ setAll(false); });

  if (window.location.hash) {
    var target = main.querySelector(window.location.hash);
    if (target) {
      var d = target.closest('details.flashcard');
      if (d) {
        d.open = true;
        target.scrollIntoView();
      }
    }
  }

  // ---------- Slideshow mode ----------

  function buildDeck(){
    var all = main.querySelectorAll('details.flashcard');
    var deck = [];
    Array.prototype.forEach.call(all, function(d, i){
      var summary = d.querySelector('summary');
      var h3 = d.querySelector('h3');
      if (!summary || !h3) return;
      var qHTML = summary.innerHTML;
      var aParts = [];
      Array.prototype.forEach.call(d.children, function(child){
        if (child.tagName !== 'SUMMARY') aParts.push(child.outerHTML);
      });
      deck.push({
        id: h3.id || ('q' + i),
        qHTML: qHTML,
        aHTML: aParts.join('')
      });
    });
    return deck;
  }

  function shuffle(arr){
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  var sourceDeck = null;
  var deck = [];
  var order = 'random';
  var index = 0;
  var revealed = false;
  var marks = new Map();
  var reviewing = false;

  var overlay = null;
  var progressEl, qEl, aEl, hintEl, marksEl, cardEl, orderBtn, endEl;
  var savedScrollY = 0;
  var keyHandler = null;

  function startFresh(){
    deck = order === 'random' ? shuffle(sourceDeck) : sourceDeck.slice();
    index = 0;
    revealed = false;
    marks = new Map();
    reviewing = false;
    render();
  }

  function startReview(){
    var reviewIds = {};
    marks.forEach(function(v, k){ if (v === 'review') reviewIds[k] = 1; });
    var subset = sourceDeck.filter(function(c){ return reviewIds[c.id]; });
    if (!subset.length) return;
    deck = order === 'random' ? shuffle(subset) : subset;
    index = 0;
    revealed = false;
    marks = new Map();
    reviewing = true;
    render();
  }

  function reshuffle(){
    order = 'random';
    if (orderBtn) orderBtn.textContent = 'Random';
    deck = shuffle(deck.length ? deck : sourceDeck);
    index = 0;
    revealed = false;
    render();
  }

  function toggleOrder(){
    order = order === 'random' ? 'sequential' : 'random';
    orderBtn.textContent = order === 'random' ? 'Random' : 'Sequential';
    var source = reviewing
      ? deck.slice().sort(function(a, b){ return sourceDeck.indexOf(a) - sourceDeck.indexOf(b); })
      : sourceDeck.slice();
    deck = order === 'random' ? shuffle(source) : source;
    index = 0;
    revealed = false;
    render();
  }

  function render(){
    if (!overlay) return;

    if (index >= deck.length) {
      renderEnd();
      return;
    }
    endEl.hidden = true;
    cardEl.hidden = false;

    var card = deck[index];
    progressEl.textContent = (index + 1) + ' / ' + deck.length + (reviewing ? ' (review)' : '');
    qEl.innerHTML = card.qHTML;
    aEl.innerHTML = card.aHTML;
    aEl.hidden = !revealed;
    hintEl.textContent = revealed ? 'Tap for next' : 'Tap to reveal';
    marksEl.hidden = !revealed;
    cardEl.scrollTop = 0;
  }

  function renderEnd(){
    cardEl.hidden = true;
    marksEl.hidden = true;
    endEl.hidden = false;

    var got = 0, review = 0;
    marks.forEach(function(v){ if (v === 'got') got++; else if (v === 'review') review++; });

    progressEl.textContent = 'Done';
    var msg = 'Done — ' + got + ' got it';
    if (review) msg += ', ' + review + ' to review';
    msg += '.';
    endEl.querySelector('.flashcard-end-msg').textContent = msg;

    var reviewBtn = endEl.querySelector('[data-action="review-missed"]');
    if (review) {
      reviewBtn.hidden = false;
      reviewBtn.textContent = 'Review missed (' + review + ')';
    } else {
      reviewBtn.hidden = true;
    }
  }

  function advance(){
    if (index >= deck.length) return;
    if (!revealed) {
      revealed = true;
      render();
      return;
    }
    index++;
    revealed = false;
    render();
  }

  function stepBack(){
    if (index >= deck.length) {
      // from end view, back into last card unrevealed
      index = deck.length - 1;
      revealed = false;
      render();
      return;
    }
    if (revealed) {
      revealed = false;
      render();
      return;
    }
    if (index > 0) {
      index--;
      revealed = false;
      render();
    }
  }

  function markCurrent(value){
    if (index >= deck.length || !revealed) return;
    marks.set(deck[index].id, value);
    advance();
  }

  function buildOverlay(){
    var ov = document.createElement('div');
    ov.className = 'flashcard-overlay';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.setAttribute('aria-label', 'Flashcard slideshow');

    var topbar = document.createElement('div');
    topbar.className = 'flashcard-topbar';

    progressEl = document.createElement('span');
    progressEl.className = 'flashcard-progress';

    var spacer = document.createElement('div');
    spacer.className = 'flashcard-spacer';

    orderBtn = document.createElement('button');
    orderBtn.type = 'button';
    orderBtn.dataset.action = 'toggle-order';
    orderBtn.textContent = 'Random';

    var reshuffleBtn = document.createElement('button');
    reshuffleBtn.type = 'button';
    reshuffleBtn.dataset.action = 'reshuffle';
    reshuffleBtn.textContent = 'Reshuffle';

    var exitBtn = document.createElement('button');
    exitBtn.type = 'button';
    exitBtn.dataset.action = 'exit';
    exitBtn.setAttribute('aria-label', 'Exit slideshow');
    exitBtn.textContent = 'Exit ✕';

    topbar.appendChild(progressEl);
    topbar.appendChild(spacer);
    topbar.appendChild(orderBtn);
    topbar.appendChild(reshuffleBtn);
    topbar.appendChild(exitBtn);

    cardEl = document.createElement('div');
    cardEl.className = 'flashcard-card';
    cardEl.dataset.action = 'advance';

    qEl = document.createElement('div');
    qEl.className = 'flashcard-q';

    aEl = document.createElement('div');
    aEl.className = 'flashcard-a';
    aEl.hidden = true;

    hintEl = document.createElement('div');
    hintEl.className = 'flashcard-hint';

    cardEl.appendChild(qEl);
    cardEl.appendChild(aEl);
    cardEl.appendChild(hintEl);

    marksEl = document.createElement('div');
    marksEl.className = 'flashcard-marks';
    marksEl.hidden = true;

    var gotBtn = document.createElement('button');
    gotBtn.type = 'button';
    gotBtn.dataset.action = 'mark-got';
    gotBtn.textContent = '✓ Got it';

    var reviewBtn = document.createElement('button');
    reviewBtn.type = 'button';
    reviewBtn.dataset.action = 'mark-review';
    reviewBtn.textContent = '↻ Review again';

    marksEl.appendChild(gotBtn);
    marksEl.appendChild(reviewBtn);

    endEl = document.createElement('div');
    endEl.className = 'flashcard-end';
    endEl.hidden = true;
    var endMsg = document.createElement('div');
    endMsg.className = 'flashcard-end-msg';
    var endButtons = document.createElement('div');
    endButtons.className = 'flashcard-end-buttons';

    var endReviewBtn = document.createElement('button');
    endReviewBtn.type = 'button';
    endReviewBtn.dataset.action = 'review-missed';
    endReviewBtn.textContent = 'Review missed';

    var endRestartBtn = document.createElement('button');
    endRestartBtn.type = 'button';
    endRestartBtn.dataset.action = 'restart-all';
    endRestartBtn.textContent = 'Restart all';

    endButtons.appendChild(endReviewBtn);
    endButtons.appendChild(endRestartBtn);
    endEl.appendChild(endMsg);
    endEl.appendChild(endButtons);

    ov.appendChild(topbar);
    ov.appendChild(cardEl);
    ov.appendChild(endEl);
    ov.appendChild(marksEl);

    ov.addEventListener('click', function(e){
      var actionEl = e.target.closest && e.target.closest('[data-action]');
      if (!actionEl) return;
      var action = actionEl.dataset.action;
      if (action !== 'advance') {
        e.stopPropagation();
      }
      switch (action) {
        case 'advance':       advance(); break;
        case 'reshuffle':     reshuffle(); break;
        case 'toggle-order':  toggleOrder(); break;
        case 'exit':          closeSlideshow(); break;
        case 'mark-got':      markCurrent('got'); break;
        case 'mark-review':   markCurrent('review'); break;
        case 'review-missed': startReview(); break;
        case 'restart-all':   startFresh(); break;
      }
    });

    return ov;
  }

  function openSlideshow(){
    if (overlay) return;
    sourceDeck = buildDeck();
    if (!sourceDeck.length) return;

    overlay = buildOverlay();
    document.body.appendChild(overlay);

    savedScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.classList.add('flashcard-slideshow-open');

    keyHandler = function(e){
      if (e.key === 'Escape') { closeSlideshow(); return; }
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); advance(); return; }
      if (e.key === 'ArrowLeft') { e.preventDefault(); stepBack(); return; }
      if (e.key === 'r' || e.key === 'R') { reshuffle(); return; }
      if (e.key === 'g' || e.key === 'G') { markCurrent('got'); return; }
      if (e.key === 'f' || e.key === 'F') { markCurrent('review'); return; }
    };
    document.addEventListener('keydown', keyHandler);

    startFresh();
  }

  function closeSlideshow(){
    if (!overlay) return;
    document.removeEventListener('keydown', keyHandler);
    keyHandler = null;
    overlay.parentNode.removeChild(overlay);
    overlay = null;
    document.body.classList.remove('flashcard-slideshow-open');
    window.scrollTo(0, savedScrollY);
  }

  slideshowBtn.addEventListener('click', openSlideshow);
})();
