'use client'
import{ lazy, useState } from "react";
import { FaqSectionProps, Question } from "./types/types";
import QuestionButton from "./components/QuestionButton";

const LazyRebase = lazy(() => import("./components/questions/RebaseQuestion"))
const LazyOvercollateral = lazy(() => import("./components/questions/OvercollateralQuestion"))
const LazyClarity = lazy(() => import("./components/questions/ClarityQuestion"))

const FaqSection = ({isMobile, isDesktop}: FaqSectionProps) => {
	const [question, setQuestion] = useState<Question | null>(null);

	return (
		<section
			id="faq"
			className={`w-screen ${isDesktop ? "p-[5vw] h-screen" : "flex-col h-fit"} flex justify-between items-center`}
		>
			<div
				id="faq-content"
				className={`h-full flex flex-col p-10 ${isMobile ? "w-full" : "w-1/2"} gap-y-10 items-center justify-center transition-all`}
			>
				<h2 id="faq-title" className="font-medium text-6xl">
					FAQ
				</h2>
				<div className="flex flex-col w-full justify-center items-center gap-y-10">
					<QuestionButton
						selectedQuestion={question}
						questionToSelect="rebase"
						handleSelect={setQuestion}
					>
						<p>{`What does { rebase token } mean?`}</p>
					</QuestionButton>
					{isMobile && question && question === "rebase" && (
						<LazyRebase isMobile={isMobile} />
					)}
					<QuestionButton
						selectedQuestion={question}
						questionToSelect="overcollateral"
						handleSelect={setQuestion}
					>
						<p>Why should I lock 200% collateral?</p>
					</QuestionButton>
					{isMobile && question && question === "overcollateral" && (
						<LazyOvercollateral isMobile={isMobile} />
					)}
					<QuestionButton
						selectedQuestion={question}
						questionToSelect="clarity"
						handleSelect={setQuestion}
					>
						<p>Why can I trust Onyx Protocol?</p>
					</QuestionButton>
					{isMobile && question && question === "clarity" && (
						<LazyClarity isMobile={isMobile} />
					)}
				</div>
			</div>
			<div
				className={`${isDesktop && "w-1/2"} h-fit py-10 flex justify-center items-center`}
			>
				{question && isMobile === false && (
					<>
						{question === "rebase" && <LazyRebase isMobile={isMobile} />}
						{question === "overcollateral" && (
							<LazyOvercollateral isMobile={isMobile} />
						)}
						{question === "clarity" && <LazyClarity isMobile={isMobile} />}
					</>
				)}
			</div>
		</section>
	);
};

export default FaqSection;
