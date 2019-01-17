export const deserialize = ({
  publicId,
  version,
  format,
  resourceType
}) =>
  (
    {
      publicId,
      version,
      format,
      resourceType,
      path: `v${version}/${publicId}.${format}`
    }
  )
