"use client";

import Image from "next/image";
import { useChat } from "@ai-sdk/react";

import Banner from "./assets/img/Banner.jpg";
import F1GPTLogo from "./assets/img/sunilProfessional.jpg";

import PromptSuggestionsRow from "./components/PromptSuggestionsRow";
import LoadingBubble from "./components/LoadingBubble";
import Bubble from "./components/Bubble";

const Home = () => {
  const { messages, input, setInput, append, isLoading } = useChat();

  const noMessages = messages.length === 0;

  const handlePrompt = (promptText: string) => {
    append({
      role: "user",
      content: promptText,
    });
  };

  return (
    <main>
      <Image src={F1GPTLogo} width={250} alt="F1GPT Logo" />

      <section className={noMessages ? "" : "populated"}>
        {noMessages ? (
          <>
            <p className="starter-text">
              The ultimate place for Formula One super fans! Ask F1GPT anything
              about F1 racing and get up-to-date answers.
            </p>
            <br />
            <PromptSuggestionsRow onPromptClick={handlePrompt} />
          </>
        ) : (
          <>
            {messages.map((message, index) => (
              <Bubble key={`message-${index}`} message={message} />
            ))}

            {isLoading && <LoadingBubble />}
          </>
        )}
      </section>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim()) return;

          append({
            role: "user",
            content: input,
          });

          setInput("");
        }}
      >
        <input
          className="question-box"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me something"
          disabled={isLoading}
        />
        <input type="submit" disabled={isLoading} />
      </form>
    </main>
  );
};

export default Home;
