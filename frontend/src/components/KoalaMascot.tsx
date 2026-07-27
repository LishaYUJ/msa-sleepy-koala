import React from 'react';

interface KoalaMascotProps {
  mood: string;
}

export const KoalaMascot: React.FC<KoalaMascotProps> = ({ mood = 'default' }) => {
  const currentMood = mood?.toLowerCase() || 'default';

  // Determine classes and styling values for SVG animation
  let faceColor = '#A0AEC0'; // default soft grey
  let earInnerColor = '#FED7E2'; // soft pink
  let eyeLeft: React.ReactNode = null;
  let eyeRight: React.ReactNode = null;
  let mouth: React.ReactNode = null;
  let accessory: React.ReactNode = null;
  let animationClass = 'koala-calm';
  let speechBubbleText = "Hello!";

  switch (currentMood) {
    case 'sleeping':
      // Calm sleeping eyes
      eyeLeft = (
        <path
          d="M 155 178 Q 165 186 175 178"
          fill="none"
          stroke="#2D3748"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
      );
      eyeRight = (
        <path
          d="M 225 178 Q 235 186 245 178"
          fill="none"
          stroke="#2D3748"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
      );
      // Soft smile
      mouth = (
        <path
          d="M 192 220 Q 200 226 208 220"
          fill="none"
          stroke="#2D3748"
          strokeWidth="3"
          strokeLinecap="round"
        />
      );
      // Rising sleeping bubbles
      accessory = (
        <g>
          <circle cx="260" cy="120" r="5" fill="none" stroke="#60A5FA" strokeWidth="1.5" className="sleeping-bubble bubble-1" />
          <circle cx="275" cy="100" r="8" fill="none" stroke="#60A5FA" strokeWidth="1.5" className="sleeping-bubble bubble-2" />
        </g>
      );
      animationClass = 'koala-breathe';
      speechBubbleText = "Zzz... Sleeping soundly.";
      break;

    case 'late_sleeping':
      // Calm sleeping eyes
      eyeLeft = (
        <path
          d="M 155 178 Q 165 186 175 178"
          fill="none"
          stroke="#2D3748"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
      );
      eyeRight = (
        <path
          d="M 225 178 Q 235 186 245 178"
          fill="none"
          stroke="#2D3748"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
      );
      // Worried soft smile
      mouth = (
        <path
          d="M 192 223 C 196 220 200 225 208 223"
          fill="none"
          stroke="#2D3748"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      );
      // Sweat drop and bubbles
      accessory = (
        <g>
          <path
            d="M 140 150 C 135 155 130 162 135 168 C 140 172 145 170 148 160 Z"
            fill="#60A5FA"
            className="koala-sweat"
          />
          <circle cx="260" cy="120" r="3" fill="none" stroke="#93C5FD" strokeWidth="1.2" className="sleeping-bubble bubble-1" />
          <circle cx="275" cy="100" r="5" fill="none" stroke="#93C5FD" strokeWidth="1.2" className="sleeping-bubble bubble-2" />
        </g>
      );
      animationClass = 'koala-breathe';
      speechBubbleText = "Zzz... Slept past bedtime today.";
      break;

    case 'very_weak':
      faceColor = '#94A3B8'; // dull grey
      earInnerColor = '#E2E8F0'; // faded
      // Dizzy Crossed eyes
      eyeLeft = (
        <g stroke="#1A202C" strokeWidth="3.5" strokeLinecap="round">
          <line x1="158" y1="174" x2="172" y2="188" />
          <line x1="172" y1="174" x2="158" y2="188" />
        </g>
      );
      eyeRight = (
        <g stroke="#1A202C" strokeWidth="3.5" strokeLinecap="round">
          <line x1="228" y1="174" x2="242" y2="188" />
          <line x1="242" y1="174" x2="228" y2="188" />
        </g>
      );
      // Wavy dizzy mouth
      mouth = (
        <path
          d="M 188 225 Q 194 220 200 225 T 212 225"
          fill="none"
          stroke="#1A202C"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      );
      // Sweatdrop
      accessory = (
        <path
          d="M 140 150 C 135 155 130 162 135 168 C 140 172 145 170 148 160 Z"
          fill="#60A5FA"
          className="koala-sweat"
        />
      );
      animationClass = 'koala-dizzy';
      speechBubbleText = "Uh oh, running on empty...";
      break;

    case 'weak':
      // Render dark circles under the eyes
      accessory = (
        <g opacity="0.3">
          <circle cx="165" cy="188" r="16" fill="#4B5563" />
          <circle cx="235" cy="188" r="16" fill="#4B5563" />
        </g>
      );
      // Drooping neutral eyes
      eyeLeft = (
        <path
          d="M 155 182 Q 165 178 175 182"
          fill="none"
          stroke="#2D3748"
          strokeWidth="4"
          strokeLinecap="round"
        />
      );
      eyeRight = (
        <path
          d="M 225 182 Q 235 178 245 182"
          fill="none"
          stroke="#2D3748"
          strokeWidth="4"
          strokeLinecap="round"
        />
      );
      // Worried small mouth
      mouth = (
        <path
          d="M 188 225 Q 200 218 212 225"
          fill="none"
          stroke="#1A202C"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      );
      animationClass = 'koala-tired';
      speechBubbleText = "Phew, I'm getting drowsy...";
      break;

    case 'missed':
      // Distressed / awake past bedtime
      eyeLeft = (
        <path
          d="M 155 174 Q 165 186 175 178"
          fill="none"
          stroke="#1A202C"
          strokeWidth="4"
          strokeLinecap="round"
        />
      );
      eyeRight = (
        <path
          d="M 225 174 Q 235 186 245 178"
          fill="none"
          stroke="#1A202C"
          strokeWidth="4"
          strokeLinecap="round"
        />
      );
      // Sad downward mouth
      mouth = (
        <path
          d="M 188 228 Q 200 215 212 228"
          fill="none"
          stroke="#1A202C"
          strokeWidth="4"
          strokeLinecap="round"
        />
      );
      accessory = (
        <path
          d="M 135 155 C 131 160 128 165 132 170 C 136 173 140 171 142 165 Z"
          fill="#60A5FA"
          className="koala-sweat"
        />
      );
      animationClass = 'koala-dizzy';
      speechBubbleText = "Your koala stayed up past bedtime.";
      break;

    case 'winding_down':
      // Sleepy drop eyes
      eyeLeft = (
        <path
          d="M 155 180 Q 165 188 175 180"
          fill="none"
          stroke="#2D3748"
          strokeWidth="4"
          strokeLinecap="round"
        />
      );
      eyeRight = (
        <path
          d="M 225 180 Q 235 188 245 180"
          fill="none"
          stroke="#2D3748"
          strokeWidth="4"
          strokeLinecap="round"
        />
      );
      // Open yawn circle
      mouth = (
        <ellipse cx="200" cy="225" rx="8" ry="12" fill="#E53E3E" stroke="#1A202C" strokeWidth="2" />
      );
      // Floating Zzzs
      accessory = (
        <g>
          <text x="260" y="110" fill="#818CF8" fontSize="18" fontWeight="bold" className="zzz-floating zzz-1">Z</text>
          <text x="278" y="90" fill="#6366F1" fontSize="24" fontWeight="bold" className="zzz-floating zzz-2">Z</text>
        </g>
      );
      animationClass = 'koala-yawn';
      speechBubbleText = "Bedtime is approaching. Let's wind down.";
      break;

    case 'default':
    default:
      // Happy open smile and cute sparkly eyes
      eyeLeft = (
        <g>
          <circle cx="165" cy="180" r="10" fill="#1A202C" />
          <circle cx="162" cy="177" r="3" fill="white" />
        </g>
      );
      eyeRight = (
        <g>
          <circle cx="235" cy="180" r="10" fill="#1A202C" />
          <circle cx="232" cy="177" r="3" fill="white" />
        </g>
      );
      mouth = (
        <path
          d="M 185 220 Q 200 238 215 220"
          fill="none"
          stroke="#1A202C"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      );
      animationClass = 'koala-excited';
      speechBubbleText = "Your koala is enjoying the evening.";
      break;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0' }}>
      <style>{`
        .koala-svg {
          width: 100%;
          max-width: 250px;
          height: auto;
          filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.15));
        }
        .koala-body-g {
          transform-origin: 200px 240px;
        }
        .koala-breathe .koala-body-g {
          animation: koala-breathe 4s ease-in-out infinite;
        }
        .koala-excited .koala-body-g {
          animation: koala-breathe 1.5s ease-in-out infinite;
        }
        .koala-yawn .koala-body-g {
          animation: head-yawn 3s ease-in-out infinite;
        }
        .koala-dizzy .koala-body-g {
          animation: head-yawn 5s ease-in-out infinite;
        }
        .zzz-floating {
          transform-origin: bottom left;
          opacity: 0;
        }
        .zzz-1 { animation: float-zzz 3s infinite 0.5s; }
        .zzz-2 { animation: float-zzz 3s infinite 1.8s; }
        
        .sleeping-bubble {
          transform-origin: center;
          opacity: 0;
        }
        .bubble-1 { animation: bubble-rise 4s infinite 0.2s; }
        .bubble-2 { animation: bubble-rise 4s infinite 2s; }
        
        .koala-sweat {
          transform-origin: 140px 150px;
          animation: sweat-drip 2.5s infinite;
        }

        .mood-badge {
          display: inline-block;
          font-family: var(--font-title);
          font-weight: 600;
          font-size: 0.85rem;
          padding: 6px 12px;
          border-radius: 12px;
          margin-top: 14px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .mood-badge.default { background-color: #818cf8; color: #1e1b4b; }
        .mood-badge.sleeping { background-color: var(--success); color: #064e3b; }
        .mood-badge.late_sleeping { background-color: #a78bfa; color: #2e1065; }
        .mood-badge.winding_down { background-color: #fef08a; color: #713f12; }
        .mood-badge.missed { background-color: #fca5a5; color: #7f1d1d; }
        .mood-badge.weak { background-color: #fca5a5; color: #7f1d1d; }
        .mood-badge.very_weak { background-color: #94a3b8; color: #0f172a; }

        .mascot-speech {
          background-color: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 14px;
          padding: 8px 16px;
          font-size: 0.9rem;
          font-weight: 500;
          text-align: center;
          max-width: 220px;
          margin-bottom: 8px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          position: relative;
          color: var(--text-main);
          font-family: var(--font-body);
        }

        .mascot-speech::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 8px 8px 0;
          border-style: solid;
          border-color: var(--card-bg) transparent;
          display: block;
          width: 0;
        }
      `}</style>

      {/* Mascot Speech Bubble */}
      <h3 className="mascot-speech">{speechBubbleText}</h3>

      {/* SVG Koala Mascot */}
      <svg
        viewBox="0 0 400 350"
        className={`koala-svg ${animationClass}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="koalaGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        <circle cx="200" cy="200" r="140" fill="url(#koalaGlow)" />

        <g className="koala-body-g">
          {accessory}

          {/* Ears */}
          <circle cx="120" cy="130" r="45" fill={faceColor} />
          <circle cx="120" cy="130" r="30" fill={earInnerColor} />
          <circle cx="280" cy="130" r="45" fill={faceColor} />
          <circle cx="280" cy="130" r="30" fill={earInnerColor} />

          {/* Head Cheek Tuffs */}
          <path d="M 90 200 Q 75 220 100 230" fill={faceColor} />
          <path d="M 310 200 Q 325 220 300 230" fill={faceColor} />

          {/* Main Face */}
          <ellipse cx="200" cy="200" rx="95" ry="80" fill={faceColor} />

          {/* Inner Cheeks */}
          <ellipse cx="150" cy="215" rx="20" ry="12" fill="#E2E8F0" opacity="0.6" />
          <ellipse cx="250" cy="215" rx="20" ry="12" fill="#E2E8F0" opacity="0.6" />

          {eyeLeft}
          {eyeRight}

          {/* Nose */}
          <ellipse cx="200" cy="195" rx="16" ry="24" fill="#1A202C" />
          <ellipse cx="196" cy="186" rx="5" ry="8" fill="#E2E8F0" opacity="0.3" />

          {mouth}
        </g>
      </svg>

      <div className={`mood-badge ${currentMood}`}>
        Mood: {mood.replace('_', ' ')}
      </div>
    </div>
  );
};
