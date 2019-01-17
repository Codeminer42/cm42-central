export const cloudnaryUrl = () =>
  process.env.CLOUDINARY_URL;

export const cloudName = () =>
  cloudnaryUrl().substring(cloudnaryUrl().indexOf('@') + 1);

export const uploadPreset = () =>
  process.env.CLOUDINARY_UPLOAD_PRESET;

export const uploadUrl = () => {
  return `https://api.cloudinary.com/v1_1/${cloudName()}/upload`
}
