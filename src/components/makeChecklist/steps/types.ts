export type Message = { sender: 'bot' | 'user'; text: string };

// 공통 props
export interface StepCommonProps {
  addMsg: (msg: Message) => void;
}