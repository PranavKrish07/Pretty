// Get elements
const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const questionScreen = document.getElementById('questionScreen');
const celebrationScreen = document.getElementById('celebrationScreen');
const restartBtn = document.getElementById('restartBtn');
const confettiContainer = document.getElementById('confettiContainer');

// Check if device is mobile
const isMobile = window.innerWidth <= 768;

// No button teleportation
function teleportNoButton() {
    // Get the content box position
    const content = document.querySelector('.content');
    const contentRect = content.getBoundingClientRect();
    const buttonWidth = noBtn.offsetWidth;
    const buttonHeight = noBtn.offsetHeight;
    
    // Adjust distance range based on device
    const minDistance = isMobile ? 40 : 50;
    const maxDistance = isMobile ? 100 : 150;
    
    let randomX, randomY;
    let isValidPosition = false;
    let attempts = 0;
    
    // Generate random position within bounded area
    while (!isValidPosition && attempts < 10) {
        const angle = Math.random() * Math.PI * 2;
        const distance = minDistance + Math.random() * (maxDistance - minDistance);
        
        randomX = contentRect.left + contentRect.width / 2 + Math.cos(angle) * distance;
        randomY = contentRect.top + contentRect.height / 2 + Math.sin(angle) * distance;
        
        // Strict boundary checking for mobile
        const padding = 5;
        const minX = padding;
        const maxX = window.innerWidth - buttonWidth - padding;
        const minY = padding;
        const maxY = window.innerHeight - buttonHeight - padding;
        
        // Clamp to valid range
        randomX = Math.max(minX, Math.min(randomX, maxX));
        randomY = Math.max(minY, Math.min(randomY, maxY));
        
        // Verify position is valid
        if (randomX >= minX && randomX <= maxX && randomY >= minY && randomY <= maxY) {
            isValidPosition = true;
        }
        
        attempts++;
    }
    
    noBtn.style.position = 'fixed';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
}

// Mobile: Teleport on touch/tap
if (isMobile) {
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        teleportNoButton();
    });
} else {
    // Desktop: Teleport on hover
    noBtn.addEventListener('mouseenter', () => {
        teleportNoButton();
    });
}

// Yes button click
yesBtn.addEventListener('click', () => {
    questionScreen.classList.remove('active');
    celebrationScreen.classList.add('active');
    createConfetti();
    playSound();
    playCelebrationSong();
});

// Restart button
restartBtn.addEventListener('click', () => {
    celebrationScreen.classList.remove('active');
    questionScreen.classList.add('active');
    noBtn.style.position = 'relative';
    noBtn.style.left = 'auto';
    noBtn.style.top = 'auto';
    confettiContainer.innerHTML = '';
});

// Confetti animation
function createConfetti() {
    const confettiPieces = 100;
    const colors = ['#ff1493', '#ff69b4', '#ffb6d9', '#ffd1dc', '#ffb6c1', '#ffc0cb'];
    
    for (let i = 0; i < confettiPieces; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        const startX = Math.random() * window.innerWidth;
        const startY = -10;
        const angle = Math.random() * Math.PI * 2;
        const velocity = 5 + Math.random() * 8;
        const duration = 2 + Math.random() * 1;
        const size = 5 + Math.random() * 8;
        const shape = Math.random() > 0.5 ? '●' : '■';
        
        confetti.innerHTML = `<span style="
            display: block;
            width: ${size}px;
            height: ${size}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            font-size: ${size}px;
            color: ${colors[Math.floor(Math.random() * colors.length)]};
            opacity: ${0.7 + Math.random() * 0.3};
        ">${Math.random() > 0.5 ? shape : '✨'}</span>`;
        
        confetti.style.left = startX + 'px';
        confetti.style.top = startY + 'px';
        
        confettiContainer.appendChild(confetti);
        
        // Animate confetti
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        let x = startX;
        let y = startY;
        let velocityY = vy;
        let opacity = 1;
        
        const startTime = Date.now();
        
        function animateConfetti() {
            const elapsed = (Date.now() - startTime) / 1000;
            
            if (elapsed >= duration) {
                confetti.remove();
                return;
            }
            
            x += vx;
            y += velocityY;
            velocityY += 0.2; // gravity
            opacity = 1 - (elapsed / duration);
            
            confetti.style.left = x + 'px';
            confetti.style.top = y + 'px';
            confetti.style.opacity = opacity;
            
            requestAnimationFrame(animateConfetti);
        }
        
        animateConfetti();
    }
}

// Play celebratory song
function playCelebrationSong() {
    const audio = document.getElementById('celebrationAudio');
    if (audio && audio.src) {
        audio.currentTime = 0;
        audio.play().catch(err => {
            console.log('Could not play audio:', err);
            // Fallback to Web Audio beep if no audio file
            playSound();
        });
    } else {
        // Play celebratory melody if no audio file is set
        playCelebratoryMelody();
    }
}

// Play celebratory melody (enhanced version)
function playCelebratoryMelody() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Celebratory melody: C4, D4, E4, G4, E4, G4, C5
        const melody = [
            { freq: 261.63, duration: 0.2 },  // C4
            { freq: 293.66, duration: 0.2 },  // D4
            { freq: 329.63, duration: 0.2 },  // E4
            { freq: 392.00, duration: 0.4 },  // G4
            { freq: 329.63, duration: 0.2 },  // E4
            { freq: 392.00, duration: 0.2 },  // G4
            { freq: 523.25, duration: 0.6 },  // C5 (high note)
        ];
        
        let currentTime = audioContext.currentTime;
        
        melody.forEach(note => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(audioContext.destination);
            
            osc.frequency.value = note.freq;
            osc.type = 'sine';
            
            gain.gain.setValueAtTime(0.3, currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);
            
            osc.start(currentTime);
            osc.stop(currentTime + note.duration);
            
            currentTime += note.duration;
        });
    } catch (err) {
        console.log('Could not play melody:', err);
    }
}

// Optional: Play celebratory sound (using Web Audio API)
function playSound() {
    // Create a cheerful beep sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99]; // C, E, G (happy chord)
    
    notes.forEach((freq, index) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.frequency.value = freq;
        osc.type = 'sine';
        
        const startTime = audioContext.currentTime + (index * 0.1);
        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
        
        osc.start(startTime);
        osc.stop(startTime + 0.5);
    });
}

// Handle window resize to adjust button teleportation area
window.addEventListener('resize', () => {
    if (isMobile) {
        // Reset on mobile resize if needed
    }
});
