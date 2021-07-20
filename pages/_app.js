import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { AlurakutStyles } from '../src/lib/AlurakutCommoms';

const GlobalStyle = createGlobalStyle`
  /* RESET CSS */
  *{
    margin: 0;
    padding: 0;
    font-family: sans-serif;
    box-sizing: border-box;
  }

  body {
    background: #44484d;
    font-family: sans-serif;
  }

  #__next{
    display: flex;
    min-heigth: 100vh;
    flex-direction: column;

  }

  img{
    max-width: 100%;
    heigth: auto;
    display: block;
  }

  ${AlurakutStyles} /* carregando stylos de css de outro arquivo */
`

const theme = {
  colors: {
    primary: '#0070f3',
  },
}

export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}
