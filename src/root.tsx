import { component$ } from "@builder.io/qwik";
import {
 QwikCityProvider,
 RouterOutlet,
 ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";

import "./global.css";
import { QwikPartytown } from "./components/partytown/partytown";

export default component$(() => {
 /**
  * The root of a QwikCity site always start with the <QwikCityProvider> component,
  * immediately followed by the document's <head> and <body>.
  *
  * Dont remove the `<head>` and `<body>` elements.
  */

 return (
  <QwikCityProvider>
   <head>
    {/** <!-- Google Tag Manager -->*/}
    <script
     type="text/partytown"
     dangerouslySetInnerHTML="<!-- Google Tag Manager -->(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-T2P8C2G');<!-- End Google Tag Manager -->"
    />
    {/**<!-- End Google Tag Manager -->*/}
    <meta charSet="utf-8" />
    <link rel="manifest" href="/manifest.json" />
    <QwikPartytown forward={["dataLayer.push"]} />
    <script
     async
     type="text/partytown"
     src="https://www.googletagmanager.com/gtag/js?id=G-NN34QFDQJV"
    />
    <RouterHead />
   </head>
   <body
    lang="sv"
    class="bg-gray-100 text-gray-800 font-sans leading-normal min-h-screen flex flex-col"
   >
    {/**<!-- Google Tag Manager (noscript) -->*/}
    <noscript>
     <iframe
      src="https://www.googletagmanager.com/ns.html?id=GTM-T2P8C2G"
      height="0"
      width="0"
      style="display:none;visibility:hidden"
     />
    </noscript>
    {/**<!-- End Google Tag Manager (noscript) -->*/}
    <RouterOutlet />
    <ServiceWorkerRegister />
   </body>
  </QwikCityProvider>
 );
});
