import {Sound} from '../system/audio/Sound';
import Scene from '../system/Scene';
import {Keys} from '../system/input';
import {ButtonUIElement, UIElement} from '../system/ui';
import * as sounds from '../sounds';

export default class SoundEffectTestScene extends Scene {
  private sfxButtons: ButtonUIElement[] = [];
  private backButton!: ButtonUIElement;

  loadContent() {
    let y = 10;

    const sfx: {[index: string]: Sound} = {
      bossdeath: sounds.bossdeath,
      craft: sounds.craft,
      death: sounds.death,
      monsterhurt: sounds.monsterhurt,
      pickup: sounds.pickup,
      playerhurt: sounds.playerhurt,
      test: sounds.test,
    };
    for (const key in sfx) {
      const btn = new ButtonUIElement(
        this.tileset,
        this.font,
        key.toUpperCase(),
        10,
        (y += 10),
        UIElement.ROOT
      );
      btn.disableClickSound = true;
      btn.onClick = () => {
        sfx[key].play();
      };
      this.sfxButtons.push(btn);
    }

    y += 10;

    this.backButton = new ButtonUIElement(
      this.tileset,
      this.font,
      '< BACK',
      10,
      (y += 10),
      UIElement.ROOT
    );
    this.backButton.onClick = () => {
      this.exitScene();
    };
  }

  unloadContent() {
    for (let n = 0; n < this.sfxButtons.length; n++) {
      this.sfxButtons[n].close();
    }
    this.sfxButtons = [];
    this.backButton.close();
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
