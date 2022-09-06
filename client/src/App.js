import "./App.css";
import Block from "./components/Block";
import { useFetch } from "./hooks/useFetch";
import { getListGroup } from "./utils/utils";

function App() {
  const data = useFetch({ id: "a97c07156a2647d89cefefd63226fff0" });
  const ids = Object.keys(data);
  const blockGroup = getListGroup(data);

  return (
    <div className='App'>
      {ids.map((id) => (
        <Block
          key={id}
          value={data[id].value}
          blockGroup={blockGroup}
          depth={0}
        />
      ))}
    </div>
  );
}

export default App;
