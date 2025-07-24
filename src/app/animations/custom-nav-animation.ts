// import { AnimationController, Router } from '@ionic/angular';
// import { createAnimation, } from '@ionic/angular';
import {
  createAnimation,
  Animation,
  AnimationController,
} from '@ionic/angular';


export const customNavAnimation = (_: HTMLElement, opts: any) => {
  const easing = 'cubic-bezier(0.36,0.66,0.04,1)';
  const DURATION = 350;
  const rootAnimation = createAnimation().duration(DURATION).easing(easing);
  const enteringAnimation = createAnimation()
    .addElement(opts.enteringEl)
    .fromTo('opacity', 0, 1);

  const leavingAnimation = createAnimation()
    .addElement(opts.leavingEl)
    .fromTo('opacity', 1, 0)

  if (opts.direction === 'forward') {
    enteringAnimation.fromTo('transform', 'translateX(100%)', 'translateX(0%)');
    leavingAnimation.fromTo('transform', 'translateX(0%)', 'translateX(-100%)');
  } else {
    enteringAnimation.fromTo('transform', 'translateX(-100%)', 'translateX(0%)');
    leavingAnimation.fromTo('transform', 'translateX(0%)', 'translateX(100%)');
  }

  rootAnimation.addAnimation([enteringAnimation, leavingAnimation]);
  return rootAnimation;
}
