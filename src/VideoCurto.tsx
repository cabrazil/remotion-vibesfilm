import React from "react";
import { AbsoluteFill, Video, OffthreadVideo, staticFile } from "remotion";
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
      deslocamentoX: z.number().optional(), // Deslocamento horizontal específico para este corte
      deslocamentoY: z.number().optional(), // Deslocamento vertical específico para este corte
      zoom: z.number().optional(), // Zoom específico para este corte
    })
  ).optional(),
  usarTransicoesSuaves: z.boolean().optional(), // Configurável no Root!
  usarVideoNativo: z.boolean().optional(), // Se true, usa <Video> em vez de <OffthreadVideo>
  zoom: z.number().optional(), // Permite dar zoom no vídeo (ex: 1.3)
  cortarFundoPercentual: z.number().optional(), // Permite cortar a parte de baixo (ex: 15 para cortar 15% inferior)
  cortarTopoPercentual: z.number().optional(), // Permite cortar a parte de cima (ex: 10 para cortar 10% superior)
  deslocamentoY: z.number().optional(), // Permite deslocar o vídeo verticalmente em pixels (ex: -50 para subir, 50 para descer)
  preencherTela: z.boolean().optional(), // Se true, o vídeo estica para ocupar a tela toda (9:16) cortando as laterais
  layout: z.enum(["preencher", "desfocado", "centralizado"]).optional(), // Estilo do enquadramento do vídeo
  opacidadeFundo: z.number().optional(), // Opacidade do fundo desfocado (ex: 0.2 para bem escuro, 0.5 para padrão)
});

export type VideoCurtoProps = z.infer<typeof VideoCurtoSchema>;

