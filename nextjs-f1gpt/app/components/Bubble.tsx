type BubbleProps = {
  message: {
    role: "user" | "assistant";
    content: string;
  };
};

const Bubble = ({ message }: BubbleProps) => {
  const { content, role } = message;

  return <div className={`${role} bubble`}>{content}</div>;
};

export default Bubble;
