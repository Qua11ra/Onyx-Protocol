import Link from "next/link";
import { LinkButtonProps } from "./types/types";

const LinkButton = ({id}: LinkButtonProps) => {
	return (
		<Link id={id} href={"http://localhost:3007"}>
			<div className="p-3 group">
				<button
					className={`cursor-pointer min-w-fit text-white rounded-lg bg-indigo-950 font-medium px-6 py-3 text-2xl transition-all duration-100 group-hover:bg-gray-400 group-hover:scale-110`}
				>
					Launch App
				</button>
			</div>
		</Link>
	);
};

export default LinkButton;
