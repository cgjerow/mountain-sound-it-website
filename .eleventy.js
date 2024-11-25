export default (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy("src/style.css");

  return {
    // When a passthrough file is modified, rebuild the pages:
    passthroughFileCopy: true,
    dir: {
      input: "src",
      output: "public",
      includes: "_includes",
      data: "_data",
    },
  };
};
