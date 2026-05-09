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

  controls.appendChild(expandBtn);
  controls.appendChild(collapseBtn);

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
})();
