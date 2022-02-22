import { AuthProvider } from "../auth";
import Layout from "../components/Layout";
import "../styles/globals.css";
// import Script from "next/script";

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <AuthProvider>
        {/* <Script
          src="https://unpkg.com/flowbite@1.3.3/dist/flowbite.js"
          strategy="beforeInteractive"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/flowbite@1.3.3/dist/flowbite.min.css"
        /> */}
        <Component {...pageProps} />
      </AuthProvider>
    </Layout>
  );
}

export default MyApp;
