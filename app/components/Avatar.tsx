import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { button, useControls } from "leva";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useChat } from "../hooks/useChat";
import { useSpeechSynthesis } from 'react-speech-kit';

// Define interfaces for complex objects
interface VoiceConfig {
  PREFERRED_VOICES: string[];
  DEFAULT_LANG: string;
}

interface VoiceSettings {
  PITCH_MALE: number;
  RATE_MALE: number;
  PREFERRED_LANGS: string[];
}

interface FacialExpression {
  [key: string]: number;
}

interface FacialExpressions {
  [key: string]: FacialExpression;
}

interface Corresponding {
  [key: string]: string;
}

interface Message {
  text: string;
  animation?: string;
  expression?: string;
}

interface ChatContext {
  message: Message | null;
  onMessagePlayed: () => void;
  chat: () => void;
}

interface AvatarProps {
  [key: string]: any; // Allow any additional props for flexibility
}

// Update the voice configuration constants
const VOICE_CONFIG: VoiceConfig = {
  PREFERRED_VOICES: [
    'Microsoft Zira',
    'Google US English Female',
    'Samantha',
    'Karen'
  ],
  DEFAULT_LANG: 'en-US'
};

const VOICE_SETTINGS: VoiceSettings = {
  PITCH_MALE: 0.3,
  RATE_MALE: 1,
  PREFERRED_LANGS: ['en-US', 'en-GB', 'en-AU'],
};

const facialExpressions: FacialExpressions = {
  default: {},
  smile: {
    browInnerUp: 0.17,
    eyeSquintLeft: 0.9,
    eyeSquintRight: 0.6,
    noseSneerLeft: 0.1700000727403593,
    noseSneerRight: 0.14000002836874015,
    mouthPressLeft: 0.9,
    mouthPressRight: 0.41000000000000003,
    mouthSmileLeft: 0.5,
    mouthSmileRight: 0.5
  },
  funnyFace: {
    jawLeft: 0.63,
    mouthPucker: 0.53,
    noseSneerLeft: 1,
    noseSneerRight: 0.39,
    mouthLeft: 1,
    eyeLookUpLeft: 1,
    eyeLookUpRight: 1,
    cheekPuff: 0.9999924982764238,
    mouthDimpleLeft: 0.414743888682652,
    mouthRollLower: 0.32,
    mouthSmileLeft: 0.35499733688813034,
    mouthSmileRight: 0.35499733688813034,
  },
  sad: {
    mouthFrownLeft: 1,
    mouthFrownRight: 1,
    mouthShrugLower: 0.78341,
    browInnerUp: 0.452,
    eyeSquintLeft: 0.72,
    eyeSquintRight: 0.75,
    eyeLookDownLeft: 0.5,
    eyeLookDownRight: 0.5,
    jawForward: 1,
  },
  surprised: {
    eyeWideLeft: 0.5,
    eyeWideRight: 0.5,
    jawOpen: 0.351,
    mouthFunnel: 1,
    browInnerUp: 1,
  },
  angry: {
    browDownLeft: 1,
    browDownRight: 1,
    eyeSquintLeft: 1,
    eyeSquintRight: 1,
    jawForward: 1,
    jawLeft: 1,
    mouthShrugLower: 1,
    noseSneerLeft: 1,
    noseSneerRight: 0.42,
    eyeLookDownLeft: 0.16,
    eyeLookDownRight: 0.16,
    cheekSquintLeft: 1,
    cheekSquintRight: 1,
    mouthClose: 0.23,
    mouthFunnel: 0.63,
    mouthDimpleRight: 1,
  },
  crazy: {
    browInnerUp: 0.9,
    jawForward: 1,
    noseSneerLeft: 0.5700000000000001,
    noseSneerRight: 0.51,
    eyeLookDownLeft: 0.39435766259644545,
    eyeLookUpRight: 0.4039761421719682,
    eyeLookInLeft: 0.9618479575523053,
    eyeLookInRight: 0.9618479575523053,
    jawOpen: 0.9618479575523053,
    mouthDimpleLeft: 0.9618479575523053,
    mouthDimpleRight: 0.9618479575523053,
    mouthStretchLeft: 0.27893590769016857,
    mouthStretchRight: 0.2885543872656917,
    mouthSmileLeft: 0.5578718153803371,
    mouthSmileRight: 0.38473918302092225,
    tongueOut: 0.9618479575523053,
  },
};

const corresponding: Corresponding = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_AA",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP",
};

