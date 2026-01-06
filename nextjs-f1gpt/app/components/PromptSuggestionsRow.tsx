import React from "react";
import PromptSuggestionButton from "./PromptSuggestionButton";

const PromptSuggestionsRow = ({ onPromptClick }) => {
  const prompts = [
    "What is Formula One commonly abbreviated as?",
    "Which organization is responsible for the rules and governance of Formula One racing?",
    "In what year was the first official Formula One World Championship held?",
    "What is the name of the highest class of international auto racing for open-wheel single-seater formula racing cars?",
    "Which type of engines were first introduced in Formula One in the late 1980s and became standard after 2014 in hybrid form?",
    "How many championship titles does a driver win when he accumulates the highest number of points over a season?",
    "What term describes the team competition in Formula One, where points are scored by the team based on the results of both drivers?",
    "Which famous racing event is traditionally associated with the opening of the Formula One season?",
  ];
  return (
    <div className="prompt-suggestion-row">
      {prompts.map((prompt, index) => (
        <PromptSuggestionButton
          key={`suggestion-${index}`}
          text={prompt}
          onClick={() => onPromptClick(prompt)}
        />
      ))}
    </div>
  );
};

export default PromptSuggestionsRow;
