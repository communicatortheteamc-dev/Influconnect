import Stories from "react-insta-stories";

const stories = [
  { url: "https://res.cloudinary.com/dzfnaks6l/video/upload/v1757577802/mobilereel2_awx6cc.mp4", type: "video" },
  { url: "https://res.cloudinary.com/dzfnaks6l/video/upload/v1757577801/mobilereel1_wwcp2g.mp4", type: "video" },
  { url: "https://res.cloudinary.com/dzfnaks6l/video/upload/v1757577802/mobilereel3_g0ntso.mp4", type: "video" },
];

export default function Reels() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Stories
        stories={stories}
        defaultInterval={5000} // 5 sec
        width={300}
        height={550}
        loop
      />
    </div>
  );
}
