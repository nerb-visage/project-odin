import { useEffect, useRef, useState } from "react";

interface Props
	extends React.DetailedHTMLProps<
		React.HTMLAttributes<HTMLDivElement>,
		HTMLDivElement
	> {
	children: React.ReactNode;
	rotateDegree?: number;
	maxGlareOpacity?: number;
	minGlareOpacity?: number;
}

const GLARE_OPACITY = {
	MIN: 0.2,
	MAX: 0.6,
} as const;
const ROTATE_DEGREE = 12 as const;

export default function Tilt({
	children,
	rotateDegree = ROTATE_DEGREE,
	minGlareOpacity = GLARE_OPACITY.MIN,
	maxGlareOpacity = GLARE_OPACITY.MAX,
	onClick: handleClick,
	...props
}: Props) {
	const [dimensions, setDimensions] = useState({ height: 0, width: 0 });
	const [degree, setDegree] = useState({ x: 0, y: 0 });
	const [glareRotation, setGlareRotation] = useState(0);
	const [glareOpacity, setGlareOpacity] = useState(0);
	const ref = useRef<HTMLDivElement>(null);

	function getTilt(offsetX: number, offsetY: number) {
		const origin = { x: dimensions.width / 2, y: dimensions.height / 2 };
		let tilt = {
			y: (offsetY - origin.y) / origin.y,
			x: (offsetX - origin.x) / origin.x,
		};
		return tilt;
	}
	function clamp(value: number, min: number, max: number) {
		return Math.max(Math.min(value, max), min);
	}
	function resetValues() {
		setGlareRotation(0);
		setDegree({
			x: 0,
			y: 0,
		});
		setGlareOpacity(0);
	}

	useEffect(() => {
		setDimensions({
			height: ref.current!.offsetHeight,
			width: ref.current!.offsetWidth,
		});
		resetValues();
	}, []);

	return (
		<div
			{...props}
			onClick={(e) => {
				handleClick!(e);
				resetValues();
			}}
			className="group tilt cursor-pointer"
			ref={ref}
			onMouseMove={(e) => {
				if (e.currentTarget == ref.current) {
					const { offsetX, offsetY } = e.nativeEvent;
					const origin = {
						x: dimensions.width / 2,
						y: dimensions.height / 2,
					};
					const tilt = getTilt(offsetX, offsetY);
					const rotation =
						Math.atan2(offsetX - origin.x, -(offsetY - origin.y)) *
						(180 / Math.PI);
					setDegree({
						y: tilt.x * rotateDegree,
						x: tilt.y * rotateDegree * -1,
					});
					setGlareRotation(rotation);
					setGlareOpacity(
						clamp(
							Math.max(Math.abs(tilt.x), Math.abs(tilt.y)),
							minGlareOpacity,
							maxGlareOpacity
						)
					);
				}
			}}
			onMouseOut={resetValues}
			onMouseLeave={resetValues}
		>
			<div
				style={{
					transform: `perspective(1000px) rotateX(${degree.x}deg) rotateY(${degree.y}deg) scale3d(1, 1, 1)`,
				}}
			>
				{children}
				<div className="overflow-hidden h-full w-full absolute top-0 left-0">
					<div
						style={{
							rotate: `${glareRotation}deg`,
							opacity: `${glareOpacity}`,
						}}
						className="absolute w-[29rem] aspect-square top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] origin-[0%_0%_0px] from-white via-white/20 to-transparent bg-gradient-to-b pointer-events-none"
					></div>
				</div>
			</div>
		</div>
	);
}
