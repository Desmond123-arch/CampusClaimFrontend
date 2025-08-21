import { ModalController, ToastController, ToastOptions } from "@ionic/angular";

export async function presentToast(toastController: ToastController, message: string, color: ToastOptions["color"], duration: number) {
  const existingToast = await toastController.getTop();
  if (existingToast) {
    await existingToast.dismiss();
  }
  const toast = await toastController.create({
    message: message,
    duration: duration,
    position: 'top',
    animated: true,
    color: color,
  });
  await toast.present();
}

export async function closeAllToasts(toastController: ToastController) {
  let toast = await toastController.getTop();
  while (toast) {
    await toast.dismiss();
    toast = await toastController.getTop();
  }
}


export async function dismissAllModals(modalController: ModalController) {
  while (await modalController.getTop()) {
    try {
      await modalController.dismiss();
    } catch (e) {
      console.error('Error dismissing modal:', e);
      break;
    }
  }
}