import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
// import TextToSpeechConverter from './components/TextToSpeechConverter';

function App() {
  return (
    <>
      <Loader />
      <Leva hidden/>
      <UI />
      {/* <TextToSpeechConverter/> */}
      <Canvas shadows camera={{ position: [0, 0, 1], fov: 30 }}>
        <Experience />
      </Canvas>
    </>
  );
}

export default App;
