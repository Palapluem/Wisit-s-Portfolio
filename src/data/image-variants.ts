// Right-sized WebP copies in public/images/r/, named <name>-<width>.webp. The widths never exceed the
// source image. Regenerate them whenever a source image in public/images/ changes.
export const imageVariants: Record<string, number[]> = {
  'images/coffee-chain-winning-team.jpg': [480, 960, 1600],
  'images/wisit-profile.jpg': [450],
  'images/cruit-app-career.png': [480, 960, 1440],
  'images/cruit-app-career-mobile.png': [390],
  'images/thai-public-data-dashboard.png': [480, 960, 1280],
  'images/twenty-constitutions-cover.png': [480, 960, 1400],
  'images/gemmaclip-cover.png': [480, 960, 1400],
  'images/cruit-poster.png': [480, 960, 991],
  'images/twenty-constitutions-final-datasets.webp': [480, 960, 1600],
  'images/twenty-constitutions-pipeline.webp': [480, 960, 1600],
  'images/twenty-constitutions-topic-modeling.webp': [480, 960, 1600],
};
