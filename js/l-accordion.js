document.addEventListener('DOMContentLoaded', function() {
    var accordion = document.querySelector('.l-accordion');
    var switchEl = accordion.querySelector('.l-accordion-switch');
    var insideEl = accordion.querySelector('.l-accordion-inside');
    
    switchEl.addEventListener('click', function() {
      accordion.classList.toggle('inside');
      insideEl.style.maxHeight = accordion.classList.contains('inside') ? insideEl.scrollHeight + 'px' : '0';
    });
  });


