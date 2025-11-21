import { useEffect, useState } from "react";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import ReactMarkdown from "react-markdown";
import "./App.css";
const Ns = ({ ns, dark }) => {
  const [heading, setheading] = useState(false);
  const [nswer, setnswer] = useState(ns);
  useEffect(() => {
    setheading(lp(ns));
    setnswer(ns.replace(/^\*+|\*+$/g, ""));
    function lp(ns) {
      return /^(\*)(\*)(.*)\*$/.test(ns);
    }
  }, []);

  return (
    <>
      {heading ? (
        <span
          className={`py-1.5 block font-bold text-2xl ${
            dark ? "text-indigo-50" : ""
          }`}
        >
          {nswer}{" "}
        </span>
      ) : (
        <span className=" nswer text-lg w-9/12 text-[rgb(218 218 218)] ">
          <ReactMarkdown
            rehypePlugins={[rehypeHighlight]}
            components={{
              pre: ({ node, ...props }) => (
                <pre
                  {...props}
                  className={`rounded-lg p-3 my-2 overflow-x-auto ${
                    dark ? "bg-zinc-900 text-white" : "bg-gray-200 text-black"
                  }`}
                />
              ),
              code: ({ node, inline, className, children, ...props }) => (
                <code
                  {...props}
                  className={`font-mono text-sm ${
                    inline ? "bg-gray-700 px-1 py-0.5 rounded" : ""
                  }`}
                >
                  {children}
                </code>
              ),
            }}
          >
            {nswer}
          </ReactMarkdown>
        </span>
      )}
    </>
  );
};

export default Ns;
