
import { Howl } from 'howler';

export const clickSound = new Howl({
  src: ['/sounds/click.mp3'],
  volume: 0.5
});

export const hoverSound = new Howl({
  src: ['/sounds/hover.wav'],
  volume: 0.3
});

export const successSound = new Howl({
  src: ['/sounds/success.wav'],
  volume: 0.5
});

export const errorSound = new Howl({
  src: ['/sounds/error.wav'],
  volume: 0.5
});