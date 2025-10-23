'use client';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function HeroAnimation() {
  return (
    <div style={{ width: 300, height: 300 }}>
      <DotLottieReact
        src="https://nuhmanpk.github.io/portfolio/animations/loader.lottie"
        loop
        autoplay
        style={{ width: 300, height: 300 }}
      />
    </div>
  );
}
