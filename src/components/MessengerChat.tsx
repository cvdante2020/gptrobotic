"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

export default function MessengerChat() {
  useEffect(() => {
    const initFacebookChat = () => {
      if (window.FB) {
        window.FB.init({
          xfbml: true,
          version: "v18.0",
        });
      }
    };

    // Asignar función de inicialización global
    window.fbAsyncInit = initFacebookChat;

    // Evitar duplicar script si ya está cargado
    if (!document.getElementById("facebook-jssdk")) {
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/es_ES/sdk/xfbml.customerchat.js";
      script.async = true;
      script.defer = true;
      script.onload = initFacebookChat;
      document.body.appendChild(script);
    } else {
      initFacebookChat();
    }
  }, []);

  return (
    <>
      <div id="fb-root"></div>
      <div
        className="fb-customerchat"
        data-attribution="setup_tool"
        data-page-id="614170605117896"
        data-theme-color="#0084FF"
        data-logged-in-greeting="Hola 👋 ¿En qué podemos ayudarte?"
        data-logged-out-greeting="Hola 👋 ¿En qué podemos ayudarte?"
      ></div>
    </>
  );
}
