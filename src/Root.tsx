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
          deslocamentoY: -90, // <-- Empurra o vídeo principal 150px para cima,
          cortarTopoPercentual: 13, // <-- Corta a faixa preta integrada de cima do trailer
          cortarFundoPercentual: 13, // <-- Corta a faixa preta integrada de baixo do trailer
          layout: "desfocado",
          opacidadeFundo: 0.70, // <-- Aumentamos para 0.50 para clarear o fundo (mais cores visíveis)
          cortes: [
            // Sequência de cortes dentro do limite de 33 segundos do teaser

            { inicio: 505.5, fim: 509.5, deslocamentoX: 110 },
            { inicio: 204.0, fim: 207.0 },  // 3.0s
            { inicio: 264.0, fim: 267.5 },  // 3.0s
            { inicio: 290.0, fim: 293.0 },  // 2.8s
            // { inicio: 316.0, fim: 319.0 },  // 3.0s
            { inicio: 541.0, fim: 543.0 },  // 3.1s
            { inicio: 334.5, fim: 336.0, deslocamentoX: 90 },  // 3.1s
            { inicio: 359.0, fim: 362.0 },  // 3.1s
            { inicio: 438.0, fim: 440.5, deslocamentoX: 180 },  // 3.1s
            // { inicio: 541.0, fim: 543.0 },  // 3.1s
            { inicio: 673.5, fim: 676.0 },  // 3.1s


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

      {/* Composição para aplicar o Blur em um vídeo já editado e pronto */}
      <Composition
        id="finding-forrester-blur"
        component={VideoCurto}
        schema={VideoCurtoSchema}
        defaultProps={{
          videoName: "finding-forrester-final.mp4", // O nome do seu vídeo final na pasta public
          textColor: "#facc15",
          texto: "NOME DO FILME",

          layout: "desfocado",  // <-- Aplica o fundo desfocado
          opacidadeFundo: 0.50, // <-- Controla a claridade do fundo
          zoom: 1,              // <-- Se o vídeo já estiver editado no zoom certo, mantemos 1
          deslocamentoY: 0,

          // Como o vídeo já está editado e com todos os cortes unidos, 
          // criamos apenas um único "corte" do início (0s) até o fim dele.
          // Como o vídeo final do padrão anterior já é vertical (1080x1920) com faixas pretas sólidas
          // gravadas no próprio arquivo, precisamos cortar 34% do topo e 34% do fundo para revelarmos o blur atrás dele.
          cortarTopoPercentual: 34,
          cortarFundoPercentual: 34,

          usarTransicoesSuaves: false, // Não precisa, pois o vídeo já está editado
        }}
        durationInFrames={600} // Altere para bater com o tempo do vídeo (ex: 25s * 30fps = 750 frames)
        fps={30}
        width={1080}
        height={1920}
      />

    </>
  );
};
