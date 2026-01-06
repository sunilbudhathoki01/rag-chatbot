import { title } from "process";
import "./global.css";
export const metadata = {
  title: "F1GPT",
  description: "The place to go for all your formula one question",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="eng">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
