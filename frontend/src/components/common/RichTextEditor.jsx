"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { Icon } from "@iconify/react";
import { useEffect } from "react";

export default function RichTextEditor({ value, onChange, placeholder = "Enter content...", label, required = false }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer",
        },
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "rich-text-content p-4 min-h-[140px] max-h-[300px] overflow-y-auto text-xs text-gray-800 focus:outline-none leading-relaxed prose prose-xs max-w-none",
      },
      // Sanitize pasted HTML: Strip any junk inline background/font styles from Google Docs/Word
      transformPastedHTML(html) {
        if (!html) return "";
        return html
          .replace(/style="[^"]*"/gi, "")
          .replace(/class="[^"]*"/gi, "");
      },
    },
  });

  useEffect(() => {
    if (editor && value !== undefined && editor.getHTML() !== value) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return null;

  const handleSetLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL link (e.g. https://royalsafari.com):", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const handleClearFormatting = () => {
    // Strips all bold, italic, underline, background styles, alignment, and resets nodes to plain paragraph
    editor.chain().focus().unsetAllMarks().clearNodes().setTextAlign("left").run();
  };

  return (
    <div className="space-y-1.5 font-body">
      {label && (
        <label className="block text-xs font-semibold text-gray-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="border border-gray-300 rounded-2xl overflow-hidden focus-within:border-[#2cb775] transition-colors bg-white shadow-xs">
        {/* TipTap Rich Formatting Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200 text-gray-700 select-none">
          {/* Heading Dropdown */}
          <select
            value={
              editor.isActive("heading", { level: 1 })
                ? "h1"
                : editor.isActive("heading", { level: 2 })
                ? "h2"
                : editor.isActive("heading", { level: 3 })
                ? "h3"
                : "p"
            }
            onChange={(e) => {
              const val = e.target.value;
              if (val === "p") editor.chain().focus().setParagraph().run();
              else if (val === "h1") editor.chain().focus().toggleHeading({ level: 1 }).run();
              else if (val === "h2") editor.chain().focus().toggleHeading({ level: 2 }).run();
              else if (val === "h3") editor.chain().focus().toggleHeading({ level: 3 }).run();
            }}
            className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold text-gray-700 focus:outline-none cursor-pointer"
          >
            <option value="p">Normal Text</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
          </select>

          <div className="w-px h-4 bg-gray-300 mx-1" />

          {/* Text Style Controls */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded-lg transition-colors font-bold text-xs cursor-pointer ${
              editor.isActive("bold")
                ? "bg-[#2cb775] text-white shadow-xs"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Bold"
          >
            <Icon icon="lucide:bold" className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded-lg transition-colors italic text-xs cursor-pointer ${
              editor.isActive("italic")
                ? "bg-[#2cb775] text-white shadow-xs"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Italic"
          >
            <Icon icon="lucide:italic" className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1.5 rounded-lg transition-colors text-xs cursor-pointer ${
              editor.isActive("underline")
                ? "bg-[#2cb775] text-white shadow-xs"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Underline"
          >
            <Icon icon="lucide:underline" className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-1.5 rounded-lg transition-colors text-xs cursor-pointer ${
              editor.isActive("strike")
                ? "bg-[#2cb775] text-white shadow-xs"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Strikethrough"
          >
            <Icon icon="lucide:strikethrough" className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-gray-300 mx-1" />

          {/* Text Alignment Controls */}
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              editor.isActive({ textAlign: "left" })
                ? "bg-[#2cb775] text-white shadow-xs"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Align Left"
          >
            <Icon icon="lucide:align-left" className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              editor.isActive({ textAlign: "center" })
                ? "bg-[#2cb775] text-white shadow-xs"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Align Center"
          >
            <Icon icon="lucide:align-center" className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              editor.isActive({ textAlign: "right" })
                ? "bg-[#2cb775] text-white shadow-xs"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Align Right"
          >
            <Icon icon="lucide:align-right" className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              editor.isActive({ textAlign: "justify" })
                ? "bg-[#2cb775] text-white shadow-xs"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Justify Text"
          >
            <Icon icon="lucide:align-justify" className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-gray-300 mx-1" />

          {/* Lists */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              editor.isActive("bulletList")
                ? "bg-[#2cb775] text-white shadow-xs"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Bullet List"
          >
            <Icon icon="lucide:list" className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              editor.isActive("orderedList")
                ? "bg-[#2cb775] text-white shadow-xs"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Numbered List"
          >
            <Icon icon="lucide:list-ordered" className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-gray-300 mx-1" />

          {/* Blockquote, Rule & Link */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              editor.isActive("blockquote")
                ? "bg-[#2cb775] text-white shadow-xs"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Blockquote"
          >
            <Icon icon="lucide:quote" className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
            title="Horizontal Line"
          >
            <Icon icon="lucide:minus" className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleSetLink}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              editor.isActive("link")
                ? "bg-blue-600 text-white shadow-xs"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Insert / Edit Link"
          >
            <Icon icon="lucide:link" className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-gray-300 mx-1" />

          {/* Undo / Redo & Clear Formatting */}
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-700 disabled:opacity-30 transition-colors cursor-pointer"
            title="Undo"
          >
            <Icon icon="lucide:undo" className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-700 disabled:opacity-30 transition-colors cursor-pointer"
            title="Redo"
          >
            <Icon icon="lucide:redo" className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleClearFormatting}
            className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer ml-auto"
            title="Clear Formatting (Strips pasted background boxes & junk styles)"
          >
            <Icon icon="lucide:rotate-ccw" className="w-4 h-4" />
          </button>
        </div>

        {/* TipTap Editor Content */}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
