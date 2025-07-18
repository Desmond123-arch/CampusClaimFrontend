// import { AnimationController, Router } from '@ionic/angular';
// import { createAnimation, } from '@ionic/angular';
import {
  createAnimation,
  Animation,
} from '@ionic/angular';

export const customNavAnimatoin = (_: HTMLElement, opts: any) => {
  const enteringEl = opts.enteringEl;
  const leavingEl = opts.leavingEl;

  const enterAnimation = createAnimation()
  .addElement(enteringEl)
  .duration(300)
  .easing('ease-in')
  .fromTo('opacity', 0, 1)

  const leaveAnimation = createAnimation()
  .addElement(leavingEl)
  .duration(350)
  .easing('ease-out')
  .fromTo('opacity', 1, 0);

  return createAnimation()
  .addAnimation([enterAnimation, leaveAnimation])
}

export const slowIosTransition = (_: HTMLElement, opts: any): Animation => {
  const OFF_RIGHT = '100%';
  const CENTER = '0%';
  const OFF_LEFT = '-33%';

  const enteringEl = opts.enteringEl;
  const leavingEl = opts.leavingEl;

  const duration = 600; // 👈 slow it down (default is ~280ms)

  const easing = 'cubic-bezier(0.36,0.66,0.04,1)';

  const enteringAnimation = createAnimation()
    .addElement(enteringEl)
    .beforeRemoveClass('ion-page-invisible')
    .duration(duration)
    .easing(easing)
    .fromTo('transform', `translateX(${OFF_RIGHT})`, `translateX(${CENTER})`)
    .fromTo('opacity', 0.8, 1);

  const leavingAnimation = createAnimation()
    .addElement(leavingEl)
    .duration(duration)
    .easing(easing)
    .fromTo('transform', `translateX(${CENTER})`, `translateX(${OFF_LEFT})`)
    .fromTo('opacity', 1, 0.8);

  return createAnimation()
    .addAnimation([enteringAnimation, leavingAnimation])
    .duration(duration);
};