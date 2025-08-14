import { LoadingController } from "@ionic/angular"


export const showLoading = async (loadingCtrl: LoadingController) => {
  const loading = await loadingCtrl.create({
    cssClass: 'custom-loading',
    spinner: 'circles',
    // duration: 500,
  })
  await loading.present()
}
export const closeLoading = async (loadingCtrl: LoadingController) => {
  await loadingCtrl.dismiss();
}
