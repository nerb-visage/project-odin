import { useCVContext } from "../../../contexts/CVContext";
import { useSectionEditHandlerContext } from "../../../contexts/SectionEditabilityContext";
import { useSkillDataContext } from "../../../contexts/SkillDataContext";
import PlusIcon from "../../../icons/Plus";

export default function SkillDetail() {
	const { info, cvHandler: setCVInfo } = useCVContext();
	const { data: skill, editabilityHandler: setEditable } =
		useSkillDataContext();
	const { sectionEditHandlers } = useSectionEditHandlerContext();

	return (
		<div
			className="flex items-center border-slate-600 border-2 hover:bg-slate-600 rounded-md px-4 py-1 cursor-pointer hover:scale-105 transition-transform group"
			onClick={() => {
				for (const sectionSetEditable of sectionEditHandlers) {
					sectionSetEditable(false);
				}
				setEditable(true);
			}}
		>
			<PlusIcon
				className="h-3 fill-red-700 transition-all rotate-45 max-w-0 pointer-events-none ml-0 \
				group-hover:pointer-events-auto group-hover:fill-white group-hover:max-w-lg hover:scale-125 group-hover:mr-2"
				onClick={() => {
					setCVInfo({
						...info,
						skills: info.skills.filter((s) => s.id !== skill.id),
					});
				}}
			/>
			<span className="text-slate-700 group-hover:text-white">
				{skill.name}
			</span>
		</div>
	);
}
