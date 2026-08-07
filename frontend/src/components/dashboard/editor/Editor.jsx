"use client";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import "./quillEditor.css";
import { formats, modules } from "./quillEditorConfig";

// Dynamically import React Quill with SSR disabled
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const Editor = ({
  value,
  onChange,
}) => {
  return (
    <div className="h-fit overflow-hidden border border-gray-500 rounded-xl">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={"Write something awesome..."}
        modules={modules}
        formats={formats}
        className="h-75 border-0"
      />
    </div>
  );
};

export default Editor;
