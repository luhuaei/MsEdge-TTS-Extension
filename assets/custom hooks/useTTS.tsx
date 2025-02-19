import { useState } from "react";

export function useChatTTS(
  chattts_url = "http://192.168.1.194:8000/generate_voice",
) {
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [audioLoading, setAudioLoading] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<boolean | null>(null);

  const getAudioUrl = async (
    chattts_url: string,
    text: string,
    voice: string,
    settings: Record<string, any>,
  ) => {
    const body = {
      text: [text],
      stream: false,
      lang: null,
      skip_refine_text: false,
      refine_text_only: false,
      use_decoder: true,
      audio_seed: 12345678,
      text_seed: 87654321,
      do_text_normalization: false,
      do_homophone_replacement: false,
      params_refine_text: {
        prompt: "[oral_2][laugh_0][break_6]",
        top_P: 0.7,
        top_K: 20,
        temperature: 0.7,
        repetition_penalty: 1,
        max_new_token: 384,
        min_new_token: 0,
        show_tqdm: true,
        ensure_non_empty: true,
        stream_batch: 24,
      },
      params_infer_code: {
        prompt: `[speed_5]`,
        top_P: 0.1,
        top_K: 20,
        temperature: 0.3,
        repetition_penalty: 1.05,
        max_new_token: 2048,
        min_new_token: 0,
        show_tqdm: true,
        ensure_non_empty: true,
        stream_batch: true,
        spk_emb: "1",
      },
    };

    try {
      const response = await fetch(chattts_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error("Error generating audio:", error);
      throw error;
    }
  };

  const generateAudio = async (
    text: string,
    voice: string,
    settings: Record<string, any>,
  ) => {
    setAudioLoading(true);
    setAudioError(null);

    try {
      const url = await getAudioUrl(chattts_url, text, voice, settings);
      setAudioUrl(url);
    } catch (e) {
      setAudioError(true);
    } finally {
      setAudioLoading(false);
    }
  };

  return { audioUrl, audioLoading, audioError, generateAudio };
}


export function useFishSpeechTTS(
  chattts_url = "http://192.168.1.194:8100/v1/tts",
) {
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [audioLoading, setAudioLoading] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<boolean | null>(null);

  const getAudioUrl = async (
    chattts_url: string,
    text: string,
    voice: string,
    settings: Record<string, any>,
  ) => {
    const data = {
      text: text,
      references: [],
      reference_id: voice,
      normalize: true,
      format: "wav",
      max_new_tokens: settings.max_new_tokens || 1024,
      chunk_length: settings.chunk_length || 200,
      top_p: settings.top_p || 0.7,
      repetition_penalty: settings.repetition_penalty || 1.2,
      temperature: settings.temperature || 0.7,
      streaming: false,
      use_memory_cache: "off",
      seed: settings.seed || null,
    };

    try {
      const response = await fetch(chattts_url, {
        method: "POST",
        headers: {
          "authorization": `Bearer fake`,
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error("Error generating audio:", error);
      throw error;
    }
  };

  const generateAudio = async (
    text: string,
    voice: string,
    settings: Record<string, any>,
  ) => {
    setAudioLoading(true);
    setAudioError(null);

    try {
      const url = await getAudioUrl(chattts_url, text, voice, settings);
      setAudioUrl(url);
    } catch (e) {
      setAudioError(true);
    } finally {
      setAudioLoading(false);
    }
  };

  return { audioUrl, audioLoading, audioError, generateAudio };
}
