import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload, Download, Scissors, Play, Pause, RotateCcw, Sparkles, Film, Github, User,
  Type, Volume2, VolumeX, Crop, Image, Maximize2, Settings, ZoomIn, ZoomOut,
  SkipBack, SkipForward, Layers, Undo, Redo, Save, FileVideo
} from 'lucide-react';
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
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [dragActive, setDragActive] = useState(false);
  const [textOverlays, setTextOverlays] = useState([]);
  const [showTextPanel, setShowTextPanel] = useState(false);
  const [showAudioPanel, setShowAudioPanel] = useState(false);
  const [showCropPanel, setShowCropPanel] = useState(false);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [exportFormat, setExportFormat] = useState('mp4');
  const [exportQuality, setExportQuality] = useState('high');
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch(e.key) {
        case ' ':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'ArrowLeft':
          if (videoRef.current) videoRef.current.currentTime -= 5;
          break;
        case 'ArrowRight':
          if (videoRef.current) videoRef.current.currentTime += 5;
          break;
        case 'm':
          setIsMuted(!isMuted);
          break;
        case 'f':
          if (videoRef.current) videoRef.current.requestFullscreen();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, isMuted]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      loadVideoFile(file);
    }
  }, []);

  const loadVideoFile = (file) => {
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setTrimStart(0);
    setTrimEnd(100);
    setCurrentTime(0);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setTextOverlays([]);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      loadVideoFile(file);
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

  const addTextOverlay = () => {
    const newOverlay = {
      id: Date.now(),
      text: 'New Text',
      x: 50,
      y: 50,
      fontSize: 32,
      color: '#ffffff',
      fontWeight: 'bold',
      startTime: currentTime,
      endTime: duration
    };
    setTextOverlays([...textOverlays, newOverlay]);
  };

  const updateTextOverlay = (id, updates) => {
    setTextOverlays(textOverlays.map(overlay =>
      overlay.id === id ? { ...overlay, ...updates } : overlay
    ));
  };

  const deleteTextOverlay = (id) => {
    setTextOverlays(textOverlays.filter(overlay => overlay.id !== id));
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleReset = () => {
    setTrimStart(0);
    setTrimEnd(100);
    setSelectedEffect('none');
    setPlaybackSpeed(1);
    setVolume(100);
    setIsMuted(false);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setTextOverlays([]);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const handleExport = async () => {
    setShowExportPanel(false);
    setProcessing(true);

    try {
      const video = videoRef.current;
      if (!video) return;

      // Create canvas for recording
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');

      // Calculate trim times
      const startTime = (trimStart / 100) * duration;
      const endTime = (trimEnd / 100) * duration;
      const trimDuration = endTime - startTime;

      // Set video to start position
      video.currentTime = startTime;
      await new Promise(resolve => {
        video.onseeked = resolve;
      });

      // Setup MediaRecorder
      const stream = canvas.captureStream(30); // 30 FPS

      // Add audio from video if not muted
      if (!isMuted && video.captureStream) {
        const videoStream = video.captureStream();
        const audioTracks = videoStream.getAudioTracks();
        if (audioTracks.length > 0) {
          stream.addTrack(audioTracks[0]);
        }
      }

      const mimeType = exportFormat === 'webm' ? 'video/webm' : 'video/webm'; // Browser support
      const recorder = new MediaRecorder(stream, {
        mimeType: mimeType,
        videoBitsPerSecond: exportQuality === 'ultra' ? 8000000 :
                           exportQuality === 'high' ? 5000000 :
                           exportQuality === 'medium' ? 2500000 : 1000000
      });

      const chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `videoflow-edited-${Date.now()}.${exportFormat === 'webm' ? 'webm' : 'webm'}`;
        a.click();
        URL.revokeObjectURL(url);
        setProcessing(false);
      };

      // Start recording
      recorder.start();
      video.play();

      // Draw video frames with effects
      const drawFrame = () => {
        if (video.currentTime >= endTime || video.paused || video.ended) {
          recorder.stop();
          video.pause();
          video.currentTime = 0;
          return;
        }

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Save context state
        ctx.save();

        // Apply transformations
        ctx.translate(canvas.width / 2, canvas.height / 2);
        if (rotation !== 0) ctx.rotate((rotation * Math.PI) / 180);
        if (flipH) ctx.scale(-1, 1);
        if (flipV) ctx.scale(1, -1);
        const scale = zoom / 100;
        ctx.scale(scale, scale);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);

        // Apply CSS filters
        ctx.filter = getVideoFilter();

        // Draw video frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Reset filter for text
        ctx.filter = 'none';

        // Restore context
        ctx.restore();

        // Draw text overlays
        textOverlays.forEach(overlay => {
          if (video.currentTime >= overlay.startTime && video.currentTime <= overlay.endTime) {
            ctx.font = `${overlay.fontWeight} ${overlay.fontSize * (canvas.width / video.offsetWidth)}px Arial`;
            ctx.fillStyle = overlay.color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const x = (overlay.x / 100) * canvas.width;
            const y = (overlay.y / 100) * canvas.height;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 4;
            ctx.fillText(overlay.text, x, y);
          }
        });

        requestAnimationFrame(drawFrame);
      };

      drawFrame();

    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Your browser may not support video recording. Try using Chrome or Edge.');
      setProcessing(false);
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, currentTime - 10);
    }
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(duration, currentTime + 10);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getVideoFilter = () => {
    let filters = [];

    filters.push(`brightness(${brightness}%)`);
    filters.push(`contrast(${contrast}%)`);
    filters.push(`saturate(${saturation}%)`);

    const effectFilter = effects.find(e => e.id === selectedEffect)?.filter;
    if (effectFilter && effectFilter !== 'none') {
      filters.push(effectFilter);
    }

    return filters.join(' ');
  };

  const getVideoTransform = () => {
    let transforms = [];

    if (rotation !== 0) transforms.push(`rotate(${rotation}deg)`);
    if (flipH) transforms.push('scaleX(-1)');
    if (flipV) transforms.push('scaleY(-1)');
    if (zoom !== 100) transforms.push(`scale(${zoom / 100})`);

    return transforms.join(' ');
  };

  const effects = [
    { id: 'none', name: 'None', filter: 'none' },
    { id: 'grayscale', name: 'Grayscale', filter: 'grayscale(100%)' },
    { id: 'sepia', name: 'Sepia', filter: 'sepia(100%)' },
    { id: 'blur', name: 'Blur', filter: 'blur(3px)' },
    { id: 'invert', name: 'Invert', filter: 'invert(100%)' },
    { id: 'hueRotate', name: 'Hue Rotate', filter: 'hue-rotate(90deg)' },
    { id: 'vintage', name: 'Vintage', filter: 'sepia(50%) contrast(1.2)' },
    { id: 'warm', name: 'Warm', filter: 'sepia(30%) saturate(130%)' },
    { id: 'cool', name: 'Cool', filter: 'hue-rotate(180deg) saturate(120%)' }
  ];

  const speeds = [
    { value: 0.25, label: '0.25x' },
    { value: 0.5, label: '0.5x' },
    { value: 0.75, label: '0.75x' },
    { value: 1, label: '1x' },
    { value: 1.25, label: '1.25x' },
    { value: 1.5, label: '1.5x' },
    { value: 2, label: '2x' },
    { value: 3, label: '3x' }
  ];

  return (
    <div
      className="app"
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <header className="header">
        <div className="header-left">
          <Film size={24} className="logo-icon" />
          <div className="header-title">
            <h1>VideoFlow</h1>
            <span className="subtitle">Professional Video Editor</span>
          </div>
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
            title="GitHub Profile"
          >
            <Github size={18} />
          </a>
        </div>
      </header>

      {!videoFile ? (
        <div className={`upload-area ${dragActive ? 'drag-active' : ''}`}>
          <div className="upload-card">
            <Upload size={80} className="upload-icon" />
            <h2>Drop Your Video Here</h2>
            <p>or click to browse your files</p>
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
              <p><strong>Supported:</strong> MP4, WebM, MOV, AVI, MKV</p>
              <p><strong>Max Size:</strong> Unlimited (browser-based processing)</p>
            </div>
            <div className="feature-list">
              <div className="feature-item"><Sparkles size={16} /> Visual Effects</div>
              <div className="feature-item"><Scissors size={16} /> Trim & Cut</div>
              <div className="feature-item"><Type size={16} /> Text Overlays</div>
              <div className="feature-item"><Volume2 size={16} /> Audio Control</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="editor-workspace">
          {/* Toolbar */}
          <div className="toolbar">
            <div className="toolbar-section">
              <button
                onClick={() => setShowTextPanel(!showTextPanel)}
                className={`toolbar-btn ${showTextPanel ? 'active' : ''}`}
                title="Text Overlays"
              >
                <Type size={20} />
                <span>Text</span>
              </button>
              <button
                onClick={() => setShowAudioPanel(!showAudioPanel)}
                className={`toolbar-btn ${showAudioPanel ? 'active' : ''}`}
                title="Audio Controls"
              >
                <Volume2 size={20} />
                <span>Audio</span>
              </button>
              <button
                onClick={() => setShowCropPanel(!showCropPanel)}
                className={`toolbar-btn ${showCropPanel ? 'active' : ''}`}
                title="Transform & Crop"
              >
                <Crop size={20} />
                <span>Transform</span>
              </button>
            </div>
            <div className="toolbar-section">
              <button onClick={handleReset} className="toolbar-btn" title="Reset All">
                <RotateCcw size={20} />
                <span>Reset</span>
              </button>
              <button onClick={() => setShowExportPanel(true)} className="toolbar-btn export" title="Export Video">
                <Download size={20} />
                <span>Export</span>
              </button>
              <button onClick={() => fileInputRef.current.click()} className="toolbar-btn" title="Load New Video">
                <Upload size={20} />
                <span>New</span>
              </button>
            </div>
          </div>

          <div className="editor-main">
            {/* Left Sidebar - Panels */}
            <div className={`left-sidebar ${showTextPanel || showAudioPanel || showCropPanel ? 'visible' : ''}`}>
              {showTextPanel && (
                <div className="panel">
                  <div className="panel-header">
                    <h3><Type size={18} /> Text Overlays</h3>
                    <button onClick={() => setShowTextPanel(false)} className="close-btn">×</button>
                  </div>
                  <div className="panel-content">
                    <button onClick={addTextOverlay} className="add-btn">
                      + Add Text
                    </button>
                    {textOverlays.map(overlay => (
                      <div key={overlay.id} className="text-overlay-item">
                        <input
                          type="text"
                          value={overlay.text}
                          onChange={(e) => updateTextOverlay(overlay.id, { text: e.target.value })}
                          className="text-input"
                        />
                        <div className="text-controls">
                          <label>
                            Size
                            <input
                              type="range"
                              min="12"
                              max="100"
                              value={overlay.fontSize}
                              onChange={(e) => updateTextOverlay(overlay.id, { fontSize: Number(e.target.value) })}
                            />
                          </label>
                          <label>
                            Color
                            <input
                              type="color"
                              value={overlay.color}
                              onChange={(e) => updateTextOverlay(overlay.id, { color: e.target.value })}
                            />
                          </label>
                        </div>
                        <button onClick={() => deleteTextOverlay(overlay.id)} className="delete-btn">Delete</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {showAudioPanel && (
                <div className="panel">
                  <div className="panel-header">
                    <h3><Volume2 size={18} /> Audio Controls</h3>
                    <button onClick={() => setShowAudioPanel(false)} className="close-btn">×</button>
                  </div>
                  <div className="panel-content">
                    <div className="audio-control">
                      <div className="control-label">
                        <span>Volume</span>
                        <span>{volume}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="volume-slider"
                      />
                      <button onClick={toggleMute} className={`mute-btn ${isMuted ? 'muted' : ''}`}>
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        {isMuted ? 'Unmute' : 'Mute'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {showCropPanel && (
                <div className="panel">
                  <div className="panel-header">
                    <h3><Crop size={18} /> Transform</h3>
                    <button onClick={() => setShowCropPanel(false)} className="close-btn">×</button>
                  </div>
                  <div className="panel-content">
                    <div className="transform-controls">
                      <label>
                        Rotation
                        <div className="rotation-btns">
                          <button onClick={() => setRotation((rotation - 90) % 360)}>↶ -90°</button>
                          <span>{rotation}°</span>
                          <button onClick={() => setRotation((rotation + 90) % 360)}>↷ +90°</button>
                        </div>
                      </label>
                      <label>
                        Flip
                        <div className="flip-btns">
                          <button onClick={() => setFlipH(!flipH)} className={flipH ? 'active' : ''}>
                            Horizontal
                          </button>
                          <button onClick={() => setFlipV(!flipV)} className={flipV ? 'active' : ''}>
                            Vertical
                          </button>
                        </div>
                      </label>
                      <label>
                        Zoom: {zoom}%
                        <input
                          type="range"
                          min="50"
                          max="200"
                          value={zoom}
                          onChange={(e) => setZoom(Number(e.target.value))}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Center - Video Player */}
            <div className="video-workspace">
              <div className="video-container">
                <div className="video-wrapper">
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    style={{
                      filter: getVideoFilter(),
                      transform: getVideoTransform()
                    }}
                  />
                  {textOverlays.map(overlay => (
                    currentTime >= overlay.startTime && currentTime <= overlay.endTime && (
                      <div
                        key={overlay.id}
                        className="video-text-overlay"
                        style={{
                          top: `${overlay.y}%`,
                          left: `${overlay.x}%`,
                          fontSize: `${overlay.fontSize}px`,
                          color: overlay.color,
                          fontWeight: overlay.fontWeight
                        }}
                      >
                        {overlay.text}
                      </div>
                    )
                  ))}
                </div>

                <div className="playback-controls">
                  <button onClick={skipBackward} className="control-btn" title="Skip backward 10s">
                    <SkipBack size={18} />
                  </button>
                  <button onClick={handlePlayPause} className="control-btn play-btn" title="Play/Pause (Space)">
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </button>
                  <button onClick={skipForward} className="control-btn" title="Skip forward 10s">
                    <SkipForward size={18} />
                  </button>
                  <div className="time-display">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                  <button onClick={toggleMute} className="control-btn volume-btn" title="Mute (M)">
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                </div>
              </div>

              {/* Timeline */}
              <div className="timeline-section">
                <div className="timeline-header">
                  <span><Scissors size={16} /> Timeline</span>
                  <span className="timeline-duration">{formatTime(duration)}</span>
                </div>
                <div className="timeline-track" onClick={handleSeek}>
                  <div className="trim-overlay left" style={{ width: `${trimStart}%` }} />
                  <div className="trim-overlay right" style={{ width: `${100 - trimEnd}%` }} />
                  <div className="playhead" style={{ left: `${(currentTime / duration) * 100}%` }} />
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

            {/* Right Sidebar - Effects & Adjustments */}
            <div className="right-sidebar">
              <div className="panel">
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

              <div className="panel">
                <h3><Settings size={18} /> Adjustments</h3>
                <div className="adjustment-controls">
                  <label>
                    Brightness: {brightness}%
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                    />
                  </label>
                  <label>
                    Contrast: {contrast}%
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={contrast}
                      onChange={(e) => setContrast(Number(e.target.value))}
                    />
                  </label>
                  <label>
                    Saturation: {saturation}%
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={saturation}
                      onChange={(e) => setSaturation(Number(e.target.value))}
                    />
                  </label>
                </div>
              </div>

              <div className="panel">
                <h3><Play size={18} /> Playback</h3>
                <div className="speed-grid">
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
            </div>
          </div>

          {/* Keyboard Shortcuts Help */}
          <div className="shortcuts-hint">
            <span>💡 Shortcuts:</span> Space=Play/Pause • ←→=Seek • M=Mute • F=Fullscreen
          </div>
        </div>
      )}

      {/* Processing Overlay */}
      {processing && (
        <div className="modal-overlay">
          <div className="processing-modal">
            <div className="spinner"></div>
            <h3>Rendering Your Video...</h3>
            <p>Applying all effects and text overlays</p>
            <p style={{fontSize: '0.85rem', color: '#999', marginTop: '12px'}}>
              This may take a few moments depending on video length
            </p>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportPanel && (
        <div className="modal-overlay" onClick={() => setShowExportPanel(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><Download size={20} /> Export Video</h3>
              <button onClick={() => setShowExportPanel(false)} className="close-btn">×</button>
            </div>
            <div className="modal-content">
              <div className="export-options">
                <label>
                  Quality
                  <select value={exportQuality} onChange={(e) => setExportQuality(e.target.value)}>
                    <option value="low">Low (1 Mbps)</option>
                    <option value="medium">Medium (2.5 Mbps)</option>
                    <option value="high">High (5 Mbps)</option>
                    <option value="ultra">Ultra (8 Mbps)</option>
                  </select>
                </label>
              </div>
              <div className="export-info">
                <p><strong>Duration:</strong> {formatTime((trimEnd - trimStart) / 100 * duration)}</p>
                <p><strong>Format:</strong> WebM (browser recording)</p>
                <p><strong>Effects Applied:</strong> {
                  [
                    selectedEffect !== 'none' && 'Visual Filter',
                    brightness !== 100 && 'Brightness',
                    contrast !== 100 && 'Contrast',
                    saturation !== 100 && 'Saturation',
                    rotation !== 0 && 'Rotation',
                    flipH && 'Flip H',
                    flipV && 'Flip V',
                    zoom !== 100 && 'Zoom'
                  ].filter(Boolean).join(', ') || 'None'
                }</p>
                <p><strong>Text Overlays:</strong> {textOverlays.length}</p>
                <p style={{fontSize: '0.8rem', color: '#999', marginTop: '12px'}}>
                  ⚠️ Export will re-encode your video with all effects applied. This may take time depending on video length.
                </p>
              </div>
              <button onClick={handleExport} className="export-btn-large" disabled={processing}>
                <Download size={20} />
                {processing ? 'Rendering Video...' : 'Start Export'}
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>© 2025 VideoFlow - Created by <a href="https://github.com/TheJhyeFactor" target="_blank" rel="noopener noreferrer">TheJhyeFactor</a></p>
        <p>Professional browser-based video editing • Complete privacy • No uploads required</p>
      </footer>
    </div>
  );
}

export default App;
