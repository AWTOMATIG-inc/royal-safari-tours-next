import { useState } from "react";
import { truncateHTML } from "./TruncateHTML";
const initialWord = 150;

function StringToDomComponent({ htmlString }) {
  const [word, setWord] = useState(initialWord);
  const { htmlText, wordCount } = truncateHTML(htmlString, word) ?? {
    htmlText: "",
    wordCount: 0,
  };
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: htmlText }} />
      {wordCount > initialWord &&
        (initialWord == word ? (
          <button
            onClick={() => setWord(htmlString.length)}
            style={{ fontSize: "0.9rem" }}
            className="btn btn-link text-decoration-underline text-primary"
          >
            Show More
          </button>
        ) : (
          <button
            onClick={() => setWord(initialWord)}
            style={{ fontSize: "0.9rem" }}
            className="btn btn-link text-decoration-underline text-primary"
          >
            Show Less
          </button>
        ))}
    </div>
  );
}

export default StringToDomComponent;
