"use client";

import { useEffect } from "react";

// Tipado mínimo para que TypeScript no marque error en `FB.init(...)`
interface FacebookSDK {
  init: (config: { xfbml: boolean; version: string }) => void;
  XFBML?: {
    parse: () => void;
  };
}

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: FacebookSDK;
  }
}

export default function MessengerChat() {
  useEffect(() => {
    window.fbAsyncInit = function () {
      if (window.FB) {
        window.FB.init({
          xfbml: true,
          version: "v18.0",
        });
      }
    };

    if (!document.getElementById("facebook-jssdk")) {
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/es_ES/sdk/xfbml.customerchat.js";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.FB?.XFBML?.parse) {
          window.FB.XFBML.parse();
        }
      };
      document.body.appendChild(script);
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
