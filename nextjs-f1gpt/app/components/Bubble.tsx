// Bubble.tsx
type BubbleProps = {
  message: {
    role: string;
    content: string;
  };
};

const Bubble = ({ message }: BubbleProps) => {
  const role =
    message.role === "assistant" || message.role === "user"
      ? message.role
      : "assistant";

  return <div className={`${role} bubble`}>{message.content}</div>;
};

export default Bubble;
