import "./index.css";
import { Composition } from "remotion";
import { MyComposition, MyCompositionSchema } from "./Composition";
import { VideoCurto, VideoCurtoSchema } from "./VideoCurto";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Composição 1: Imagens Estáticas com Array */}
      <Composition
        id="VideosVerticais"
        component={MyComposition}
        schema={MyCompositionSchema}
        defaultProps={{
          textColor: "white",
          fontFamily: "bebas neue",
          fontSize: 105,
        }}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Composição 2: Cortes de Arquivo MP4 nativo (Remember Me) */}
      <Composition
        id="Cortes-RememberMe"
        component={VideoCurto}
        schema={VideoCurtoSchema}
        defaultProps={{
          videoName: "remember-me.mp4",
          textColor: "#facc15",
          texto: "CORTES ÉPICOS",
          cortes: [
            { inicio: 7.0, fim: 9.0 },
            { inicio: 18.0, fim: 21.0 },
            { inicio: 22.0, fim: 24.0 },
            { inicio: 30.0, fim: 33.0 },
            { inicio: 65.0, fim: 68.0 },
            { inicio: 81.0, fim: 83.0 },
            { inicio: 95.0, fim: 99.0 },
            { inicio: 100.0, fim: 102.0 },
            { inicio: 109.0, fim: 112.0 },
            { inicio: 116.0, fim: 119.0 },
            { inicio: 132.0, fim: 135.0 }
          ]
        }}
        durationInFrames={900} 
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Composição 3: 21 Gramas */}
      <Composition
        id="Cortes-21-Gramas"
        component={VideoCurto}
        schema={VideoCurtoSchema}
        defaultProps={{
          videoName: "21-gramas.mp4", // O arquivo que você colocou na public!
          textColor: "#ff4444",
          texto: "21 GRAMAS",
          cortes: [
            { inicio: 5.0, fim: 10.0 }, // Ajuste esses cortes testes para o seu trailer!
            { inicio: 20.0, fim: 25.0 }, 
          ]
        }}
        durationInFrames={900} 
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
