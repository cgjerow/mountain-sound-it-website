export default (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy("src/style.css");
  eleventyConfig.addPassthroughCopy("src/hero.jpg");

  return {
    // When a passthrough file is modified, rebuild the pages:
    passthroughFileCopy: true,
    dir: {
      input: "src",
      output: "docs",
      includes: "_includes",
      data: "_data",
    },
  };
};
