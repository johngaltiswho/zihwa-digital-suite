const React = require("react");

module.exports = {
  Swiper: ({ children }) =>
    React.createElement("div", { "data-testid": "swiper" }, children),

  SwiperSlide: ({ children }) =>
    React.createElement("div", { "data-testid": "swiper-slide" }, children),
};
