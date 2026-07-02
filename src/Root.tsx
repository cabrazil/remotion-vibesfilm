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
        durationInFrames={1026}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Composição 2: Cortes de Arquivo MP4 nativo (Remember Me) */}
      <Composition
        id="The-Lovely-Bones-Cortes"
        component={VideoCurto}
        schema={VideoCurtoSchema}
        defaultProps={{
          videoName: "The-Lovely-Bones-Trailer.mp4",
          textColor: "#facc15",
          texto: "CORTES ÉPICOS",
          zoom: 1.60, // <-- Mantém o enquadramento original (o fundo desfocado cuida do resto)
          deslocamentoY: -120, // <-- Empurra o vídeo principal 150px para cima,
          cortarTopoPercentual: 13, // <-- Corta a faixa preta integrada de cima do trailer
          cortarFundoPercentual: 13, // <-- Corta a faixa preta integrada de baixo do trailer
          layout: "desfocado",
          opacidadeFundo: 0.70, // <-- Aumentamos para 0.50 para clarear o fundo (mais cores visíveis)
          cortes: [
            // Sequência de cortes dentro do limite de 33 segundos do teaser

            { inicio: 506.0, fim: 509.0, deslocamentoX: 110 },
            { inicio: 204.0, fim: 207.0 },  // 3.0s
            { inicio: 264.0, fim: 267.0 },  // 3.0s
            { inicio: 290.0, fim: 293.0 },  // 2.8s
            // { inicio: 316.0, fim: 319.0 },  // 3.0s
            { inicio: 541.0, fim: 543.0 },  // 3.1s
            { inicio: 334.5, fim: 337.5 },  // 3.1s
            { inicio: 361.0, fim: 364.0 },  // 3.1s
            { inicio: 437.0, fim: 440.0, deslocamentoX: 180 },  // 3.1s
            // { inicio: 541.0, fim: 543.0 },  // 3.1s
            { inicio: 674.0, fim: 676.0 },  // 3.1s


          ],
          //cortarTopoPercentual: 15,
          usarTransicoesSuaves: true,
          //usarVideoNativo: true
        }}
        durationInFrames={600}
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
            { inicio: 60.2, fim: 63.5 },
            { inicio: 4.5, fim: 7.5 }, // Ajuste esses cortes testes para o seu trailer!
            { inicio: 12.0, fim: 15.0 },
            { inicio: 16.0, fim: 19.0 },
            { inicio: 23.0, fim: 26.0 },
            { inicio: 31.5, fim: 34.7 },
            { inicio: 50.0, fim: 53.5 },
            { inicio: 65.0, fim: 69.0 },
            { inicio: 72.0, fim: 76.5 },
            { inicio: 80.0, fim: 82.5 }
          ],
          usarTransicoesSuaves: true // <-- Ativa as transições cinematográficas (fade suave para Drama)
        }}
        durationInFrames={960}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
