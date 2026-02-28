const editorsTools = [
  {
    toolName: "blur",
    toolValueUnit: "px",
    toolValue: { min: 0, max: 20, defaultValue: 0 },
  },

  {
    toolName: "brightness",
    toolValueUnit: "%",
    toolValue: { min: 0, max: 1000, defaultValue: 100 },
  },

  {
    toolName: "contrast",
    toolValueUnit: "",
    toolValue: { min: 0, max: 10, defaultValue: 1 },
  },

  {
    toolName: "saturate",
    toolValueUnit: "",
    toolValue: { min: 0, max: 5, defaultValue: 1 },
  },

  {
    toolName: "sepia",
    toolValueUnit: "%",
    toolValue: { min: 0, max: 100, defaultValue: 0 },
  },

  {
    toolName: "grayscale",
    toolValueUnit: "%",
    toolValue: { min: 0, max: 100, defaultValue: 0 },
  },

  {
    toolName: "hue-rotate",
    toolValueUnit: "deg",
    toolValue: { min: 0, max: 180, defaultValue: 0 },
  },

  {
    toolName: "invert",
    toolValueUnit: "%",
    toolValue: { min: 0, max: 100, defaultValue: 0 },
  },

  {
    toolName: "opacity",
    toolValueUnit: "%",
    toolValue: { min: 0, max: 100, defaultValue: 100 },
  },
];

const otherTools = [
  {
    toolName: "rotate",
    toolValueUnit: "deg",
    toolValue: { min: 0, max: 360, defaultValue: 90 },
  },
  {
    toolName: "zoom",
    toolValueUnit: "",
    toolValue: { min: 1, max: 5, defaultValue: 1 },
  },
];

const Button_Style = `py-3 px-6 shadow-2xl shadow-black/90 bg-Light-2 text-Dark-1 text-lg md:text-xl lg:text-2xl rounded-xl flex justify-center items-center gap-2 cursor-pointer relative capitalize`;

let Image_URL_Regex = /(https?:\/\/.*\.(?:png|jpe?g|gif|webp)(?:\?.*)?)/i;

let Image_Extension = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "bmp",
  "svg",
  "tiff",
  "tif",
  "ico",
  "heic",
  "heif",
  "avif",
  "jfif",
  "pjpeg",
  "pjp",
  "apng",
  "raw",
  "cr2",
  "nef",
  "orf",
  "sr2",
  "dng",
];

export {
  editorsTools,
  Button_Style,
  Image_URL_Regex,
  Image_Extension,
  otherTools,
};
