// components/SocialSidebar.tsx
import Link from "next/link";

export default function SocialSidebar() {
  return (
    <div className="fixed top-1/3 right-4 flex flex-col gap-4 z-50">
      {/* WhatsApp */}
      <Link href="https://wa.me/919642426444" target="_blank">
        <div className="p-3 bg-green-500 rounded-full shadow-lg hover:scale-110 transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="white"
          >
            <path d="M12.04 2.5C6.54 2.5 2.04 7 2.04 12.5c0 2.14.67 4.13 1.82 5.77L2 23l5-1.8a9.96 9.96 0 005.04 1.3c5.5 0 10-4.5 10-10s-4.5-10-10-10zm0 18.18c-1.73 0-3.35-.5-4.7-1.37l-.34-.21-3 .98 1-2.88-.22-.35a8.15 8.15 0 01-1.3-4.35c0-4.5 3.67-8.18 8.18-8.18 4.5 0 8.18 3.68 8.18 8.18s-3.68 8.18-8.18 8.18z" />
            <path d="M17.06 14.8c-.3-.15-1.8-.89-2.08-.98-.28-.1-.48-.15-.67.15-.2.3-.77.98-.95 1.18-.17.2-.35.23-.65.08-.3-.15-1.26-.47-2.4-1.5-.89-.79-1.48-1.77-1.65-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.38-.02-.53-.07-.15-.67-1.6-.91-2.2-.24-.58-.48-.5-.67-.5h-.57c-.2 0-.53.08-.8.38-.28.3-1.06 1.03-1.06 2.5 0 1.48 1.08 2.9 1.23 3.1.15.2 2.12 3.25 5.14 4.55 3.02 1.3 3.02.87 3.57.82.55-.05 1.8-.73 2.05-1.43.25-.7.25-1.3.18-1.43-.07-.13-.27-.2-.57-.35z" />
          </svg>
        </div>
      </Link>

      {/* Facebook */}
      <Link href="https://www.facebook.com/profile.php?id=61578100237959&mibextid=rS40aB7S9Ucbxw6v" target="_blank">
        <div className="p-3 bg-blue-600 rounded-full shadow-lg hover:scale-110 transition">
          {/* Your Facebook SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="white">
            <path d="M24 12.5C24 5.87 18.63 0.5 12 0.5S0 5.87 0 12.5c0 6.02 4.39 10.98 10.13 11.85V15.97H7.08V12.5h3.05v-2.64c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.68.23 2.68.23v2.95h-1.51c-1.49 0-1.95.93-1.95 1.88v2.25h3.32l-.53 3.47h-2.79v8.38C19.61 23.48 24 18.52 24 12.5z"/>
          </svg>
        </div>
      </Link>

      {/* YouTube */}
      {/* <Link href="https://youtube.com" target="_blank">
        <div className="p-3 bg-red-600 rounded-full shadow-lg hover:scale-110 transition">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 24 18" fill="white">
            <path d="M23.47 3.15c-.14-.51-.41-.98-.78-1.35a2.62 2.62 0 00-1.35-.78C19.48.5 12 .5 12 .5s-7.51.01-9.37.52c-.51.14-.98.41-1.35.78-.37.37-.64.84-.78 1.35C-.06 6.5-.28 11.58.52 14.78c.14.51.41.98.78 1.35.37.37.84.64 1.35.78 1.87.52 9.37.52 9.37.52s7.5 0 9.36-.52c.52-.14.99-.41 1.36-.78.37-.37.64-.84.78-1.35.6-3.34.78-8.41-.65-11.65zM9.6 12.59V5.34l6.22 3.63-6.22 3.62z"/>
          </svg>
        </div>
      </Link> */}

      {/* Instagram */}
      <Link href="https://www.instagram.com/influ_connectbytheteamc?igsh=cTdxZXk1eXNzbG5m" target="_blank">
        <div className="p-3 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full shadow-lg hover:scale-110 transition">
          {/* Your Instagram SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="white">
            <path d="M18.375.5H5.625C2.52.5 0 3.02 0 6.12v12.75c0 3.11 2.52 5.63 5.625 5.63h12.75C21.48 24.5 24 21.98 24 18.88V6.12C24 3.02 21.48.5 18.375.5zM12 18.12a5.62 5.62 0 110-11.25 5.62 5.62 0 010 11.25zm7.13-10.43a1.31 1.31 0 11-2.62 0 1.31 1.31 0 012.62 0z"/>
          </svg>
        </div>
      </Link>
    </div>
  );
}
