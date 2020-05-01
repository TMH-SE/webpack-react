import { CloudinaryImageUploadAdapter } from 'ckeditor-cloudinary-uploader-adapter'

const CustomUploadAdapterPlugin = (editor) => {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new CloudinaryImageUploadAdapter(
      loader,
      process.env.CLOUD_NAME,
      process.env.UPLOAD_PRESET
    )
  }
}

export { CustomUploadAdapterPlugin }