export function Avatar(props: AvatarProps) {
  const readyPlayerMeModel = useGLTF("https://models.readyplayer.me/684daeae1973186246ce2698.glb?morphTargets=ARKit,Oculus+Visemes,mouthOpen,mouthSmile,eyesClosed,eyesLookUp,eyesLookDown&textureSizeLimit=1024&textureFormat=png");
  const { nodes, materials, scene } = readyPlayerMeModel;
  const { message, onMessagePlayed, chat } = useChat() as ChatContext;
  
  // State management
  const [speaking, setSpeaking] = useState<boolean>(false);
  const [currentExpression, setCurrentExpression] = useState<string>("default");
  const speechSynthRef = useRef<SpeechSynthesis | null>(null);
  const lastVisemeUpdateTime = useRef<number>(0);
  const lastViseme = useRef<string | null>(null);
  const expressionTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const { animations } = useGLTF("/models/animations.glb");
  const group = useRef<THREE.Group>(null);
  const { actions, mixer } = useAnimations(animations, group);
  const [animation, setAnimation] = useState<string>(
    animations.find((a: THREE.AnimationClip) => a.name === "Idle") ? "Idle" : animations[0].name
  );
  const [blink, setBlink] = useState<boolean>(false);
  const [winkLeft, setWinkLeft] = useState<boolean>(false);
  const [winkRight, setWinkRight] = useState<boolean>(false);

  const speechQueue = useRef<string[]>([]);
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize speech synthesis
  const { cancel } = useSpeechSynthesis({
    onEnd: () => {
      setSpeaking(false);
      onMessagePlayed();
    }
  });

  const getVoice = (): SpeechSynthesisVoice | undefined => {
    const voices = window.speechSynthesis.getVoices();
    console.log('Available voices:', voices.map(voice => voice.name));
    
    const femaleVoice = voices.find(voice => 
      VOICE_CONFIG.PREFERRED_VOICES.includes(voice.name) || 
      voice.name.toLowerCase().includes('female') ||
      voice.name.includes('Zira')
    );
    
    console.log('Selected voice:', femaleVoice?.name);
    return femaleVoice || voices[0];
  };

  const initializeSpeech = (text: string): SpeechSynthesisUtterance => {
    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = getVoice();
    
    utterance.voice = selectedVoice || null;
    utterance.lang = VOICE_CONFIG.DEFAULT_LANG;
    utterance.rate = 0.9;
    utterance.pitch = 0.7;
    utterance.volume = 1.0;

    window.speechSynthesis.cancel();

    return utterance;
  };

  const setupSpeech = (utterance: SpeechSynthesisUtterance): void => {
    const selectedVoice = getVoice();
    utterance.voice = selectedVoice || null;
    utterance.rate = 1.0;
    utterance.pitch = 1.5;
    utterance.volume = 1.0;
    utterance.lang = 'en-US';
    
    console.log('Speech configuration:', {
      voice: selectedVoice?.name,
      lang: utterance.lang,
      pitch: utterance.pitch
    });
  };

  const speakText = (text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      setupSpeech(utterance);

      utterance.onstart = () => {
        setSpeaking(true);
        currentUtterance.current = utterance;
      };

      utterance.onend = () => {
        setSpeaking(false);
        currentUtterance.current = null;
        resolve();
      };

      utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
        console.error('Speech synthesis error:', event);
        if (event.error !== 'interrupted') {
          setSpeaking(false);
          currentUtterance.current = null;
          reject(event);
        }
      };

      window.speechSynthesis.speak(utterance);
    });
  };

  useEffect(() => {
    if (!message) {
      setAnimation("Idle");
      setCurrentExpression("default");
      setSpeaking(false);
      return;
    }

    const handleMessage = async () => {
      try {
        setAnimation(message.animation || "Idle");
        
        if (message.expression) {
          setCurrentExpression(message.expression);
          if (expressionTimeout.current) {
            clearTimeout(expressionTimeout.current);
          }
          expressionTimeout.current = setTimeout(() => {
            setCurrentExpression("default");
          }, 2000);
        }

        const cleanText = message.text.replace(/[^\w\s.,!?-]/g, '');
        
        if (cleanText) {
          await speakText(cleanText);
          onMessagePlayed();
        } else {
          onMessagePlayed();
        }
      } catch (error) {
        console.error('Error processing message:', error);
        onMessagePlayed();
      }
    };

    handleMessage();

    return () => {
      if (currentUtterance.current) {
        window.speechSynthesis.cancel();
        currentUtterance.current = null;
      }
    };
  }, [message, onMessagePlayed]);

  useEffect(() => {
    return () => {
      if (currentUtterance.current) {
        window.speechSynthesis.cancel();
        currentUtterance.current = null;
      }
      if (expressionTimeout.current) {
        clearTimeout(expressionTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    window.speechSynthesis.getVoices();
  }, []);

  const lerpMorphTarget = (target: string, value: number, speed: number = 0.1): void => {
    scene.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.SkinnedMesh && child.morphTargetDictionary) {
        const index = child.morphTargetDictionary[target];
        if (index === undefined || child.morphTargetInfluences[index] === undefined) {
          return;
        }
        child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
          child.morphTargetInfluences[index],
          value,
          speed
        );
      }
    });
  };

  const applyFacialExpression = (): void => {
    const expressionData = facialExpressions[currentExpression] || facialExpressions.default;
    Object.entries(expressionData).forEach(([target, value]: [string, number]) => {
      lerpMorphTarget(target, value, 0.3);
    });
  };

  useEffect(() => {
    speechSynthRef.current = window.speechSynthesis;
    return () => {
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    actions[animation]
      ?.reset()
      .fadeIn(mixer.stats.actions.inUse === 0 ? 0 : 0.5)
      .play();
    return () => actions[animation]?.fadeOut(0.5);
  }, [animation, actions, mixer]);

  useFrame(() => {
    applyFacialExpression();

    if (speaking) {
      const currentTime = performance.now();
      if (currentTime - lastVisemeUpdateTime.current > 80) {
        const visemeKeys = Object.keys(corresponding);
        let randomViseme: string;
        
        do {
          randomViseme = corresponding[visemeKeys[Math.floor(Math.random() * visemeKeys.length)]];
        } while (randomViseme === lastViseme.current);
        
        lastViseme.current = randomViseme;

        Object.values(corresponding).forEach((viseme: string) => {
          lerpMorphTarget(viseme, 0, 0.3);
        });
        
        let intensity = 0.35 + Math.random() * 0.2;
        if (currentExpression === 'angry' || currentExpression === 'surprised') {
          intensity *= 1.2;
        } else if (currentExpression === 'sad') {
          intensity *= 0.8;
        }
        
        lerpMorphTarget(randomViseme, intensity, 0.3);
        lastVisemeUpdateTime.current = currentTime;
      }
    } else {
      Object.values(corresponding).forEach((viseme: string) => {
        lerpMorphTarget(viseme, 0, 0.1);
      });
    }

    lerpMorphTarget("eyeBlinkLeft", blink || winkLeft ? 1 : 0, 0.5);
    lerpMorphTarget("eyeBlinkRight", blink || winkRight ? 1 : 0, 0.5);
  });

  useControls("FacialExpressions", {
    chat: button(() => chat()),
    expression: {
      value: currentExpression,
      options: Object.keys(facialExpressions),
      onChange: (value: string) => setCurrentExpression(value),
    },
    winkLeft: button(() => {
      setWinkLeft(true);
      setTimeout(() => setWinkLeft(false), 300);
    }),
    winkRight: button(() => {
      setWinkRight(true);
      setTimeout(() => setWinkRight(false), 300);
    }),
    animation: {
      value: animation,
      options: animations.map((a: THREE.AnimationClip) => a.name),
      onChange: (value: string) => setAnimation(value),
    },
  });

  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;
    const nextBlink = () => {
      blinkTimeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          nextBlink();
        }, 200);
      }, THREE.MathUtils.randInt(1000, 5000));
    };
    nextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  return (
    <group {...props} dispose={null} ref={group}>
      <primitive object={nodes.Hips} />
      {Object.entries(nodes).map(([name, node]: [string, THREE.Object3D]) => {
        if (node instanceof THREE.SkinnedMesh) {
          return (
            <skinnedMesh
              key={name}
              name={name}
              geometry={node.geometry}
              material={materials[node.material.name]}
              skeleton={node.skeleton}
              morphTargetDictionary={node.morphTargetDictionary}
              morphTargetInfluences={node.morphTargetInfluences}
            />
          );
        }
        return null;
      })}
    </group>
  );
}

useGLTF.preload("/models/animations.glb");
useGLTF.preload("https://models.readyplayer.me/684daeae1973186246ce2698.glb?morphTargets=ARKit,Oculus+Visemes,mouthOpen,mouthSmile,eyesClosed,eyesLookUp,eyesLookDown&textureSizeLimit=1024&textureFormat=png");