// Animated Skill Bars on Scroll
document.addEventListener('DOMContentLoaded', function () {
  function animateSkillBars() {
    document.querySelectorAll('.fill').forEach(function(bar) {
      const percent = bar.getAttribute('data-percent');
      if (percent) bar.style.width = percent;
    });
  }
  // Only trigger once, when in view
  let triggered = false;
  window.addEventListener('scroll', () => {
    const section = document.querySelector('#skills');
    if(section) {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight - 56 && !triggered) {
        animateSkillBars();
        triggered = true;
      }
    }
  });
  // Also trigger on load if section is in view
  window.setTimeout(() => {
    const section = document.querySelector('#skills');
    if(section && (window.scrollY + window.innerHeight > section.offsetTop)) {
      animateSkillBars();
    }
  }, 200);
});

// Expandable Cards for Accessibility (keyboard expand/collapse)
document.querySelectorAll('.card-expandable').forEach(card => {
  card.addEventListener('keydown', function(e) {
    if(e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if(this.classList.contains('expanded')) {
        this.classList.remove('expanded');
      } else {
        document.querySelectorAll('.card-expandable').forEach(c => c.classList.remove('expanded'));
        this.classList.add('expanded');
      }
    }
  });
  // Close when focus moves out
  card.addEventListener('blur', function() {
    this.classList.remove('expanded');
  });
});

// Navigation Scroll Highlight
document.querySelectorAll('.side-nav a').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if(target) {
      window.scrollTo({top: target.offsetTop, behavior: "smooth"});
    }
  });
});
// Set nav highlight on scroll
window.addEventListener('scroll', () => {
  const sections = ['home','about','education','experience','skills','certifications','contact'];
  let idx = 0;
  for(let i=0; i<sections.length; i++) {
    const s = document.getElementById(sections[i]);
    if(s && (window.scrollY + 130 >= s.offsetTop)) idx=i;
  }
  document.querySelectorAll('.side-nav a').forEach((a,i) =>
    a.classList.toggle('active', i===idx)
  );
});

// Contact Form (basic frontend validation placeholder)
document.getElementById('contact-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  // TODO: connect to backend/service if desired
  alert('Thank you for reaching out! This demo does not send emails.');
  this.reset();
});

// Custom Cursor Effect (optional, for extra flair)
// Uncomment to enable custom cursor
/* 
const cursor = document.createElement('div');
cursor.id = 'custom-cursor';
document.body.appendChild(cursor);
document.addEventListener('mousemove', e => {
  cursor.style.left = e.pageX + 'px';
  cursor.style.top = e.pageY + 'px';
});
*/
// Add CSS for #custom-cursor { position:fixed; ... } to style a glowing dot!
