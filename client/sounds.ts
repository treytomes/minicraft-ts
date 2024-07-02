import {Sound} from './system/audio/Sound';

export let bossdeath: Sound;
export let craft: Sound;
export let death: Sound;
export let monsterhurt: Sound;
export let pickup: Sound;
export let playerhurt: Sound;
export let test: Sound;

export const loadContent = async () => {
  bossdeath = await window.resources.load(Sound, 'bossdeath.wav');
  craft = await window.resources.load(Sound, 'craft.wav');
  death = await window.resources.load(Sound, 'death.wav');
  monsterhurt = await window.resources.load(Sound, 'monsterhurt.wav');
  pickup = await window.resources.load(Sound, 'pickup.wav');
  playerhurt = await window.resources.load(Sound, 'playerhurt.wav');
  test = await window.resources.load(Sound, 'test.wav');
};
