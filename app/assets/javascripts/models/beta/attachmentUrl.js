export const cloudnaryUrl = () => (
  process.env.CLOUDINARY_URL
);

export const cloudnaryPublicLink = () => (
  cloudnaryUrl().substring(cloudnaryUrl().indexOf('@') + 1)
);
