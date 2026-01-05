"use client";

import Image from "next/image";
import { useChat } from "@ai-sdk/react";

import Banner from "./assets/img/Banner.jpg";
import F1GPTLogo from "./assets/img/sunilProfessional.jpg";

const Home = () => {
  const { messages, input, setInput, append, isLoading } = useChat();

  const noMessages = messages.length === 0;

  return (
    <main>
      <Image src={F1GPTLogo} width={250} alt="F1GPT Logo" />

      <section>
        {noMessages ? (
          <>
            <p className="starter-text">
              The ultimate place for Formula One super fans! Ask F1GPT anything
              about F1 racing and get up-to-date answers.
            </p>
            <br />
            {/* <PromptSuggestionRow /> */}
          </>
        ) : (
          <>
            {messages.map((m) => (
              <p key={m.id}>
                <strong>{m.role}:</strong> {m.content}
              </p>
            ))}
          </>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!input.trim()) return;

            append({ role: "user", content: input });
            setInput("");
          }}
        >
          <input
            className="question-box"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me something"
          />
          <input type="submit" disabled={isLoading} />
        </form>
      </section>
    </main>
  );
};

export default Home;
