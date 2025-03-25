from dblur.default.nafnet import NAFNetTester, deblur_single_img

model = NAFNetTester().get_model()
model_path = "NAFNet-SIDD-width32.pth"
deblur_single_img(model_path=model_path, blur_img_path="samples_images/pic0.jpeg", sharp_img_path="sharp_image.jpeg", is_checkpoint=False)