// import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Providers } from "../Provider";



export default function MyApp({ Component, pageProps }) {
    
  return (
    <Providers pageProps={pageProps}>
      <Component {...pageProps} />
      {/* <Footer /> */}
    </Providers>
  );
}
