import React from 'react';
import { CharacterCustomization } from '../types';

interface Props {
  character: CharacterCustomization;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showKoiCompanion?: boolean;
  className?: string;
  interactive?: boolean;
}

export const CharacterAvatar: React.FC<Props> = ({
  character,
  size = 'md',
  showKoiCompanion = true,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-20 h-20',
    lg: 'w-40 h-40',
    xl: 'w-64 h-64 md:w-80 md:h-80',
  }[size];

  // Companion aura colors
  const companionColorMap: Record<string, string> = {
    azure_glow: '#38bdf8',
    rose_gold: '#fb7185',
    midnight_purple: '#c084fc',
    emerald_jade: '#34d399',
    solar_amber: '#fbbf24',
  };
  const companionColor = companionColorMap[character.koiCompanionColor] || '#38bdf8';

  // Outfit collar styling
  const outfitStyles: Record<string, { mantle: string; trim: string; collar: string }> = {
    standard_courier: { mantle: '#1e3a8a', trim: '#dc2626', collar: '#3b82f6' }, // Indigo & Vermilion
    dawn_dock: { mantle: '#78716c', trim: '#ca8a04', collar: '#a8a29e' }, // Sand-Grey Oilskin
    storm_run: { mantle: '#0f172a', trim: '#eab308', collar: '#334155' }, // Heavy Rig & Brass
    undertow_civilian: { mantle: '#581c87', trim: '#fbbf24', collar: '#7e22ce' }, // Velvet Plum & Gold
  };
  const outfit = outfitStyles[character.initialOutfit] || outfitStyles.standard_courier;

  // Hairstyle path generator
  const renderHair = () => {
    const hairColor = character.hairColor || '#1e293b';
    switch (character.hairstyle) {
      case 'windblown_crest':
        return (
          <g id="hair-windblown">
            {/* Base hair */}
            <path
              d="M 65,85 C 60,40 85,25 110,25 C 135,25 160,40 155,85 C 150,60 135,45 110,48 C 85,45 70,60 65,85 Z"
              fill={hairColor}
            />
            {/* Swept Crest Waves */}
            <path
              d="M 90,30 C 105,10 135,12 155,28 C 145,20 125,20 110,32 Z"
              fill={hairColor}
              opacity="0.9"
            />
            <path
              d="M 70,45 C 80,25 110,18 135,22 C 115,22 95,30 80,48 Z"
              fill={hairColor}
            />
            {/* Highlight streak */}
            <path
              d="M 95,28 C 110,18 130,20 142,30"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.25"
              fill="none"
            />
          </g>
        );

      case 'braided_topknot':
        return (
          <g id="hair-topknot">
            {/* Top Bun */}
            <circle cx="110" cy="22" r="18" fill={hairColor} />
            {/* Vermilion Ribbon wrap */}
            <rect x="98" y="32" width="24" height="6" rx="3" fill="#dc2626" />
            <path d="M 120,35 Q 135,45 140,60" stroke="#dc2626" strokeWidth="3" fill="none" />
            {/* Sleek Base */}
            <path
              d="M 68,85 C 65,45 80,35 110,35 C 140,35 155,45 152,85 C 148,65 135,50 110,50 C 85,50 72,65 68,85 Z"
              fill={hairColor}
            />
          </g>
        );

      case 'flowing_strands':
        return (
          <g id="hair-flowing">
            {/* Long back locks */}
            <path
              d="M 60,90 C 50,130 55,170 45,190 C 65,180 75,140 75,100 Z"
              fill={hairColor}
              opacity="0.85"
            />
            <path
              d="M 160,90 C 170,130 165,170 175,190 C 155,180 145,140 145,100 Z"
              fill={hairColor}
              opacity="0.85"
            />
            {/* Front crown */}
            <path
              d="M 65,85 C 65,35 90,28 110,28 C 130,28 155,35 155,85 C 145,55 130,42 110,42 C 90,42 75,55 65,85 Z"
              fill={hairColor}
            />
          </g>
        );

      case 'courier_shave':
        return (
          <g id="hair-shaved">
            {/* Shaved side shadows */}
            <path d="M 68,55 C 68,75 75,85 80,90 C 75,75 72,65 72,55 Z" fill={hairColor} opacity="0.4" />
            <path d="M 152,55 C 152,75 145,85 140,90 C 145,75 148,65 148,55 Z" fill={hairColor} opacity="0.4" />
            {/* Center Hawk Crest */}
            <path
              d="M 85,80 C 85,30 95,20 110,18 C 125,20 135,30 135,80 C 128,45 120,32 110,32 C 100,32 92,45 85,80 Z"
              fill={hairColor}
            />
          </g>
        );

      case 'twin_loop_braids':
        return (
          <g id="hair-twin-loops">
            {/* Loops */}
            <path d="M 68,75 C 45,75 40,115 65,120 C 75,122 75,95 72,80 Z" fill={hairColor} />
            <path d="M 152,75 C 175,75 180,115 155,120 C 145,122 145,95 148,80 Z" fill={hairColor} />
            {/* Brass Beads */}
            <circle cx="52" cy="115" r="4" fill="#fbbf24" />
            <circle cx="168" cy="115" r="4" fill="#fbbf24" />
            {/* Crown */}
            <path
              d="M 68,85 C 65,42 85,32 110,32 C 135,32 155,42 152,85 C 145,55 130,45 110,45 C 90,45 75,55 68,85 Z"
              fill={hairColor}
            />
          </g>
        );

      case 'undercut_dreadlocks':
        return (
          <g id="hair-dreadlocks">
            {/* Crown & textured locks falling over */}
            <path
              d="M 65,80 C 65,38 85,26 110,26 C 135,26 155,38 155,80 Z"
              fill={hairColor}
            />
            {/* Platted dread strands */}
            <path d="M 75,45 C 60,65 55,100 58,135" stroke={hairColor} strokeWidth="6" strokeLinecap="round" />
            <path d="M 85,40 C 70,65 68,110 70,145" stroke={hairColor} strokeWidth="6" strokeLinecap="round" />
            <path d="M 135,40 C 150,65 152,110 150,145" stroke={hairColor} strokeWidth="6" strokeLinecap="round" />
            <path d="M 145,45 C 160,65 165,100 162,135" stroke={hairColor} strokeWidth="6" strokeLinecap="round" />
            {/* Gold clasps */}
            <rect x="55" y="90" width="7" height="4" fill="#fbbf24" rx="1" />
            <rect x="158" y="95" width="7" height="4" fill="#fbbf24" rx="1" />
          </g>
        );

      case 'celestial_bob':
        return (
          <g id="hair-bob">
            <path
              d="M 62,110 C 58,50 80,30 110,30 C 140,30 162,50 158,110 C 152,70 145,50 110,50 C 75,50 68,70 62,110 Z"
              fill={hairColor}
            />
            <path d="M 60,95 L 75,120 L 78,95 Z" fill={hairColor} />
            <path d="M 160,95 L 145,120 L 142,95 Z" fill={hairColor} />
          </g>
        );

      case 'wild_drift':
      default:
        return (
          <g id="hair-wild">
            <path
              d="M 55,95 C 45,50 75,20 110,20 C 145,20 175,50 165,95 C 155,55 140,40 110,40 C 80,40 65,55 55,95 Z"
              fill={hairColor}
            />
            <path d="M 50,75 C 38,60 55,40 70,45 Z" fill={hairColor} />
            <path d="M 170,75 C 182,60 165,40 150,45 Z" fill={hairColor} />
            <path d="M 95,22 C 105,8 125,12 135,24 Z" fill={hairColor} />
          </g>
        );
    }
  };

  // Facial feature / scars / marks generator
  const renderFacialFeature = () => {
    switch (character.facialFeature) {
      case 'koi_whisker_mark':
        return (
          <g id="feature-koi-whiskers" opacity="0.85">
            {/* Glowing cyan whiskers on cheeks */}
            <path d="M 78,105 Q 65,108 58,102" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 77,112 Q 62,116 55,112" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M 142,105 Q 155,108 162,102" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 143,112 Q 158,116 165,112" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'storm_scar':
        return (
          <g id="feature-storm-scar">
            {/* Jagged scar across left eye */}
            <path
              d="M 88,80 L 92,94 L 89,102 L 94,115"
              stroke="#e11d48"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.8"
              fill="none"
            />
            <circle cx="92" cy="94" r="1.5" fill="#fda4af" />
          </g>
        );

      case 'star_talisman':
        return (
          <g id="feature-star-talisman">
            {/* Glowing diamond rune on forehead */}
            <polygon points="110,54 114,60 110,66 106,60" fill="#38bdf8" />
            <circle cx="110" cy="60" r="1.5" fill="#ffffff" />
            <circle cx="110" cy="60" r="5" stroke="#38bdf8" strokeWidth="0.8" fill="none" opacity="0.6" />
          </g>
        );

      case 'cloud_tattoos':
        return (
          <g id="feature-cloud-tattoos" opacity="0.7">
            {/* Swirling wind swirls */}
            <path d="M 80,105 C 75,100 70,110 82,112" stroke="#60a5fa" strokeWidth="1.8" fill="none" />
            <path d="M 140,105 C 145,100 150,110 138,112" stroke="#60a5fa" strokeWidth="1.8" fill="none" />
          </g>
        );

      case 'porcelain_freckles':
        return (
          <g id="feature-freckles" fill="#f8fafc" opacity="0.65">
            <circle cx="85" cy="106" r="1.2" />
            <circle cx="89" cy="109" r="0.9" />
            <circle cx="82" cy="111" r="1.1" />
            <circle cx="135" cy="106" r="1.2" />
            <circle cx="131" cy="109" r="0.9" />
            <circle cx="138" cy="111" r="1.1" />
            <circle cx="110" cy="104" r="0.9" />
          </g>
        );

      case 'gilded_eyeshadow':
        return (
          <g id="feature-eyeshadow" opacity="0.8">
            <path d="M 80,91 Q 92,86 100,92" stroke="#fbbf24" strokeWidth="3" fill="none" />
            <path d="M 140,91 Q 128,86 120,92" stroke="#fbbf24" strokeWidth="3" fill="none" />
            <circle cx="78" cy="91" r="1.5" fill="#f59e0b" />
            <circle cx="142" cy="91" r="1.5" fill="#f59e0b" />
          </g>
        );

      case 'none':
      default:
        return null;
    }
  };

  // Accessory overlay generator
  const renderAccessory = () => {
    switch (character.accessory) {
      case 'gilded_goggles':
        return (
          <g id="acc-goggles">
            {/* Strap */}
            <path d="M 62,62 C 60,60 160,60 158,62" stroke="#78350f" strokeWidth="4" fill="none" />
            {/* Brass rims on forehead */}
            <circle cx="92" cy="58" r="14" fill="#1e293b" stroke="#f59e0b" strokeWidth="3.5" />
            <circle cx="128" cy="58" r="14" fill="#1e293b" stroke="#f59e0b" strokeWidth="3.5" />
            {/* Lenses with amber glare */}
            <circle cx="92" cy="58" r="10" fill="#b45309" opacity="0.7" />
            <circle cx="128" cy="58" r="10" fill="#b45309" opacity="0.7" />
            <path d="M 86,52 L 96,62" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />
            <path d="M 122,52 L 132,62" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />
            {/* Bridge */}
            <rect x="104" y="56" width="12" height="4" rx="2" fill="#d97706" />
          </g>
        );

      case 'lantern_earring':
        return (
          <g id="acc-earring">
            <line x1="68" y1="102" x2="66" y2="114" stroke="#fbbf24" strokeWidth="1.5" />
            <circle cx="66" cy="118" r="5" fill="#38bdf8" stroke="#f59e0b" strokeWidth="1.5" />
            <circle cx="66" cy="118" r="2" fill="#ffffff" />
            <circle cx="66" cy="118" r="8" fill="#38bdf8" opacity="0.3" />
          </g>
        );

      case 'aviator_monocle':
        return (
          <g id="acc-monocle">
            <circle cx="130" cy="94" r="12" fill="none" stroke="#fbbf24" strokeWidth="2.5" />
            <circle cx="130" cy="94" r="11" fill="#38bdf8" opacity="0.2" />
            <line x1="142" y1="94" x2="152" y2="108" stroke="#fbbf24" strokeWidth="1.5" />
          </g>
        );

      case 'silk_face_veil':
        return (
          <g id="acc-veil" opacity="0.9">
            <path
              d="M 75,108 C 85,115 135,115 145,108 L 140,145 C 130,150 90,150 80,145 Z"
              fill="#1e1b4b"
              stroke="#4338ca"
              strokeWidth="1.5"
            />
            <path d="M 75,108 L 145,108" stroke="#fbbf24" strokeWidth="2" />
          </g>
        );

      case 'brass_hairpin':
        return (
          <g id="acc-hairpin">
            <line x1="135" y1="20" x2="165" y2="45" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
            <circle cx="135" cy="20" r="4" fill="#ef4444" />
          </g>
        );

      case 'none':
      default:
        return null;
    }
  };

  return (
    <div className={`relative ${sizeClasses} ${className} select-none flex items-center justify-center`}>
      <svg
        viewBox="0 0 220 220"
        className="w-full h-full drop-shadow-lg rounded-2xl overflow-visible"
      >
        <defs>
          {/* Background circular gradient */}
          <radialGradient id={`bgGrad-${character.name}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="80%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>

          {/* Koi Glow filter */}
          <filter id="koiGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Circular Frame */}
        <circle cx="110" cy="110" r="100" fill={`url(#bgGrad-${character.name})`} stroke="#334155" strokeWidth="2" />

        {/* Ambient Moon Starlight Rays */}
        <circle cx="110" cy="110" r="85" fill="none" stroke="#38bdf8" strokeWidth="0.8" opacity="0.2" strokeDasharray="4 4" />

        {/* Swimming Moon-Koi Companion (Nami) in background/orbit */}
        {showKoiCompanion && (
          <g id="koi-companion" filter="url(#koiGlow)">
            {/* Swimming Koi Silhouette */}
            <path
              d="M 185,90 Q 200,60 180,45 Q 160,40 170,70 Q 175,85 185,90 Z"
              fill={companionColor}
              opacity="0.85"
            />
            {/* Tail fins with wave */}
            <path
              d="M 180,45 Q 195,30 205,38 Q 190,48 185,45 Z"
              fill={companionColor}
              opacity="0.7"
            />
            <path
              d="M 175,43 Q 165,25 180,28 Q 178,38 175,43 Z"
              fill={companionColor}
              opacity="0.7"
            />
            {/* Whisker light trail */}
            <circle cx="180" cy="85" r="2.5" fill="#ffffff" />
            <circle cx="180" cy="85" r="8" fill={companionColor} opacity="0.35" />
          </g>
        )}

        {/* Shoulder & Courier Mantle (Rig Outfit) */}
        <g id="body-outfit">
          {/* Shoulders */}
          <path
            d="M 35,210 C 35,160 70,148 110,148 C 150,148 185,160 185,210 Z"
            fill={outfit.mantle}
          />
          {/* Collar Lapels */}
          <path
            d="M 75,148 L 110,185 L 85,210 L 48,190 Z"
            fill={outfit.collar}
          />
          <path
            d="M 145,148 L 110,185 L 135,210 L 172,190 Z"
            fill={outfit.collar}
          />
          {/* Central Trim & Brass Badge */}
          <path d="M 108,185 L 110,210 L 112,185 Z" fill={outfit.trim} stroke={outfit.trim} strokeWidth="3" />
          <circle cx="110" cy="180" r="5" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
        </g>

        {/* Neck */}
        <path
          d="M 94,130 L 94,155 C 94,162 126,162 126,155 L 126,130 Z"
          fill={character.skinTone}
        />
        {/* Neck Shadow under chin */}
        <path d="M 94,132 C 104,142 116,142 126,132 Z" fill="#000000" opacity="0.15" />

        {/* Head / Face shape */}
        <g id="face-base">
          {character.faceShape === 'round' ? (
            <ellipse cx="110" cy="98" rx="36" ry="40" fill={character.skinTone} />
          ) : character.faceShape === 'chiseled' ? (
            <path
              d="M 74,80 C 74,60 90,56 110,56 C 130,56 146,60 146,80 C 146,105 138,128 110,138 C 82,128 74,105 74,80 Z"
              fill={character.skinTone}
            />
          ) : character.faceShape === 'angular' ? (
            <path
              d="M 75,80 C 75,60 90,56 110,56 C 130,56 145,60 145,80 C 145,108 132,130 110,136 C 88,130 75,108 75,80 Z"
              fill={character.skinTone}
            />
          ) : (
            /* Sharp / Default */
            <path
              d="M 76,82 C 76,60 90,58 110,58 C 130,58 144,60 144,82 C 144,110 134,132 110,137 C 86,132 76,110 76,82 Z"
              fill={character.skinTone}
            />
          )}

          {/* Subtle Cheekbone / Jaw Shading */}
          <path
            d="M 78,92 C 82,112 94,128 110,134 C 126,128 138,112 142,92 C 136,120 124,131 110,131 C 96,131 84,120 78,92 Z"
            fill="#000000"
            opacity="0.12"
          />
        </g>

        {/* Ears & Ear studs */}
        <ellipse cx="73" cy="96" rx="5" ry="9" fill={character.skinTone} />
        <ellipse cx="147" cy="96" rx="5" ry="9" fill={character.skinTone} />

        {/* Eyebrows */}
        <g id="eyebrows">
          {character.eyebrows === 'thick' ? (
            <>
              <path d="M 83,82 Q 93,76 103,81" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 137,82 Q 127,76 117,81" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </>
          ) : character.eyebrows === 'straight' ? (
            <>
              <line x1="84" y1="81" x2="102" y2="81" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="136" y1="81" x2="118" y2="81" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />
            </>
          ) : (
            /* Arched / Default */
            <>
              <path d="M 84,82 Q 93,77 102,82" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <path d="M 136,82 Q 127,77 118,82" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            </>
          )}
        </g>

        {/* Eyes */}
        <g id="eyes">
          {/* Eye Whites */}
          <path d="M 84,93 Q 93,87 102,93 Q 93,99 84,93 Z" fill="#ffffff" />
          <path d="M 136,93 Q 127,87 118,93 Q 127,99 136,93 Z" fill="#ffffff" />

          {/* Irises */}
          <circle cx="93" cy="93" r="4.2" fill={character.eyeColor || '#38bdf8'} />
          <circle cx="127" cy="93" r="4.2" fill={character.eyeColor || '#38bdf8'} />

          {/* Pupils */}
          <circle cx="93" cy="93" r="2.2" fill="#020617" />
          <circle cx="127" cy="93" r="2.2" fill="#020617" />

          {/* Glint of moonlight */}
          <circle cx="91.5" cy="91.5" r="1" fill="#ffffff" />
          <circle cx="125.5" cy="91.5" r="1" fill="#ffffff" />

          {/* Mystic Glow if chosen */}
          {character.eyeStyle === 'mystic_glow' && (
            <>
              <circle cx="93" cy="93" r="6" fill={character.eyeColor || '#38bdf8'} opacity="0.35" />
              <circle cx="127" cy="93" r="6" fill={character.eyeColor || '#38bdf8'} opacity="0.35" />
            </>
          )}
        </g>

        {/* Nose */}
        <path d="M 110,88 L 107,108 L 113,108" stroke="#000000" strokeWidth="1.2" strokeLinecap="round" opacity="0.35" fill="none" />

        {/* Mouth */}
        <path d="M 103,118 Q 110,122 117,118" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Facial Markings / Scars / Freckles */}
        {renderFacialFeature()}

        {/* Hair Layer */}
        {renderHair()}

        {/* Accessories Layer */}
        {renderAccessory()}
      </svg>
    </div>
  );
};
