(function() {
    var s = document.createElement('style');
    s.textContent = "@keyframes breathe { 0%, 100% { letter-spacing: 0.1em; text-shadow: 0 0 5px var(--accent-gold); opacity: 0.8; } 50% { letter-spacing: 0.5em; text-shadow: 0 0 30px var(--accent-gold); opacity: 1; } } .header .title, .header .subtitle, .t { animation: breathe 4s ease-in-out infinite; }";
    document.head.appendChild(s);
})();