export const VideoCurto: React.FC<VideoCurtoProps> = ({
  videoName = "filme.mp4",
  textColor = "white",
  texto = "VÍDEO (2010)",
  cortes = [],
  usarTransicoesSuaves = false,
  usarVideoNativo = false, // Por padrão usa o OffthreadVideo para precisão máxima sem tremer
  zoom = 1,
  cortarFundoPercentual = 0,
  cortarTopoPercentual = 0,
  deslocamentoY = 0,
  preencherTela = false,
  layout = undefined,
  opacidadeFundo = 0.35, // Padrão ligeiramente escuro para fazer o centro se destacar
}) => {
  const fps = 30;
  const layoutAtual = layout || (preencherTela ? "preencher" : "centralizado");

  // Se a array de cortes não for enviada pelas props, rodamos um fallback:
  const cortesAtuais = cortes.length > 0 ? cortes : [
    { inicio: 0, fim: 5 }
  ];

  // Calcula e imprime a soma total de tempo de todos os cortes
  const tempoTotalSegundos = cortesAtuais.reduce((acc, corte) => acc + (corte.fim - corte.inicio), 0);

  // Se usar transições suaves, cada fade de ~0.5s "come" tempo entre os cortes
  const nTransicoes = usarTransicoesSuaves ? Math.max(0, cortesAtuais.length - 1) : 0;
  const fadeDurSegundos = 15 / fps; // 15 frames ÷ 30fps = 0.5s por fade (aproximado)
  const tempoRealSegundos = tempoTotalSegundos - (nTransicoes * fadeDurSegundos);

  console.log(`🎬 Soma bruta dos cortes: ${tempoTotalSegundos.toFixed(1)}s`);
  console.log(`✂️  Descontos de ${nTransicoes} transições (≈${(nTransicoes * fadeDurSegundos).toFixed(1)}s)`);
  console.log(`✅ TEMPO REAL DO VÍDEO: ${tempoRealSegundos.toFixed(1)}s`);

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <TransitionSeries>
        {cortesAtuais.map((corte, index) => {
          const durationEmSegundos = corte.fim - corte.inicio;
          const durationInFrames = Math.max(1, Math.round(durationEmSegundos * fps)); // Pelo menos 1 frame
          const startFromFrame = Math.round(corte.inicio * fps);
          const endAtFrame = Math.round(corte.fim * fps);

          // Pega os parâmetros do corte individual ou usa os valores padrões/globais
          const cutZoom = corte.zoom ?? zoom;
          const cutDeslocamentoY = corte.deslocamentoY ?? deslocamentoY;
          const cutDeslocamentoX = corte.deslocamentoX ?? 0;

          let safeTransitionDuration = 15;
          if (usarTransicoesSuaves && index > 0) {
             const prevDuration = Math.round((cortesAtuais[index - 1].fim - cortesAtuais[index - 1].inicio) * fps);
             // Limita a metade do corte mais curto para evitar erro do player em cenas curtíssimas
             safeTransitionDuration = Math.min(15, Math.floor(durationInFrames / 2), Math.floor(prevDuration / 2));
          }

          return (
            <React.Fragment key={index}>
              {usarTransicoesSuaves && index > 0 && (
                <TransitionSeries.Transition
                  presentation={fade()}
                  timing={linearTiming({ durationInFrames: Math.max(1, safeTransitionDuration) })}
                />
              )}

              <TransitionSeries.Sequence durationInFrames={durationInFrames}>

                {/* 1. Camada de Fundo (Apenas para layout desfocado) */}
                {layoutAtual === "desfocado" && (
                  <AbsoluteFill style={{ overflow: "hidden", opacity: opacidadeFundo }}>
                    {usarVideoNativo ? (
                      <Video
                        src={staticFile(videoName)}
                        startFrom={startFromFrame}
                        endAt={endAtFrame}
                        muted
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          filter: "blur(20px) brightness(0.5)",
                          transform: "scale(1.5)", // Aumentado para 1.5 para empurrar as faixas pretas originais para fora da tela
                        }}
                      />
                    ) : (
                      <OffthreadVideo
                        src={staticFile(videoName)}
                        startFrom={startFromFrame}
                        endAt={endAtFrame}
                        muted
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          filter: "blur(20px) brightness(0.5)",
                          transform: "scale(1.5)", // Aumentado para 1.5 para empurrar as faixas pretas originais para fora da tela
                        }}
                      />
                    )}
                  </AbsoluteFill>
                )}

                {/* 2. Camada Principal (Vídeo em primeiro plano) */}
                <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
                  {usarVideoNativo ? (
                    <Video
                      src={staticFile(videoName)}
                      startFrom={startFromFrame}
                      endAt={endAtFrame}
                      style={{
                        width: "100%",
                        height: layoutAtual === "desfocado" ? "auto" : "100%",
                        objectFit: layoutAtual === "preencher" ? "cover" : "contain",
                        transform: `scale(${cutZoom}) translate(${cutDeslocamentoX}px, ${cutDeslocamentoY}px)`,
                        clipPath: (cortarTopoPercentual > 0 || cortarFundoPercentual > 0)
                          ? `inset(${cortarTopoPercentual}% 0% ${cortarFundoPercentual}% 0%)`
                          : undefined,
                      }}
                    />
                  ) : (
                    <OffthreadVideo
                      src={staticFile(videoName)}
                      startFrom={startFromFrame}
                      endAt={endAtFrame}
                      style={{
                        width: "100%",
                        height: layoutAtual === "desfocado" ? "auto" : "100%",
                        objectFit: layoutAtual === "preencher" ? "cover" : "contain",
                        transform: `scale(${cutZoom}) translate(${cutDeslocamentoX}px, ${cutDeslocamentoY}px)`,
                        clipPath: (cortarTopoPercentual > 0 || cortarFundoPercentual > 0)
                          ? `inset(${cortarTopoPercentual}% 0% ${cortarFundoPercentual}% 0%)`
                          : undefined,
                      }}
                    />
                  )}
                </AbsoluteFill>

              </TransitionSeries.Sequence>
            </React.Fragment>
          );
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
