document.addEventListener('DOMContentLoaded', function() {
    // DOM manupulation Elements
        const audio = document.getElementById('audio');
    const mainCover = document.getElementById('main-cover');
    const rightCover = document.getElementById('right-cover');
    const songTitle = document.getElementById('current-album');
    const rightTitle = document.getElementById('right-album');
    const songArtist = document.getElementById('current-artist');
    const rightArtist = document.getElementById('right-artist');
    const lyrics = document.getElementById('lyrics');
    const progress = document.getElementById('progress');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const prevBtn = document.getElementById('prev-btn');
    const playBtn = document.getElementById('play-btn');
    const nextBtn = document.getElementById('next-btn');
    const songList = document.getElementById('song-list');
    const searchInput = document.getElementById('search-input');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const repeatBtn = document.getElementById('repeat-btn');

    let currentSongIndex = 0;
    let isPlaying = false;
    let isShuffle = false;
    let isRepeat = false;

    function initPlayer() {
        populatePlaylist();
        loadSong(songs[currentSongIndex]);
        setupEventListeners();
    }

    function loadSong(song) {
        songTitle.textContent = song.title;
        rightTitle.textContent = song.title;
        songArtist.textContent = song.artist;
        rightArtist.textContent = song.artist;
        audio.src = song.src;
        mainCover.src = song.cover;
        rightCover.src = song.cover;
        lyrics.innerHTML = song.lyrics.replace(/\n/g, '<br>');
        durationEl.textContent = song.duration;

        const background = document.getElementById('background-blur');
        if (background) {
            background.style.backgroundImage = `url('${song.cover}')`;
        }

        updateActiveSong();
        if (isPlaying) {
            audio.play().catch(e => console.log("Auto-play prevented:", e));
        }
    }

    function playSong() {
        isPlaying = true;
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        audio.play().catch(e => console.log("Play error:", e));
    }

    function pauseSong() {
        isPlaying = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        audio.pause();
    }

    function prevSong() {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(songs[currentSongIndex]);
        if (isPlaying) playSong();
    }

    function nextSong() {
        if (isRepeat) {
            loadSong(songs[currentSongIndex]);
        } else if (isShuffle) {
            let nextIndex;
            do {
                nextIndex = Math.floor(Math.random() * songs.length);
            } while (nextIndex === currentSongIndex);
            currentSongIndex = nextIndex;
            loadSong(songs[currentSongIndex]);
        } else {
            currentSongIndex = (currentSongIndex + 1) % songs.length;
            loadSong(songs[currentSongIndex]);
        }
        if (isPlaying) playSong();
    }

    function updateProgress() {
        const { duration, currentTime } = audio;
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
        currentTimeEl.textContent = formatTime(currentTime);
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    }

    function populatePlaylist() {
        songList.innerHTML = '';
        songs.forEach((song, index) => {
            const li = document.createElement('li');
            li.textContent = `${song.title} - ${song.artist}`;
            li.addEventListener('click', () => {
                currentSongIndex = index;
                loadSong(songs[currentSongIndex]);
                playSong();
            });
            songList.appendChild(li);
        });
        updateActiveSong();
    }
    initPlayer();
});