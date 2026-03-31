import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";

// 1. Schema para nossos controles laterais
export const VideoCurtoSchema = z.object({
  videoName: z.string(),
  textColor: zColor(),
  texto: z.string(),
  cortes: z.array(
    z.object({
      inicio: z.number(),
      fim: z.number(),
    })
  ).optional(),
});

export type VideoCurtoProps = z.infer<typeof VideoCurtoSchema>;

export const VideoCurto: React.FC<VideoCurtoProps> = ({
  videoName = "filme.mp4",
  textColor = "white",
  texto = "VÍDEO (2010)",
  cortes = [],
}) => {
  const fps = 30;

  // Se a array de cortes não for enviada pelas props, rodamos um fallback:
  const cortesAtuais = cortes.length > 0 ? cortes : [
    { inicio: 0, fim: 5 }
  ];

  // Calcula e imprime a soma total de tempo de todos os cortes
  const tempoTotalSegundos = cortesAtuais.reduce((acc, corte) => acc + (corte.fim - corte.inicio), 0);
  console.log(`🎬 TEMPO TOTAL DOS CORTES: ${tempoTotalSegundos.toFixed(1)} Segundos`);

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <TransitionSeries>
        {cortesAtuais.map((corte, index) => {
          const durationEmSegundos = corte.fim - corte.inicio;
          const durationInFrames = Math.max(1, Math.round(durationEmSegundos * fps)); // Pelo menos 1 frame
          const startFromFrame = Math.round(corte.inicio * fps);
          const endAtFrame = Math.round(corte.fim * fps);

          // Segurança: O Remotion quebra se a transição (Fade) for MAIOR que o tempo do vídeo (ex: cortes curtos de 0.4s).
          // Pegamos o menor valor entre: 15 frames (o ideal), a duração deste corte, e a do corte anterior.
          let safeTransitionDuration = 15;
          if (index > 0) {
            const prevDuration = Math.round((cortesAtuais[index - 1].fim - cortesAtuais[index - 1].inicio) * fps);
            safeTransitionDuration = Math.min(15, durationInFrames, prevDuration);
          }

          return (
            <React.Fragment key={index}>
              {/* Adicionamos uma transição "fade" cruzada sempre que houver um corte anterior */}
              {index > 0 && (
                <TransitionSeries.Transition
                  presentation={fade()}
                  timing={linearTiming({ durationInFrames: Math.max(1, safeTransitionDuration) })}
                />
              )}

              <TransitionSeries.Sequence durationInFrames={durationInFrames}>

                {/* Vídeo Principal (com fundo preto padrão da tela) */}
                <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
                  <OffthreadVideo
                    src={staticFile(videoName)}
                    startFrom={startFromFrame}
                    endAt={endAtFrame}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </AbsoluteFill>

              </TransitionSeries.Sequence>
            </React.Fragment>
          );
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
