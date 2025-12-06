document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('project-search');
  const filterBar = document.getElementById('project-filters');
  const projectSection = document.getElementById('project-section');
  if (!projectSection) return;

  const items = Array.from(projectSection.querySelectorAll('a'));

  function getItemTags(el) {
    const raw = el.dataset.tags || '';
    return raw.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  }

  function matchesSearch(el, term) {
    if (!term) return true;
    const title = (el.querySelector('h3')?.textContent || '').toLowerCase();
    const desc = (el.querySelector('p')?.textContent || '').toLowerCase();
    return title.includes(term) || desc.includes(term) || getItemTags(el).some(t => t.includes(term));
  }

  function matchesTags(el, activeTags) {
    if (!activeTags.length) return true;
    const tags = getItemTags(el);
    // match if at least one active tag present (OR behaviour)
    return activeTags.some(t => tags.includes(t));
  }

  function applyFilter() {
    const term = (searchInput?.value || '').trim().toLowerCase();
    const activeBtns = Array.from(filterBar.querySelectorAll('.filter-btn.active'))
      .map(b => b.dataset.tag).filter(t => t && t !== 'all');

    items.forEach(it => {
      const show = matchesSearch(it, term) && matchesTags(it, activeBtns);
      it.style.display = show ? '' : 'none';
    });
  }

  let debounce;
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(applyFilter, 180);
    });
  }

  if (filterBar) {
    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      const tag = btn.dataset.tag;
      if (tag === 'all') {
        // clear other active states
        filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      } else {
        // toggle this button and remove 'all'
        btn.classList.toggle('active');
        const allBtn = filterBar.querySelector('.filter-btn[data-tag="all"]');
        if (allBtn) allBtn.classList.remove('active');
        // if no specific tags active, re-enable 'all'
        const anyActive = Array.from(filterBar.querySelectorAll('.filter-btn')).some(b => b.classList.contains('active') && b.dataset.tag !== 'all');
        if (!anyActive && allBtn) allBtn.classList.add('active');
      }
      applyFilter();
    });
  }

  const allBtn = filterBar.querySelector('.filter-btn[data-tag="all"]');
  if (allBtn) {
    filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    allBtn.classList.add('active');
  }
  applyFilter();
});
