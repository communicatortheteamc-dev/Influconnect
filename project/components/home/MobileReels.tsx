import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";

const videos = [
  "/videos/mobilereel1.mp4",
  "/videos/mobilereel2.mp4",
  "/videos/mobilereel3.mp4",
];

export default function MobileReelsFresh(): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeSlot, setActiveSlot] = useState<0 | 1>(0);
  const transitioningRef = useRef(false);

  const videoARef = useRef<HTMLVideoElement | null>(null);
  const videoBRef = useRef<HTMLVideoElement | null>(null);

  const controlA = useAnimation();
  const controlB = useAnimation();

  const prepareAndPlay = async (
    videoEl: HTMLVideoElement | null,
    url: string
  ) => {
    if (!videoEl) return;

    videoEl.src = url;
    videoEl.load();
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

  const transitionToNext = async () => {
    if (transitioningRef.current) return;
    transitioningRef.current = true;

    const nextIndex = (currentIndex + 1) % videos.length;
    const nextSlot: 0 | 1 = activeSlot === 0 ? 1 : 0;

    const currentWrapperControl = activeSlot === 0 ? controlA : controlB;
    const nextWrapperControl = nextSlot === 0 ? controlA : controlB;
    const nextVideoEl = nextSlot === 0 ? videoARef.current : videoBRef.current;
    const currentVideoEl = activeSlot === 0 ? videoARef.current : videoBRef.current;

    // Prepare next video
    await prepareAndPlay(nextVideoEl, videos[nextIndex]);
    await nextWrapperControl.set({ y: "100%" });

    // Animate transition
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

    // Clean up previous video listener
    if (currentVideoEl) {
      currentVideoEl.pause();
      currentVideoEl.currentTime = 0;
      currentVideoEl.removeEventListener("ended", transitionToNext);
    }

    // ✅ Attach listener to the new active video
    nextVideoEl?.addEventListener("ended", transitionToNext);

    setActiveSlot(nextSlot);
    setCurrentIndex(nextIndex);

    transitioningRef.current = false;
  };

  useEffect(() => {
    const firstVideo = videoARef.current;
    if (firstVideo) {
      prepareAndPlay(firstVideo, videos[0]);
      firstVideo.addEventListener("ended", transitionToNext);
    }

    return () => {
      videoARef.current?.removeEventListener("ended", transitionToNext);
      videoBRef.current?.removeEventListener("ended", transitionToNext);
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
