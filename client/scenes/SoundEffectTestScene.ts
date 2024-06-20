import {Sound} from '../system/audio/sound';
import Game from '../system/Game';
import Scene from '../system/Scene';
import {Keys} from '../system/input';
import {ButtonUIElement} from '../system/ui';

export default class SoundEffectTestScene extends Scene {
  constructor(game: Game) {
    super(game);

    let y = 10;

    const sfx: {[index: string]: Sound} = {
      bossdeath: Sound.bossdeath,
      craft: Sound.craft,
      death: Sound.death,
      monsterhurt: Sound.monsterhurt,
      pickup: Sound.pickup,
      playerhurt: Sound.playerhurt,
      test: Sound.test,
    };

    for (const key in sfx) {
      const btn = new ButtonUIElement(
        this.tileset,
        this.font,
        key.toUpperCase(),
        10,
        (y += 10),
        this.uiRoot
      );
      btn.disableClickSound = true;
      btn.onClick = () => {
        sfx[key].play();
      };
    }

    y += 10;

    const backButton = new ButtonUIElement(
      this.tileset,
      this.font,
      '< BACK',
      10,
      (y += 10),
      this.uiRoot
    );
    backButton.onClick = () => {
      this.exitScene();
    };
  }

  onKeyDown(e: KeyboardEvent) {
    super.onKeyDown(e);

    switch (e.key) {
      case Keys.Escape:
        this.exitScene();
        break;
    }
  }
}
