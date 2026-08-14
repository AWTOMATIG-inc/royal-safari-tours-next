"use client";
import ImageResize from "quill-image-resize-module-react";
import { Quill } from "react-quill-new";
// Register module
Quill.register("modules/imageResize", ImageResize);
// Register the module
if (
  typeof window !== "undefined" &&
  Quill &&
  !Quill.imports["modules/imageResize"]
) {
  Quill.register("modules/imageResize", ImageResize);
}
export const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }], // Use the registered fonts
    [{ size: ["small", false, "large", "huge"] }], // Custom sizes
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["link", "image", "video"],
    ["clean"],
  ],

  imageResize: {
    // options
    parchment: Quill.import("parchment"),
    modules: ["Resize", "DisplaySize", "Toolbar"],
  },
};

export const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "indent",
  "script",
  "align",
  "color",
  "background",
  "link",
  "image",
  "video",
];
