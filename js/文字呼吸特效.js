(function() {
    var s = document.createElement('style');
    s.textContent = "@keyframes breathe { 0%, 100% { letter-spacing: 0.1em; text-shadow: 0 0 2px var(--accent-gold); } 50% { letter-spacing: 0.6em; text-shadow: 0 0 35px var(--accent-gold); } } .header .title, .header .subtitle, .t { animation: breathe 6s ease-in-out infinite; }";
    document.head.appendChild(s);
})();
