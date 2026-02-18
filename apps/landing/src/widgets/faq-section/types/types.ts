import { ReactNode } from "react"

export type Question = 'rebase' | 'overcollateral' | 'clarity'
export type QuestionButtonProps = {
    selectedQuestion: Question | null,
    questionToSelect: Question,
    handleSelect: (question: Question | null) => void,
    children: ReactNode
}

export type FaqSectionProps = {
    isMobile?: boolean,
    isDesktop?: boolean
}