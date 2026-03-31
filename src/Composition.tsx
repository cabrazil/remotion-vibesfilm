import React from "react";
import { AbsoluteFill, Img, staticFile, Series } from "remotion";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";

// 1. Criamos um Schema (Molde) Zod, que o Remotion consegue ler para gerar o painel lateral
export const MyCompositionSchema = z.object({
  textColor: zColor(), // zColor cria automaticamente a caixa de "Color Picker"
  fontFamily: z.string(),
  fontSize: z.number().min(10).max(300), // Exemplo: restringe o tamanho entre 10 e 300
});

export type MyCompositionProps = z.infer<typeof MyCompositionSchema>;

// 2. Recebemos os props com cores e tamanhos "Padrões" caso ninguém passe nada
export const MyComposition: React.FC<MyCompositionProps> = ({
  textColor = "white",
  fontFamily = "sans-serif",
  fontSize = 70,
}) => {
  // 30 segundos no total a 30 FPS = 900 frames
  const framesPerImage = 75;

  // Lista com as imagens exatas e textos editáveis:
  const scenes = [
    { imgName: "no-country-001.jpg", text: "Você pode alterar isso" },
    { imgName: "no-country-002.jpg", text: <>Textos <span style={{ color: "yellow" }}>diferentes</span> por cena</> },
    { imgName: "no-country-003.jpg", text: "Teste de formatação Bebas Neue" },
    { imgName: "no-country-004.jpg", text: <>Um thriller silencioso e <span style={{ color: "red" }}>brutal</span></> },
    { imgName: "no-country-005.jpg", text: "O cara da moeda" },
    { imgName: "no-country-006.jpg", text: "O xerife está rastreando" },
    { imgName: "no-country-007.jpg", text: "A perseguição nunca para" },
    { imgName: "no-country-008.jpg", text: <>Dinheiro ou a <span style={{ color: "red" }}>Vida</span>?</> },
    { imgName: "no-country-009.jpg", text: "Uma história sobre destino" },

    { imgName: "no-country-010.jpg", text: "Nenhum lugar para fugir" },
    { imgName: "no-country-011.jpg", text: "Tensão palpável" },
    { imgName: "no-country-012.jpg", text: "Onde os Fracos Não Têm Vez" }
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {/* <Audio src={staticFile("musica.mp3")} volume={0.5} /> */}

      <Series>
        {scenes.map((scene, index) => (
          <Series.Sequence key={scene.imgName} durationInFrames={framesPerImage}>
            {/* 1. Imagem de Fundo Desfocada */}
            <AbsoluteFill>
              <Img
                src={staticFile(scene.imgName)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "blur(30px) brightness(0.5)",
                  transform: "scale(1.1)",
                }}
              />
            </AbsoluteFill>

            {/* 2. Imagem Principal no Centro */}
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
              <Img
                src={staticFile(scene.imgName)}
                style={{
                  width: "100%", 
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </AbsoluteFill>

            {/* 3. Texto Overlay - Fica por cima de tudo na cena atual */}
            <AbsoluteFill style={{ 
              justifyContent: "flex-start", // Movido para a parte de CIMA
              alignItems: "center",         // Continua no centro horizontal
              paddingTop: 350               // Espaço da borda superior (para ficar fora das barras e ícones nos apps de shorts)
            }}>
              {/* 4. Aplicando os props em tempo real ao texto */}
              <div style={{
                fontSize: fontSize,         // Usando a prop
                color: textColor,           // Usando a prop
                fontFamily: fontFamily,     // Usando a prop
                fontWeight: "bold",
                textAlign: "center",
                textShadow: "0px 0px 20px rgba(0, 0, 0, 0.9), 4px 4px 10px rgba(0,0,0,0.5)"
              }}>
                {/* Aqui puxamos o texto que definimos para aquela cena específica: */}
                {scene.text}
              </div>
            </AbsoluteFill>

          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
