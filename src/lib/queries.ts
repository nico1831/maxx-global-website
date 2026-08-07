// All GROQ queries used across the site.
// Product image is projected to just the first image to keep payloads lean on list pages.

export const catalogProductsQuery = /* groq */ `
  *[_type == "product"] | order(coalesce(displayOrder, 9999) asc, title asc) {
    _id,
    title,
    slug,
    modelCode,
    availability,
    "brand": brand->{ _id, name, slug },
    "primaryCategory": primaryCategory->{ _id, title, slug, "parent": parent->{ _id, title, slug } },
    "image": images[0]{ asset, alt },
    isEcoPowr,
    isFeatured,
    shortDescription
  }
`

export const categoryTreeQuery = /* groq */ `
  *[_type == "category" && !defined(parent)] | order(coalesce(displayOrder, 9999) asc, title asc) {
    _id,
    title,
    slug,
    image,
    "children": *[_type == "category" && parent._ref == ^._id] | order(coalesce(displayOrder, 9999) asc, title asc) {
      _id,
      title,
      slug
    }
  }
`

export const allBrandsQuery = /* groq */ `
  *[_type == "brand"] | order(coalesce(displayOrder, 9999) asc, name asc) {
    _id,
    name,
    slug,
    tagline,
    logo,
    originCountry,
    originCity,
    isFeatured
  }
`

export const brandsQuery = /* groq */ `
  *[_type == "brand"] | order(coalesce(displayOrder, 9999) asc, name asc) {
    _id,
    name,
    slug,
    tagline,
    logo,
    originCountry,
    originCity,
    secondaryOrigin,
    "productCount": count(*[_type == "product" && brand._ref == ^._id])
  }
`

export const brandBySlugQuery = /* groq */ `
  *[_type == "brand" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    tagline,
    logo,
    heroImage,
    description,
    originCountry,
    originCity,
    secondaryOrigin,
    website,
    "productCount": count(*[_type == "product" && brand._ref == ^._id]),
    "categoryTitles": *[_type == "product" && brand._ref == ^._id].primaryCategory->{
      "title": coalesce(parent->title, title)
    }.title,
    "products": *[_type == "product" && brand._ref == ^._id] | order(coalesce(displayOrder, 9999) asc, title asc) [0...8] {
      _id,
      title,
      slug,
      modelCode,
      availability,
      "brand": brand->{ _id, name, slug },
      "primaryCategory": primaryCategory->{ _id, title, slug, "parent": parent->{ _id, title, slug } },
      "image": images[0]{ asset, alt }
    },
    "projectCount": count(*[_type == "project" && references(^._id) && permissionOnFile == true && displayAs != "hidden"]),
    "firstProjectYear": *[_type == "project" && references(^._id) && permissionOnFile == true && displayAs != "hidden"] | order(year asc) [0].year,
    "projects": *[_type == "project" && references(^._id) && permissionOnFile == true && displayAs != "hidden"] | order(year desc) [0...3] {
      _id,
      title,
      clientName,
      displayAs,
      anonymisedLabel,
      location,
      year,
      "segmentName": segment->title,
      "image": images[0]{ asset, alt }
    }
  }
`

export const productBySlugQuery = /* groq */ `
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    modelCode,
    availability,
    leadTimeNote,
    shortDescription,
    description,
    keyFeatures,
    "specSheet": specSheet.asset->{ url, originalFilename, size },
    videoUrl,
    isEcoPowr,
    b2cUrl,
    "brand": brand->{ _id, name, slug, logo, tagline, originCountry, originCity, secondaryOrigin },
    "primaryCategory": primaryCategory->{ _id, title, slug, "parent": parent->{ _id, title, slug } },
    "additionalCategories": additionalCategories[]->{ _id, title, slug },
    "segments": segments[]->{ _id, title, slug },
    "images": images[]{ asset, alt },
    "relatedProducts": relatedProducts[]->{ _id, title, slug, modelCode, availability, "image": images[0]{ asset, alt }, "brand": brand->{ name } },
    seo
  }
`

export const categoryWithProductsQuery = /* groq */ `
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    image,
    "parent": parent->{ _id, title, slug },
    "children": *[_type == "category" && parent._ref == ^._id] | order(coalesce(displayOrder, 9999) asc) {
      _id,
      title,
      slug,
      "productCount": count(*[_type == "product" && primaryCategory._ref == ^._id])
    },
    "products": *[_type == "product" && primaryCategory._ref == ^._id] | order(coalesce(displayOrder, 9999) asc, title asc) {
      _id,
      title,
      slug,
      modelCode,
      availability,
      "brand": brand->{ _id, name, slug },
      "image": images[0]{ asset, alt },
      shortDescription
    }
  }
`
