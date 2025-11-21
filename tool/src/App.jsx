import { useEffect, useRef, useState } from "react";
import "./App.css";
import { url } from "./constants";
import Ns from "./Ns";
function App() {
  const [question, AskQuestion] = useState("");
  const [result, setresult] = useState([]);
  const [recenthistory, sethistory] = useState([]);
  const scrolltoTop = useRef("");
  const [loder, setloder] = useState(false);
  let [dark, setdark] = useState("dark");
  let [set, setstyle] = useState(true);
  // if (localStorage.getItem("history")) {
  //   sethistory([...JSON.parse(localStorage.getItem("history"))]);
  // }
  const open = {};
  const close = {};

  async function handlehistorysearch(e) {
    let sq = e.target.innerHTML;
    // console.log(sq);
    const payload = {
      contents: [
        {
          parts: [{ text: sq }],
        },
      ],
    };
    setloder(true);
    let response = await fetch(url, {
      method: "post",
      body: JSON.stringify(payload),
    });
    response = await response.json();
    // console.log(response);
    let r = response.candidates[0].content.parts[0].text;
    r = r.split("* ");
    r = r.map((i) => i.trim());
    setresult([...result, { type: "q", text: sq }, { type: "b", text: r }]);
    setloder(false);
    setTimeout(() => {
      scrolltoTop.current.scrollTop = scrolltoTop.current.scrollHeight;
    }, 500);
  }
  function keydown(e) {
    if (e.key == "Enter") {
      getanswer();
    }
  }

  async function getanswer() {
    try {
      setloder(true);

      const payload1 = {
        contents: [
          {
            role: "user",
            parts: [{ text: question }],
          },
        ],
      };
      const payload = {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `
System Note:
Dhruv's Introduction:
-Speak respectfully about Dhruv . 
-Dhruv is a passionate full-stack web developer who builds modern and clean applications.
He works with JavaScript, React, Node.js, MongoDB, Tailwind CSS and loves creating smooth UI/UX.
He enjoys learning new technologies, solving problems, and helping people through smart tools and automation.
Whenever someone asks “Who made you?” or “Who trined this bot?”, reply clearly:
“This AI assistant was trined by Dhruv ”
- Tum ek friendly AI ho, jisme new emojis ka use karte ho but very less less  only 1 for 1 pg
- Answer ko clear aur interactive banate ho (funny type)
- Long paragraphs ko small points me break karte ho  
- Human jaisa reply style rakhte ho  
- Asking user-friendly follow-up questions bhi kar sakte ho  
- user ke Text ke hisab se English hindi ya koi or language use krni  output ke liye 
- do not use * in reply (strict)
- if someone asked about my (dhruv) details send him https://portfolio-jtnf.vercel.app/ 
- Rules:
1. do not use name of dhruv repeatedly 
2. If a user asks for any movie/song download link, MP3, torrent, or pirated content:
   - Never give illegal links.
   - Instead, provide ONLY:
       • YouTube search link
       • IMDB page (for movies)
       • Spotify/official streaming link (for songs)
`,
              },
            ],
          },
          ...result.map((item) => ({
            role: item.type === "q" ? "user" : "model",
            parts: [
              {
                text: Array.isArray(item.text)
                  ? item.text.join("\n")
                  : item.text,
              },
            ],
          })),

          {
            role: "user",
            parts: [{ text: question }],
          },
        ],
      };

      let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Server error... Please try again!");
      }

      response = await response.json();

      // If response structure changes or empty
      if (
        !response.candidates ||
        !response.candidates[0]?.content?.parts[0]?.text
      ) {
        throw new Error("No valid response from AI.");
      }

      // SUCCESS PARSE
      let r = response.candidates[0].content.parts[0].text;
      r = r.split("* ").map((i) => i.trim());

      let qu = question[0].toUpperCase() + question.slice(1);

      setresult([...result, { type: "q", text: qu }, { type: "b", text: r }]);

      AskQuestion("");

      if (localStorage.getItem("history")) {
        let history = JSON.parse(localStorage.getItem("history"));
        history = [qu, ...history].map((it) => it.trim());
        history = [...new Set(history)];
        history = history.slice(0, 9);
        localStorage.setItem("history", JSON.stringify(history));
        sethistory(history);
      } else {
        localStorage.setItem("history", JSON.stringify([qu]));
        sethistory([qu]);
      }

      // Auto scroll
      setTimeout(() => {
        scrolltoTop.current.scrollTop = scrolltoTop.current.scrollHeight;
      }, 500);
    } catch (error) {
      setresult([
        ...result,
        { type: "q", text: question },
        { type: "b", text: [`❌ Error: ${error.message}`] },
      ]);
    } finally {
      setloder(false);
    }
  }

  useEffect(() => {
    // console.log(dark);
    if (dark == "light") {
      setdark("");
    }
  }, [dark]);

  function deleteit(e, it) {
    console.log(it);
    let history = JSON.parse(localStorage.getItem("history")) || [];
    history = history.filter((ite) => ite != it);
    localStorage.setItem("history", JSON.stringify(history));
    sethistory(history);
  }
  return (
    <>
      <div className="grid grid-cols-5">
        <button
          className=" openclose fixed z-50 text-green-50 cursor-pointer left-2 top-[10px]"
          onClick={() => {
            setstyle((pr) => !pr);
          }}
        >
          {set ? (
            <i
              className={`fa-regular fa-x ${dark ? "" : "text-zinc-700"} `}
            ></i>
          ) : (
            <i className="fa-solid fa-bars"></i>
          )}
        </button>
        <div
          className={`text-white  col-span-1 left 
            overflow-hidden
             transform transition-transform duration-300 ease-in-out
          ${set ? "translate-x-0" : " -translate-x-full"}
            md:static md:translate-x-0 md:w-auto md:max-w-none md:p-0
           text-cente  ${dark ? "bg-zinc-800" : "bg-zinc-100"}`}
        >
          <select
            onChange={(e) => setdark(e.target.value)}
            className={`fixed mb-[100px] z-20  bottom-2 left-2 text-sl p-1 border-2 border-zinc-700 rounded-2xl
              ${dark ? "bg-zinc-900" : "bg-zinc-100"}
              ${dark ? "text-zinc-200" : "text-zinc-900"}`}
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
          <h2
            className={`w-[80%] text-xl p-1.5 ml-5 mt-[7px] border-2 overflow-hidden ${
              dark ? "border-white" : "border-zinc-300"
            }  rounded-xl flex justify-center items-center  gap-1.5 ${
              dark ? "" : "text-zinc-900"
            }`}
          >
            <span className="text-1">Recent History</span>
            <button
              className="mt-0"
              onClick={() => {
                sethistory([]);
                localStorage.clear();
                localStorage.setItem("history", JSON.stringify([]));
              }}
            >
              <svg
                className="bg-zinc-800"
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="#e3e3e3"
              >
                <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
              </svg>
            </button>
          </h2>
          <ul className="text-sl text-left overflow-auto ">
            {recenthistory.length != 0 &&
              recenthistory.map((it, inr) => (
                <li
                  key={inr + Math.random()}
                  className={`historyshown p-1 mt-1 pl-2 pb-1.5 truncate cursor-pointer hover:bg-zinc-700 hover:text-zinc-200 ${
                    dark ? "text-zinc-200" : "text-zinc-900"
                  } flex flex-row justify-between items-center `}
                  // onClick={(e) => handlehistorysearch(e)}
                >
                  {it}
                  <button
                    onClick={(e) => deleteit(e, it)}
                    className="m-[9px] cursor-pointer text-2xl"
                  >
                    <i class="fa-solid fa-delete-left"></i>
                  </button>
                </li>
              ))}
          </ul>
        </div>
        <div
          className={`write col-span-4  rigt h-dvh ${
            dark ? "bg-zinc-900" : "bg-zinc-300"
          } 
          ${dark ? "text-zinc-100" : "text-zinc-900"}`}
        >
          <div
            ref={scrolltoTop}
            className="heading size-80 overflow-y-scroll  overflow-x-hidden h-150"
          >
            <ul>
              {result.length == 0 ? (
                <li>Ask , your question</li>
              ) : loder ? (
                <svg
                  aria-hidden="true"
                  className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              ) : (
                result.map((i, k) => (
                  <div
                    className={i.type == "q" ? "flex justify-end" : " "}
                    key={k}
                  >
                    {i.type == "q" ? (
                      <li
                        key={k + Math.random()}
                        className={`mr-11 text-right text-2xl p-2 text-white border-8 border-zinc-800 rounded-tl-3xl rounded-br-3xl rounded-bl-3xl w-fit bg-zinc-800`}
                      >
                        <Ns ns={i.text} dark={dark}></Ns>
                      </li>
                    ) : (
                      i.text.map((it, ki) => (
                        <li
                          key={ki + Math.random()}
                          className="pt-3 text-left pl-7 "
                        >
                          <Ns ns={it}></Ns>
                        </li>
                      ))
                    )}
                  </div>
                ))
              )}
            </ul>
          </div>
          <div className={`searchbar flex ${dark ? "bg-zinc-900" : " "} `}>
            <div
              className={`search ${
                dark ? "bg-zinc-900" : "bg-[rgb(245_250_246)]"
              }`}
            >
              <input
                type="text"
                onKeyDown={(e) => keydown(e)}
                value={question}
                onChange={(e) => AskQuestion(e.target.value)}
                name="text"
                id=""
                placeholder="enter"
                className={dark ? "text-zinc-400" : "text-zinc-800"}
              />
              <button
                className={dark ? "" : "text-zinc-900"}
                onClick={getanswer}
              >
                Ask
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
