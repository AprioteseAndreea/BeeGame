document.getElementById('start-game').addEventListener('click', () => {
    const playerName = document.getElementById('player-name').value;
    if (playerName.trim()) {
        localStorage.setItem('playerName', playerName);
        window.location.href = 'game.html';
    } else {
        alert('Please enter your name.');
    }
});