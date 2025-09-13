import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";

const videos = [
  "https://res.cloudinary.com/dzfnaks6l/video/upload/v1757577802/mobilereel2_awx6cc.mp4",
  "https://res.cloudinary.com/dzfnaks6l/video/upload/v1757577801/mobilereel1_wwcp2g.mp4",
  "https://res.cloudinary.com/dzfnaks6l/video/upload/v1757577802/mobilereel3_g0ntso.mp4",
];

export default function MobileReelsFresh(): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeSlot, setActiveSlot] = useState<0 | 1>(0);
  const transitioningRef = useRef(false);

  const videoARef = useRef<HTMLVideoElement | null>(null);
  const videoBRef = useRef<HTMLVideoElement | null>(null);

  const controlA = useAnimation();
  const controlB = useAnimation();

  const prepareAndPlay = async (videoEl: HTMLVideoElement | null, url: string) => {
    if (!videoEl) return;

    videoEl.src = url;
    videoEl.load(); // ✅ force reload
    videoEl.currentTime = 0;
    videoEl.muted = true;
    videoEl.playsInline = true;
    videoEl.autoplay = true;

    try {
      await videoEl.play();
    } catch (err) {
      console.warn("Autoplay blocked, waiting for user interaction:", err);
    }
  };

  const handleEnded = () => {
    transitionToNext();
  };

  const transitionToNext = async () => {
    if (transitioningRef.current) return;
    transitioningRef.current = true;

    const nextIndex = (currentIndex + 1) % videos.length;
    const nextSlot: 0 | 1 = activeSlot === 0 ? 1 : 0;

    const currentWrapperControl = activeSlot === 0 ? controlA : controlB;
    const nextWrapperControl = nextSlot === 0 ? controlA : controlB;
    const nextVideoEl = nextSlot === 0 ? videoARef.current : videoBRef.current;
    const currentVideoEl = activeSlot === 0 ? videoARef.current : videoBRef.current;

    // Load next video
    await prepareAndPlay(nextVideoEl, videos[nextIndex]);
    await nextWrapperControl.set({ y: "100%" });

    await Promise.all([
      currentWrapperControl.start({
        y: "-100%",
        transition: { duration: 0.6, ease: "easeInOut" },
      }),
      nextWrapperControl.start({
        y: "0%",
        transition: { duration: 0.6, ease: "easeInOut" },
      }),
    ]);

    if (currentVideoEl) {
      currentVideoEl.pause();
      currentVideoEl.currentTime = 0;
    }

    setActiveSlot(nextSlot);
    setCurrentIndex(nextIndex);

    nextVideoEl?.removeEventListener("ended", handleEnded);
    nextVideoEl?.addEventListener("ended", handleEnded);

    transitioningRef.current = false;
  };

  useEffect(() => {
    const activeVideoEl = videoARef.current;
    if (activeVideoEl) {
      prepareAndPlay(activeVideoEl, videos[0]);
      activeVideoEl.addEventListener("ended", handleEnded);
    }

    return () => {
      videoARef.current?.removeEventListener("ended", handleEnded);
      videoBRef.current?.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <div className="flex justify-center items-center p-6">
      <div className="relative w-[280px] h-[560px] rounded-[40px] border-8 border-black overflow-hidden shadow-xl bg-black">
        {/* Video A */}
        <motion.div
          animate={controlA}
          initial={{ y: "0%" }}
          style={{ position: "absolute", inset: 0 }}
        >
          <video
            ref={videoARef}
            className="w-full h-full object-cover"
            muted
            playsInline
            autoPlay
          />
        </motion.div>

        {/* Video B */}
        <motion.div
          animate={controlB}
          initial={{ y: "100%" }}
          style={{ position: "absolute", inset: 0 }}
        >
          <video
            ref={videoBRef}
            className="w-full h-full object-cover"
            muted
            playsInline
            autoPlay
          />
        </motion.div>
      </div>
    </div>
  );
}
