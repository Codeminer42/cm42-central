export const cloudnaryUrl = () => {
  console.log(process.env.CLOUDINARY_URL)
  return process.env.CLOUDINARY_URL;
}

export const cloudName = () => {
  const cloud = cloudnaryUrl().substring(cloudnaryUrl().indexOf('@') + 1);
  console.log(cloud)
  return cloud;
}

export const uploadPreset = () => {
  console.log(process.env.CLOUDINARY_UPLOAD_PRESET)
  return process.env.CLOUDINARY_UPLOAD_PRESET;
}

export const uploadUrl = () => {
  const url = `https://api.cloudinary.com/v1_1/${cloudName()}/upload`
  console.log(url)
  return url
}

export const getFileLink = (resourceType, path) => {
  const link = `http://res.cloudinary.com/${cloudName()}/${resourceType}/upload/${path}`
  console.log(link);
  return link
}
