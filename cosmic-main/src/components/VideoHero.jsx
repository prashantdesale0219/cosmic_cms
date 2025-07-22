import React, { useRef, useEffect, useState } from 'react';

const VideoHero = () => {
  const videoRef = useRef(null);
  const buttonRef = useRef(null);
  const sectionRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const timeoutRef = useRef(null);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleVideo = () => {
    const video = videoRef.current;
    if (video) {
      paused ? video.play() : video.pause();
      setPaused(!paused);
    }
  };

  const handleMouseMove = (e) => {
    if (!sectionRef.current || isMobile) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Keep cursor inside section bounds
    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      mouse.current = { x, y };
      setShowButton(true);

      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setShowButton(false);
      }, 2000); // hide after 2 sec idle
    } else {
      setShowButton(false);
    }
  };

  useEffect(() => {
    if (isMobile) return;
    
    const animate = () => {
      const speed = 0.25;
      pos.current.x += (mouse.current.x - pos.current.x) * speed;
      pos.current.y += (mouse.current.y - pos.current.y) * speed;

      if (buttonRef.current) {
        buttonRef.current.style.left = `${pos.current.x}px`;
        buttonRef.current.style.top = `${pos.current.y}px`;
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, [isMobile]);

  return (
    <div
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ cursor: isMobile ? 'auto' : 'none' }}
      onMouseMove={handleMouseMove}
      onClick={isMobile ? toggleVideo : undefined}
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        src="/videos/zolar.mp4"
        className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Mobile Play/Pause Button */}
      {isMobile && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <button
            onClick={toggleVideo}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-opacity duration-300 pointer-events-auto ${paused ? 'opacity-80' : 'opacity-0'}`}
            style={{
              backgroundColor: '#cae28e',
              boxShadow: '0 0 20px 5px rgba(202, 226, 142, 0.3)',
            }}
          >
            <span className="text-black text-xl font-bold">
              {paused ? '▶' : '❚❚'}
            </span>
          </button>
        </div>
      )}

      {/* Desktop Cursor-replacing Button */}
      {!isMobile && (
        <button
          ref={buttonRef}
          onClick={toggleVideo}
          className={`w-20 h-20 absolute z-50 rounded-full flex items-center justify-center transition-opacity duration-300 ${showButton ? 'opacity-100' : 'opacity-0'}`}
          style={{
            backgroundColor: '#cae28e',
            boxShadow: '0 0 30px 10px rgba(202, 226, 142, 0.4)',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'auto',
          }}
        >
          <span className="text-black text-2xl font-bold pointer-events-none">
            {paused ? '▶' : '❚❚'}
          </span>
        </button>
      )}
    </div>
  );
};

export default VideoHero;
