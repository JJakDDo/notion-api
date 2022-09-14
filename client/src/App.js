//import "./App.css";
import Block from "./components/Block";
import { useFetch } from "./hooks/useFetch";
import { getListGroup } from "./utils/utils";
import { Box, Container } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiTypography: {
      variants: [
        {
          props: { variant: "title" }, // combination of props for which the styles will be applied
          style: {
            fontWeight: "700",
            fontSize: "40px",
            margin: "20px 0",
            width: "60vw",
          },
        },
      ],
    },
  },
  typography: {
    h1: {
      width: "70%",
      marginTop: "2em",
      marginBottom: "4px",
      fontSize: "1.875em",
      fontWeight: 500,
    },
    h2: {
      width: "70%",
      marginTop: "1.4em",
      marginBottom: "1px",
      fontSize: "1.5em",
      fontWeight: 500,
    },
    h3: {
      width: "70%",
      marginTop: "1em",
      marginBottom: "1px",
      fontSize: "1.25em",
      fontWeight: 500,
    },
    p: {
      width: "100%",
      margin: "1px",
      lineHeight: "1.5",
      textAlign: "justify",
      padding: "4px 0",
    },
  },
});

function App() {
  const data = useFetch({ id: "a97c07156a2647d89cefefd63226fff0" });
  const ids = Object.keys(data);
  const blockGroup = getListGroup(data);

  return (
    <Container
      fixed
      sx={{
        width: "100vw",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ThemeProvider theme={theme}>
        {ids.map((id) => (
          <Block
            key={id}
            value={data[id].value}
            blockGroup={blockGroup}
            depth={0}
          />
        ))}
      </ThemeProvider>
    </Container>
  );
}

export default App;
