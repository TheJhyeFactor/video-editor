import { useState, useRef, useEffect } from 'react';
import { Upload, Download, Scissors, Play, Pause, RotateCcw, Sparkles, Film, Github, User } from 'lucide-react';
import './App.css';

function App() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(100);
  const [selectedEffect, setSelectedEffect] = useState('none');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [processing, setProcessing] = useState(false);

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setTrimStart(0);
      setTrimEnd(100);
      setCurrentTime(0);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);

      // Auto-pause at trim end
      const trimEndTime = (trimEnd / 100) * duration;
      if (videoRef.current.currentTime >= trimEndTime) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const time = percent * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleReset = () => {
    setTrimStart(0);
    setTrimEnd(100);
    setSelectedEffect('none');
    setPlaybackSpeed(1);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const handleExport = async () => {
    setProcessing(true);

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // For now, just download the original with a new name
    // In a real implementation, you'd use FFmpeg to actually process the video
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `edited-${videoFile.name}`;
    a.click();

    setProcessing(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const effects = [
    { id: 'none', name: 'None', filter: 'none' },
    { id: 'grayscale', name: 'Grayscale', filter: 'grayscale(100%)' },
    { id: 'sepia', name: 'Sepia', filter: 'sepia(100%)' },
    { id: 'blur', name: 'Blur', filter: 'blur(3px)' },
    { id: 'brightness', name: 'Bright', filter: 'brightness(1.3)' },
    { id: 'contrast', name: 'Contrast', filter: 'contrast(1.5)' },
    { id: 'vintage', name: 'Vintage', filter: 'sepia(50%) contrast(1.2) brightness(0.9)' }
  ];

  const speeds = [
    { value: 0.5, label: '0.5x' },
    { value: 0.75, label: '0.75x' },
    { value: 1, label: '1x' },
    { value: 1.25, label: '1.25x' },
    { value: 1.5, label: '1.5x' },
    { value: 2, label: '2x' }
  ];

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <Film size={28} className="logo-icon" />
          <h1>VideoFlow</h1>
          <span className="subtitle">Browser Video Editor</span>
        </div>
        <div className="header-right">
          <div className="user-info">
            <User size={16} />
            <span>TheJhyeFactor</span>
          </div>
          <a
            href="https://github.com/TheJhyeFactor"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
          >
            <Github size={20} />
          </a>
        </div>
      </header>

      <div className="main-content">
        {!videoFile ? (
          <div className="upload-area">
            <div className="upload-card">
              <Film size={64} className="upload-icon" />
              <h2>Start Your Project</h2>
              <p>Upload a video to begin editing</p>
              <button
                onClick={() => fileInputRef.current.click()}
                className="upload-btn"
              >
                <Upload size={20} />
                Choose Video File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <div className="upload-info">
                <p>Supported formats: MP4, WebM, MOV, AVI</p>
                <p>Built with ❤️ by TheJhyeFactor • 2025</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="editor-layout">
            <div className="video-section">
              <div className="video-container">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  style={{ filter: effects.find(e => e.id === selectedEffect)?.filter }}
                />
                <div className="video-controls">
                  <button onClick={handlePlayPause} className="control-btn play-btn">
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </button>
                  <div className="time-display">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>
              </div>

              <div className="timeline">
                <div className="timeline-header">
                  <span>Timeline</span>
                  <span className="timeline-duration">{formatTime(duration)}</span>
                </div>
                <div className="timeline-track" onClick={handleSeek}>
                  <div
                    className="trim-overlay left"
                    style={{ width: `${trimStart}%` }}
                  />
                  <div
                    className="trim-overlay right"
                    style={{ width: `${100 - trimEnd}%` }}
                  />
                  <div
                    className="playhead"
                    style={{ left: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
                <div className="trim-controls">
                  <div className="trim-input">
                    <label>Start: {formatTime((trimStart / 100) * duration)}</label>
                    <input
                      type="range"
                      min="0"
                      max={trimEnd - 1}
                      value={trimStart}
                      onChange={(e) => setTrimStart(Number(e.target.value))}
                    />
                  </div>
                  <div className="trim-input">
                    <label>End: {formatTime((trimEnd / 100) * duration)}</label>
                    <input
                      type="range"
                      min={trimStart + 1}
                      max="100"
                      value={trimEnd}
                      onChange={(e) => setTrimEnd(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="controls-section">
              <div className="control-panel">
                <h3><Sparkles size={18} /> Effects</h3>
                <div className="effects-grid">
                  {effects.map(effect => (
                    <button
                      key={effect.id}
                      className={`effect-btn ${selectedEffect === effect.id ? 'active' : ''}`}
                      onClick={() => setSelectedEffect(effect.id)}
                    >
                      {effect.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="control-panel">
                <h3><Play size={18} /> Playback Speed</h3>
                <div className="speed-controls">
                  {speeds.map(speed => (
                    <button
                      key={speed.value}
                      className={`speed-btn ${playbackSpeed === speed.value ? 'active' : ''}`}
                      onClick={() => setPlaybackSpeed(speed.value)}
                    >
                      {speed.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="action-buttons">
                <button onClick={handleReset} className="action-btn reset-btn">
                  <RotateCcw size={18} />
                  Reset
                </button>
                <button onClick={() => fileInputRef.current.click()} className="action-btn new-btn">
                  <Upload size={18} />
                  New Video
                </button>
                <button
                  onClick={handleExport}
                  className="action-btn export-btn"
                  disabled={processing}
                >
                  <Download size={18} />
                  {processing ? 'Processing...' : 'Export Video'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="footer">
        <p>© 2025 VideoFlow - Created by <a href="https://github.com/TheJhyeFactor" target="_blank" rel="noopener noreferrer">TheJhyeFactor</a></p>
        <p>Professional browser-based video editing • No uploads required</p>
      </footer>
    </div>
  );
}

export default App;
